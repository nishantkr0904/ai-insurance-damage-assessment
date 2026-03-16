import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Upload,
  FileText,
  ShieldAlert,
  BarChart3,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const userNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/claims/new', icon: Upload, label: 'New Claim' },
  { to: '/claims', icon: FileText, label: 'My Claims' },
];

const adminNav = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { to: '/admin/claims', icon: FileText, label: 'All Claims' },
  { to: '/admin/fraud', icon: ShieldAlert, label: 'Fraud Alerts' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const nav = user?.role === 'admin' ? adminNav : userNav;

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <motion.aside
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed left-0 top-0 h-full w-64 glass border-r border-white/5 flex flex-col z-30 p-5"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center glow-sm">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-slate-100 leading-tight">AutoClaim</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">AI Platform</p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard' || to === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'gradient-brand text-white glow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User info & logout */}
      <div className="pt-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 gradient-brand rounded-full flex items-center justify-center text-xs font-bold text-white">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </motion.aside>
  );
}
