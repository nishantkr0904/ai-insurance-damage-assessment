import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Lock, Bell, Shield, Save,
  Camera, CheckCircle,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { InputField } from '../components/ui/InputField';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const tabs = ['Profile', 'Security', 'Notifications'] as const;
type Tab = (typeof tabs)[number];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ name: user?.name ?? '', email: user?.email ?? '', phone: '', address: '' });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [notifPrefs, setNotifPrefs] = useState({
    claimUpdates: true, fraudAlerts: true, approvalNotices: true, weeklyReport: false,
  });

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Profile updated successfully.');
    setSaving(false);
  };

  const handleSavePassword = async () => {
    if (passwords.newPass !== passwords.confirm) { toast.error('Passwords do not match.'); return; }
    if (passwords.newPass.length < 8) { toast.error('Password must be at least 8 characters.'); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Password changed successfully.');
    setPasswords({ current: '', newPass: '', confirm: '' });
    setSaving(false);
  };

  const handleSaveNotifs = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success('Notification preferences saved.');
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black mb-1">Profile & <span className="gradient-text">Settings</span></h1>
        <p className="text-slate-400">Manage your account, security, and preferences.</p>
      </motion.div>

      {/* Avatar + summary */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="flex items-center gap-5 mb-6">
          <div className="relative">
            <div className="w-20 h-20 gradient-brand rounded-2xl flex items-center justify-center text-3xl font-black text-white glow">
              {user?.name?.charAt(0).toUpperCase() ?? 'U'}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 glass rounded-lg flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
              <Camera className="w-3.5 h-3.5 text-slate-300" />
            </button>
          </div>
          <div>
            <p className="text-xl font-bold text-slate-100">{user?.name}</p>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-medium capitalize border border-indigo-500/20">
                <Shield className="w-3 h-3" /> {user?.role}
              </span>
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 font-medium border border-green-500/20">
                <CheckCircle className="w-3 h-3" /> Verified
              </span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 glass rounded-xl p-1 mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab ? 'gradient-brand text-white glow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'Profile' && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="font-semibold mb-5 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" /> Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Full Name"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                  icon={<User className="w-4 h-4" />}
                />
                <InputField
                  label="Email Address"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  icon={<Mail className="w-4 h-4" />}
                />
                <InputField
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                />
                <InputField
                  label="Address"
                  placeholder="City, State"
                  value={profile.address}
                  onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
                />
              </div>
              <div className="mt-5 flex justify-end">
                <Button loading={saving} icon={<Save className="w-4 h-4" />} onClick={handleSaveProfile}>
                  Save Changes
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {activeTab === 'Security' && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="font-semibold mb-5 flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400" /> Change Password
              </h3>
              <div className="space-y-4">
                <InputField
                  label="Current Password"
                  type="password"
                  placeholder="Enter current password"
                  value={passwords.current}
                  onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                  icon={<Lock className="w-4 h-4" />}
                />
                <InputField
                  label="New Password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={passwords.newPass}
                  onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
                  icon={<Lock className="w-4 h-4" />}
                />
                <InputField
                  label="Confirm New Password"
                  type="password"
                  placeholder="Repeat new password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                  icon={<Lock className="w-4 h-4" />}
                />
              </div>
              <div className="mt-5 flex justify-end">
                <Button loading={saving} icon={<Save className="w-4 h-4" />} onClick={handleSavePassword}>
                  Update Password
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" /> Account Security
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security', enabled: false },
                  { label: 'Login Alerts', desc: 'Get notified of new sign-ins', enabled: true },
                  { label: 'Session Timeout', desc: 'Auto sign-out after inactivity', enabled: true },
                ].map(({ label, desc, enabled }) => (
                  <div key={label} className="flex items-center justify-between p-4 glass rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    </div>
                    <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${enabled ? 'bg-indigo-500' : 'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${enabled ? 'left-6' : 'left-1'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {activeTab === 'Notifications' && (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="font-semibold mb-5 flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" /> Notification Preferences
              </h3>
              <div className="space-y-3">
                {(Object.entries(notifPrefs) as [keyof typeof notifPrefs, boolean][]).map(([key, enabled]) => {
                  const labels: Record<keyof typeof notifPrefs, { title: string; desc: string }> = {
                    claimUpdates:    { title: 'Claim Status Updates',   desc: 'When your claim status changes' },
                    fraudAlerts:     { title: 'Fraud Alerts',           desc: 'When suspicious activity is detected' },
                    approvalNotices: { title: 'Approval Notices',       desc: 'When claims are approved or rejected' },
                    weeklyReport:    { title: 'Weekly Summary',         desc: 'Weekly digest of your claims activity' },
                  };
                  const cfg = labels[key];
                  return (
                    <div key={key} className="flex items-center justify-between p-4 glass rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-slate-200">{cfg.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{cfg.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifPrefs((n) => ({ ...n, [key]: !n[key] }))}
                        className={`w-11 h-6 rounded-full relative transition-colors ${enabled ? 'bg-indigo-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${enabled ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <div className="mt-5 flex justify-end">
                <Button loading={saving} icon={<Save className="w-4 h-4" />} onClick={handleSaveNotifs}>
                  Save Preferences
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
