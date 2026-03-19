import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, X, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNotificationStore } from '../stores/notificationStore';
import type { AppNotification } from '../stores/notificationStore';

const typeConfig = {
  success: { dot: 'bg-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  text: 'text-green-400' },
  info:    { dot: 'bg-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400' },
  warning: { dot: 'bg-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400' },
  error:   { dot: 'bg-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20',    text: 'text-red-400' },
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

function NotificationItem({ n, onRead }: { n: AppNotification; onRead: () => void }) {
  const cfg = typeConfig[n.type as keyof typeof typeConfig];
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      className={`relative p-3 rounded-xl border transition-all ${cfg.border} ${
        n.read ? 'bg-white/2 opacity-60' : cfg.bg
      }`}
      onClick={onRead}
    >
      <div className="flex items-start gap-3">
        <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${cfg.dot} ${!n.read ? 'animate-pulse' : ''}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-slate-200 truncate">{n.title}</p>
            <span className="text-[10px] text-slate-500 flex-shrink-0">{timeAgo(n.createdAt)}</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
          {n.claimId && (
            <Link
              to={`/claims/${n.claimId}`}
              className={`inline-flex items-center gap-1 text-[10px] mt-1.5 ${cfg.text} hover:underline`}
              onClick={(e) => e.stopPropagation()}
            >
              View {n.claimId} <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markRead, markAllRead, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    // Fetch notifications on component mount
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 gradient-brand rounded-full text-[9px] font-bold text-white flex items-center justify-center"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-80 glass rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] gradient-brand text-white px-1.5 py-0.5 rounded-full font-semibold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <CheckCheck className="w-3 h-3" /> All read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-2">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  No notifications yet.
                </div>
              ) : (
                notifications.map((n) => (
                  <NotificationItem key={n.id} n={n} onRead={() => markRead(n.id)} />
                ))
              )}
            </div>

            <div className="px-4 py-2.5 border-t border-white/5">
              <Link
                to="/notifications"
                onClick={() => setOpen(false)}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View all notifications →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
