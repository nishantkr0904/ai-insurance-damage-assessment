import { motion } from 'framer-motion';
import { Bell, CheckCheck, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotificationStore } from '../stores/notificationStore';
import type { AppNotification } from '../stores/notificationStore';

const typeConfig = {
  success: { dot: 'bg-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  label: 'text-green-400',  tag: 'Success' },
  info:    { dot: 'bg-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', label: 'text-indigo-400', tag: 'Info' },
  warning: { dot: 'bg-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', label: 'text-yellow-400', tag: 'Warning' },
  error:   { dot: 'bg-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    label: 'text-red-400',   tag: 'Alert' },
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

function NotificationRow({ n, onRead }: { n: AppNotification; onRead: () => void }) {
  const cfg = typeConfig[n.type] ?? typeConfig.info;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
        n.read ? 'glass opacity-60 border-white/5' : `${cfg.bg} ${cfg.border}`
      }`}
      onClick={onRead}
    >
      <div className="flex flex-col items-center gap-1 pt-0.5">
        <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot} ${!n.read ? 'animate-pulse' : ''}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-100 text-sm">{n.title}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.label} border ${cfg.border}`}>
              {cfg.tag}
            </span>
            {!n.read && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
                New
              </span>
            )}
          </div>
          <span className="text-xs text-slate-500 flex-shrink-0">{timeAgo(n.createdAt)}</span>
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">{n.message}</p>
        {n.claimId && (
          <Link
            to={`/claims/${n.claimId}`}
            className={`inline-flex items-center gap-1 text-xs mt-2 ${cfg.label} hover:underline`}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3 h-3" /> View Claim {n.claimId}
          </Link>
        )}
      </div>
    </motion.div>
  );
}

export default function NotificationsPage() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotificationStore();

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1">Notifications</h1>
          <p className="text-slate-400">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="btn-ghost flex items-center gap-2 text-sm"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-2 mb-5 flex-wrap">
        {(['all', 'success', 'info', 'warning', 'error'] as const).map((f) => (
          <span
            key={f}
            className="px-3 py-1 rounded-full text-xs font-medium glass glass-hover cursor-pointer text-slate-300 capitalize transition-all"
          >
            {f === 'all' ? 'All' : f}
          </span>
        ))}
      </motion.div>

      {/* List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card text-center py-20">
            <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No notifications yet.</p>
          </motion.div>
        ) : (
          notifications.map((n, i) => (
            <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <NotificationRow n={n} onRead={() => markRead(n.id)} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
