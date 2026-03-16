import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Brain, Shield, Bell, Database, Save,
  AlertTriangle, Activity, Sliders,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { InputField } from '../components/ui/InputField';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';

const tabs = ['AI Models', 'Fraud Thresholds', 'Notifications', 'System'] as const;
type Tab = (typeof tabs)[number];

function ToggleRow({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-4 glass rounded-xl">
      <div>
        <p className="text-sm font-medium text-slate-200">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full relative transition-colors ${value ? 'bg-indigo-500' : 'bg-white/10'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${value ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('AI Models');
  const [saving, setSaving] = useState(false);

  const [aiSettings, setAiSettings] = useState({
    confidenceThreshold: '0.75',
    maxProcessingTime: '30',
    enableYOLO: true,
    enableEfficientNet: true,
    enableLLMReports: true,
    enableAutoApprove: false,
  });

  const [fraudSettings, setFraudSettings] = useState({
    highRiskThreshold: '0.70',
    mediumRiskThreshold: '0.40',
    enableDuplicateDetection: true,
    enableMetadataCheck: true,
    enableAIImageDetection: true,
    autoFlagHighRisk: true,
  });

  const [notifSettings, setNotifSettings] = useState({
    adminEmailAlerts: true,
    fraudEmailAlerts: true,
    dailySummary: false,
    slackIntegration: false,
  });

  const [sysSettings, setSysSettings] = useState({
    maxUploadSizeMB: '10',
    maxImagesPerClaim: '5',
    claimRetentionDays: '365',
    enableMaintenanceMode: false,
    enableDebugLogs: false,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    toast.success('Settings saved successfully.');
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black mb-1 flex items-center gap-3">
          <Settings className="w-7 h-7 text-slate-400" />
          Admin <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-slate-400">Configure AI models, thresholds, and system behaviour.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 glass rounded-xl p-1 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab ? 'gradient-brand text-white glow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── AI Models ── */}
      {activeTab === 'AI Models' && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="font-semibold mb-5 flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-400" /> Model Configuration
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <InputField
                  label="Min. Confidence Threshold"
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={aiSettings.confidenceThreshold}
                  onChange={(e) => setAiSettings((s) => ({ ...s, confidenceThreshold: e.target.value }))}
                />
                <InputField
                  label="Max Processing Time (s)"
                  type="number"
                  value={aiSettings.maxProcessingTime}
                  onChange={(e) => setAiSettings((s) => ({ ...s, maxProcessingTime: e.target.value }))}
                />
              </div>
              <div className="space-y-3">
                <ToggleRow label="Enable YOLOv8 Detection" desc="Real-time object detection for damage regions" value={aiSettings.enableYOLO} onChange={(v) => setAiSettings((s) => ({ ...s, enableYOLO: v }))} />
                <ToggleRow label="Enable EfficientNet" desc="Damage severity classification model" value={aiSettings.enableEfficientNet} onChange={(v) => setAiSettings((s) => ({ ...s, enableEfficientNet: v }))} />
                <ToggleRow label="Enable LLM Report Generation" desc="Auto-generate claim summaries using LLMs" value={aiSettings.enableLLMReports} onChange={(v) => setAiSettings((s) => ({ ...s, enableLLMReports: v }))} />
                <ToggleRow label="Auto-Approve Low Risk Claims" desc="Automatically approve claims with low fraud and minor damage" value={aiSettings.enableAutoApprove} onChange={(v) => setAiSettings((s) => ({ ...s, enableAutoApprove: v }))} />
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* ── Fraud Thresholds ── */}
      {activeTab === 'Fraud Thresholds' && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="font-semibold mb-5 flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" /> Risk Thresholds
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <InputField
                  label="High Risk Threshold"
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={fraudSettings.highRiskThreshold}
                  onChange={(e) => setFraudSettings((s) => ({ ...s, highRiskThreshold: e.target.value }))}
                />
                <InputField
                  label="Medium Risk Threshold"
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={fraudSettings.mediumRiskThreshold}
                  onChange={(e) => setFraudSettings((s) => ({ ...s, mediumRiskThreshold: e.target.value }))}
                />
              </div>
              <div className="p-4 glass rounded-xl border border-yellow-500/20 mb-5">
                <div className="flex items-center gap-2 text-sm text-yellow-400">
                  <AlertTriangle className="w-4 h-4" />
                  <p>Risk Score &gt; {fraudSettings.highRiskThreshold} = <strong>High Risk</strong> · &gt; {fraudSettings.mediumRiskThreshold} = <strong>Medium</strong> · else <strong>Low</strong></p>
                </div>
              </div>
              <div className="space-y-3">
                <ToggleRow label="Duplicate Image Detection" desc="Perceptual hashing to detect reused images" value={fraudSettings.enableDuplicateDetection} onChange={(v) => setFraudSettings((s) => ({ ...s, enableDuplicateDetection: v }))} />
                <ToggleRow label="EXIF Metadata Validation" desc="Detect tampered or inconsistent image metadata" value={fraudSettings.enableMetadataCheck} onChange={(v) => setFraudSettings((s) => ({ ...s, enableMetadataCheck: v }))} />
                <ToggleRow label="AI-Generated Image Detection" desc="Flag synthetic or heavily edited images" value={fraudSettings.enableAIImageDetection} onChange={(v) => setFraudSettings((s) => ({ ...s, enableAIImageDetection: v }))} />
                <ToggleRow label="Auto-Flag High Risk Claims" desc="Pause processing and alert admin immediately" value={fraudSettings.autoFlagHighRisk} onChange={(v) => setFraudSettings((s) => ({ ...s, autoFlagHighRisk: v }))} />
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* ── Notifications ── */}
      {activeTab === 'Notifications' && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="font-semibold mb-5 flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" /> Admin Alert Configuration
              </h3>
              <div className="space-y-3">
                <ToggleRow label="Admin Email Alerts" desc="Email notifications for all new claims" value={notifSettings.adminEmailAlerts} onChange={(v) => setNotifSettings((s) => ({ ...s, adminEmailAlerts: v }))} />
                <ToggleRow label="Fraud Email Alerts" desc="Immediate alerts for high-risk fraud detections" value={notifSettings.fraudEmailAlerts} onChange={(v) => setNotifSettings((s) => ({ ...s, fraudEmailAlerts: v }))} />
                <ToggleRow label="Daily Summary Digest" desc="Morning report with yesterday's claim stats" value={notifSettings.dailySummary} onChange={(v) => setNotifSettings((s) => ({ ...s, dailySummary: v }))} />
                <ToggleRow label="Slack Integration" desc="Post notifications to a Slack channel" value={notifSettings.slackIntegration} onChange={(v) => setNotifSettings((s) => ({ ...s, slackIntegration: v }))} />
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* ── System ── */}
      {activeTab === 'System' && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="font-semibold mb-5 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" /> Upload Limits
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <InputField
                  label="Max Upload (MB)"
                  type="number"
                  value={sysSettings.maxUploadSizeMB}
                  onChange={(e) => setSysSettings((s) => ({ ...s, maxUploadSizeMB: e.target.value }))}
                />
                <InputField
                  label="Max Images / Claim"
                  type="number"
                  value={sysSettings.maxImagesPerClaim}
                  onChange={(e) => setSysSettings((s) => ({ ...s, maxImagesPerClaim: e.target.value }))}
                />
                <InputField
                  label="Data Retention (days)"
                  type="number"
                  value={sysSettings.claimRetentionDays}
                  onChange={(e) => setSysSettings((s) => ({ ...s, claimRetentionDays: e.target.value }))}
                />
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="font-semibold mb-5 flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-400" /> System Controls
              </h3>
              <div className="space-y-3">
                <ToggleRow label="Maintenance Mode" desc="Temporarily disable claim submissions" value={sysSettings.enableMaintenanceMode} onChange={(v) => setSysSettings((s) => ({ ...s, enableMaintenanceMode: v }))} />
                <ToggleRow label="Debug Logging" desc="Enable verbose logs for all AI pipeline steps" value={sysSettings.enableDebugLogs} onChange={(v) => setSysSettings((s) => ({ ...s, enableDebugLogs: v }))} />
              </div>
              {sysSettings.enableMaintenanceMode && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <strong>Maintenance mode is ON.</strong> Users cannot submit new claims.
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" /> Storage & Database
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: 'DB Storage', value: '2.4 GB', sub: 'MongoDB Atlas' },
                  { label: 'Image Storage', value: '48.7 GB', sub: 'AWS S3' },
                  { label: 'Cache', value: '128 MB', sub: 'Redis' },
                ].map(({ label, value, sub }) => (
                  <div key={label} className="glass rounded-xl p-4">
                    <p className="text-xs text-slate-500 mb-1">{label}</p>
                    <p className="font-bold text-slate-100">{value}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Save button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-6 flex justify-end">
        <Button loading={saving} icon={<Save className="w-4 h-4" />} onClick={handleSave}>
          Save Settings
        </Button>
      </motion.div>
    </div>
  );
}
