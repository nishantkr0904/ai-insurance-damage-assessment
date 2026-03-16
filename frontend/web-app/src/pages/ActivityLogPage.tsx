import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, Search, Upload, Brain, CheckCircle, XCircle,
  ShieldAlert, FileText, LogIn, Settings, RefreshCw,
  ChevronDown, AlertCircle, Info,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { InputField } from '../components/ui/InputField';

type EventType = 'upload' | 'analysis' | 'approved' | 'rejected' | 'fraud' | 'report' | 'login' | 'settings' | 'error';

interface ActivityEvent {
  id: string;
  type: EventType;
  message: string;
  user: string;
  claimId?: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
}

const now = Date.now();
const min = 60 * 1000;
const hr = 60 * min;

const mockEvents: ActivityEvent[] = [
  { id: 'e1',  type: 'upload',   message: 'Damage images uploaded for claim CLM-003',          user: 'Alex Johnson',   claimId: 'CLM-003', timestamp: new Date(now - 5 * min).toISOString(),     level: 'info' },
  { id: 'e2',  type: 'analysis', message: 'AI damage detection completed for CLM-003',          user: 'System',         claimId: 'CLM-003', timestamp: new Date(now - 4 * min).toISOString(),     level: 'success' },
  { id: 'e3',  type: 'fraud',    message: 'Fraud risk flag raised on CLM-002 (Medium risk)',    user: 'System',         claimId: 'CLM-002', timestamp: new Date(now - 20 * min).toISOString(),    level: 'warning' },
  { id: 'e4',  type: 'approved', message: 'Claim CLM-001 approved by admin',                   user: 'James Liu',      claimId: 'CLM-001', timestamp: new Date(now - 1 * hr).toISOString(),      level: 'success' },
  { id: 'e5',  type: 'report',   message: 'PDF report generated for CLM-001',                  user: 'System',         claimId: 'CLM-001', timestamp: new Date(now - 1 * hr - 5 * min).toISOString(), level: 'info' },
  { id: 'e6',  type: 'login',    message: 'Admin login: james@example.com',                    user: 'James Liu',                          timestamp: new Date(now - 2 * hr).toISOString(),      level: 'info' },
  { id: 'e7',  type: 'rejected', message: 'Claim CLM-004 rejected due to fraud flags',         user: 'Carlos Rivera',  claimId: 'CLM-004', timestamp: new Date(now - 3 * hr).toISOString(),      level: 'error' },
  { id: 'e8',  type: 'upload',   message: 'Damage images uploaded for claim CLM-002',          user: 'Maria Santos',   claimId: 'CLM-002', timestamp: new Date(now - 5 * hr).toISOString(),      level: 'info' },
  { id: 'e9',  type: 'analysis', message: 'Cost estimation completed for CLM-002 ($5,800)',     user: 'System',         claimId: 'CLM-002', timestamp: new Date(now - 5 * hr - 2 * min).toISOString(), level: 'success' },
  { id: 'e10', type: 'error',    message: 'AI pipeline timeout on CLM-005 — retried successfully', user: 'System',     claimId: 'CLM-005', timestamp: new Date(now - 6 * hr).toISOString(),      level: 'error' },
  { id: 'e11', type: 'settings', message: 'Fraud threshold updated to 0.35 by admin',          user: 'James Liu',                          timestamp: new Date(now - 8 * hr).toISOString(),      level: 'warning' },
  { id: 'e12', type: 'login',    message: 'User login: maria@example.com',                     user: 'Maria Santos',                       timestamp: new Date(now - 10 * hr).toISOString(),     level: 'info' },
  { id: 'e13', type: 'upload',   message: 'Damage images uploaded for claim CLM-001',          user: 'Alex Johnson',   claimId: 'CLM-001', timestamp: new Date(now - 24 * hr).toISOString(),     level: 'info' },
  { id: 'e14', type: 'analysis', message: 'Fraud analysis completed for CLM-001 (Low risk)',   user: 'System',         claimId: 'CLM-001', timestamp: new Date(now - 24 * hr - 1 * min).toISOString(), level: 'success' },
  { id: 'e15', type: 'error',    message: 'Image validation failed: unsupported format (CLM-006)', user: 'David Okonkwo', claimId: 'CLM-006', timestamp: new Date(now - 26 * hr).toISOString(), level: 'error' },
];

const eventConfig: Record<EventType, { icon: React.ComponentType<{ className?: string }>; label: string }> = {
  upload:   { icon: Upload,      label: 'Upload' },
  analysis: { icon: Brain,       label: 'Analysis' },
  approved: { icon: CheckCircle, label: 'Approved' },
  rejected: { icon: XCircle,     label: 'Rejected' },
  fraud:    { icon: ShieldAlert,  label: 'Fraud' },
  report:   { icon: FileText,    label: 'Report' },
  login:    { icon: LogIn,       label: 'Login' },
  settings: { icon: Settings,    label: 'Settings' },
  error:    { icon: AlertCircle, label: 'Error' },
};

const levelStyle = {
  info:    { dot: 'bg-indigo-400', row: '', icon: 'text-indigo-400' },
  success: { dot: 'bg-green-400',  row: '', icon: 'text-green-400' },
  warning: { dot: 'bg-yellow-400', row: 'bg-yellow-500/3', icon: 'text-yellow-400' },
  error:   { dot: 'bg-red-400',    row: 'bg-red-500/5',    icon: 'text-red-400' },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};
const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export default function ActivityLogPage() {
  const [search, setSearch]           = useState('');
  const [typeFilter, setTypeFilter]   = useState<EventType | 'all'>('all');
  const [levelFilter, setLevelFilter] = useState<'all' | 'info' | 'success' | 'warning' | 'error'>('all');
  const [refreshKey, setRefreshKey]   = useState(0);

  const filtered = mockEvents.filter((e) => {
    const matchSearch = e.message.toLowerCase().includes(search.toLowerCase()) ||
                        e.user.toLowerCase().includes(search.toLowerCase()) ||
                        (e.claimId ?? '').toLowerCase().includes(search.toLowerCase());
    const matchType  = typeFilter === 'all' || e.type === typeFilter;
    const matchLevel = levelFilter === 'all' || e.level === levelFilter;
    return matchSearch && matchType && matchLevel;
  });

  const levelCounts = {
    errors:   mockEvents.filter((e) => e.level === 'error').length,
    warnings: mockEvents.filter((e) => e.level === 'warning').length,
    total:    mockEvents.length,
  };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Activity className="w-8 h-8 text-indigo-400" />
            <span>Activity <span className="gradient-text">Log</span></span>
          </h1>
          <p className="text-slate-400 mt-1">System events, AI pipeline activity, and audit trail.</p>
        </div>
        <motion.button
          key={refreshKey}
          onClick={() => setRefreshKey((k) => k + 1)}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white border border-white/10 transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </motion.button>
      </motion.div>

      {/* Summary cards */}
      <motion.div
        variants={containerVariants} initial="hidden" animate="visible"
        className="grid grid-cols-3 gap-4 mb-6"
      >
        {[
          { label: 'Total Events', value: levelCounts.total, color: 'text-indigo-400', bg: 'from-indigo-500/20 to-indigo-500/5', icon: Info },
          { label: 'Warnings',     value: levelCounts.warnings, color: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-500/5', icon: AlertCircle },
          { label: 'Errors',       value: levelCounts.errors, color: 'text-red-400', bg: 'from-red-500/20 to-red-500/5', icon: XCircle },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <motion.div key={label} variants={rowVariants}>
            <Card className={`bg-gradient-to-br ${bg}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">{label}</span>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className={`text-3xl font-black ${color}`}>{value}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-3 mb-5"
      >
        <div className="flex-1">
          <InputField
            label=""
            placeholder="Search events, users, or claim IDs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
              className="glass rounded-xl px-4 py-2.5 text-sm text-slate-300 border border-white/10 focus:border-indigo-500/50 focus:outline-none appearance-none pr-8 cursor-pointer"
            >
              <option value="all">All Types</option>
              {Object.entries(eventConfig).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value as typeof levelFilter)}
              className="glass rounded-xl px-4 py-2.5 text-sm text-slate-300 border border-white/10 focus:border-indigo-500/50 focus:outline-none appearance-none pr-8 cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Log feed */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card>
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Activity className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="font-semibold text-slate-400">No events found</p>
            </div>
          ) : (
            <motion.div key={refreshKey} variants={containerVariants} initial="hidden" animate="visible"
              className="divide-y divide-white/5"
            >
              {filtered.map((event) => {
                const { icon: Icon, label } = eventConfig[event.type];
                const ls = levelStyle[event.level];
                return (
                  <motion.div key={event.id} variants={rowVariants}
                    className={`flex items-start gap-4 px-4 py-4 hover:bg-white/2 transition-colors ${ls.row}`}
                  >
                    {/* Icon */}
                    <div className={`w-8 h-8 rounded-lg glass flex items-center justify-center flex-shrink-0 mt-0.5 ${ls.icon}`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-slate-200 leading-snug">{event.message}</p>
                        <span className="text-xs text-slate-500 flex-shrink-0 ml-2">{timeAgo(event.timestamp)}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500">{event.user}</span>
                        {event.claimId && (
                          <span className="text-xs px-1.5 py-0.5 glass rounded-md text-indigo-400">{event.claimId}</span>
                        )}
                        <span className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider ${ls.icon}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${ls.dot}`} />
                          {label}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
          <div className="px-4 pt-3 pb-1 border-t border-white/5 text-xs text-slate-500">
            {filtered.length} event{filtered.length !== 1 ? 's' : ''} · Last updated just now
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
