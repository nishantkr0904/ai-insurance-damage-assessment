import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, MoreVertical, Shield, User,
  CheckCircle, XCircle, Mail, Calendar, ChevronDown, Edit, Trash2, UserCheck,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { InputField } from '../components/ui/InputField';
import toast from 'react-hot-toast';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  claimsCount: number;
  joinedAt: string;
  lastActive: string;
}

const mockUsers: AppUser[] = [
  { id: 'u1', name: 'Alex Johnson',    email: 'alex@example.com',    role: 'user',  status: 'active',    claimsCount: 3,  joinedAt: '2025-11-01T10:00:00Z', lastActive: '2026-03-15T09:30:00Z' },
  { id: 'u2', name: 'Maria Santos',    email: 'maria@example.com',   role: 'user',  status: 'active',    claimsCount: 7,  joinedAt: '2025-09-14T12:00:00Z', lastActive: '2026-03-16T11:00:00Z' },
  { id: 'u3', name: 'James Liu',       email: 'james@example.com',   role: 'admin', status: 'active',    claimsCount: 0,  joinedAt: '2025-01-05T08:00:00Z', lastActive: '2026-03-16T20:00:00Z' },
  { id: 'u4', name: 'Sara Thompson',   email: 'sara@example.com',    role: 'user',  status: 'suspended', claimsCount: 2,  joinedAt: '2026-01-20T15:00:00Z', lastActive: '2026-02-28T10:00:00Z' },
  { id: 'u5', name: 'David Okonkwo',   email: 'david@example.com',   role: 'user',  status: 'active',    claimsCount: 12, joinedAt: '2024-07-11T09:00:00Z', lastActive: '2026-03-14T17:00:00Z' },
  { id: 'u6', name: 'Priya Patel',     email: 'priya@example.com',   role: 'user',  status: 'active',    claimsCount: 1,  joinedAt: '2026-02-03T11:00:00Z', lastActive: '2026-03-12T14:00:00Z' },
  { id: 'u7', name: 'Carlos Rivera',   email: 'carlos@example.com',  role: 'admin', status: 'active',    claimsCount: 0,  joinedAt: '2024-12-01T10:00:00Z', lastActive: '2026-03-16T08:00:00Z' },
  { id: 'u8', name: 'Emma Wilson',     email: 'emma@example.com',    role: 'user',  status: 'active',    claimsCount: 5,  joinedAt: '2025-06-18T13:00:00Z', lastActive: '2026-03-10T09:00:00Z' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};
const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

function ActionsMenu({ user, onToggleStatus, onToggleRole }: {
  user: AppUser;
  onToggleStatus: () => void;
  onToggleRole: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-10 z-20 w-48 glass rounded-xl shadow-2xl py-1 border border-white/5"
            >
              <button
                onClick={() => { onToggleRole(); setOpen(false); }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Edit className="w-4 h-4 text-indigo-400" />
                {user.role === 'user' ? 'Promote to Admin' : 'Demote to User'}
              </button>
              <button
                onClick={() => { onToggleStatus(); setOpen(false); }}
                className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors ${
                  user.status === 'active'
                    ? 'text-yellow-400 hover:bg-yellow-500/10'
                    : 'text-green-400 hover:bg-green-500/10'
                }`}
              >
                {user.status === 'active'
                  ? <><XCircle className="w-4 h-4" /> Suspend Account</>
                  : <><UserCheck className="w-4 h-4" /> Reactivate Account</>
                }
              </button>
              <div className="h-px bg-white/5 my-1" />
              <button
                onClick={() => { toast.error('Delete disabled in demo mode.'); setOpen(false); }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete User
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>(mockUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const toggleStatus = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id
      ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
      : u
    ));
    const user = users.find((u) => u.id === id)!;
    toast.success(`${user.name} ${user.status === 'active' ? 'suspended' : 'reactivated'}.`);
  };

  const toggleRole = (id: string) => {
    setUsers((prev) => prev.map((u) => u.id === id
      ? { ...u, role: u.role === 'user' ? 'admin' : 'user' }
      : u
    ));
    const user = users.find((u) => u.id === id)!;
    toast.success(`${user.name} is now ${user.role === 'user' ? 'an Admin' : 'a User'}.`);
  };

  const stats = [
    { label: 'Total Users', value: users.length, color: 'text-indigo-400', bg: 'from-indigo-500/20 to-indigo-500/5' },
    { label: 'Active', value: users.filter((u) => u.status === 'active').length, color: 'text-green-400', bg: 'from-green-500/20 to-green-500/5' },
    { label: 'Admins', value: users.filter((u) => u.role === 'admin').length, color: 'text-purple-400', bg: 'from-purple-500/20 to-purple-500/5' },
    { label: 'Suspended', value: users.filter((u) => u.status === 'suspended').length, color: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-500/5' },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-400" />
          <span>User <span className="gradient-text">Management</span></span>
        </h1>
        <p className="text-slate-400 mt-1">Manage accounts, roles, and access permissions.</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={containerVariants} initial="hidden" animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {stats.map(({ label, value, color, bg }) => (
          <motion.div key={label} variants={rowVariants}>
            <Card className={`bg-gradient-to-br ${bg}`}>
              <p className="text-sm text-slate-400 mb-2">{label}</p>
              <p className={`text-3xl font-black ${color}`}>{value}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-3 mb-5"
      >
        <div className="flex-1">
          <InputField
            label=""
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className="flex gap-2">
          {/* Role filter */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
              className="glass rounded-xl px-4 py-2.5 text-sm text-slate-300 border border-white/10 focus:border-indigo-500/50 focus:outline-none appearance-none pr-8 cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="glass rounded-xl px-4 py-2.5 text-sm text-slate-300 border border-white/10 focus:border-indigo-500/50 focus:outline-none appearance-none pr-8 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card>
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="font-semibold text-slate-400 mb-1">No users found</p>
              <p className="text-sm text-slate-500">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              {/* Desktop header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-4 pb-3 border-b border-white/5 text-xs text-slate-500 uppercase tracking-wider">
                <div className="col-span-4">User</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Claims</div>
                <div className="col-span-1">Joined</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="divide-y divide-white/5">
                {filtered.map((user) => (
                  <motion.div key={user.id} variants={rowVariants}
                    className="grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-white/2 transition-colors"
                  >
                    {/* User info */}
                    <div className="col-span-10 md:col-span-4 flex items-center gap-3">
                      <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-200 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="col-span-2 hidden md:flex">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.role === 'admin'
                          ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          : 'bg-slate-500/15 text-slate-400 border border-slate-500/20'
                      }`}>
                        {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 hidden md:flex">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.status === 'active'
                          ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                          : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {user.status === 'active'
                          ? <><CheckCircle className="w-3 h-3" /> Active</>
                          : <><XCircle className="w-3 h-3" /> Suspended</>
                        }
                      </span>
                    </div>

                    {/* Claims */}
                    <div className="col-span-2 hidden md:block">
                      <p className="text-sm font-medium text-slate-300">{user.claimsCount}</p>
                      <p className="text-xs text-slate-500">claims</p>
                    </div>

                    {/* Joined */}
                    <div className="col-span-1 hidden md:flex items-center gap-1 text-xs text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                    </div>

                    {/* Actions */}
                    <div className="col-span-2 md:col-span-1 flex justify-end">
                      <ActionsMenu
                        user={user}
                        onToggleStatus={() => toggleStatus(user.id)}
                        onToggleRole={() => toggleRole(user.id)}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <div className="px-4 pt-4 border-t border-white/5 text-xs text-slate-500">
                Showing {filtered.length} of {users.length} users
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
