import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, XCircle, Clock, ShieldAlert, TrendingUp, BarChart3, ArrowRight, Cpu, Zap, Server, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Loader } from '../components/ui/Loader';
import { getAllClaims, getAnalytics } from '../services/adminService';
import type { Claim, AnalyticsData } from '../types';
import toast from 'react-hot-toast';

const PIE_COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#06b6d4'];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 text-sm border-0">
      <p className="text-slate-400 text-xs mb-1">{label}</p>
      <p className="font-semibold text-indigo-300">{payload[0].value} claims</p>
    </div>
  );
};

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

export default function AdminDashboard() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [claimsData, analyticsData] = await Promise.all([
          getAllClaims(),
          getAnalytics()
        ]);
        setClaims(claimsData);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Failed to load admin dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400">Failed to load analytics data</p>
      </div>
    );
  }

  const statsConfig = [
    { label: 'Total Claims', value: analytics.totalClaims, icon: FileText, color: 'text-indigo-400', gradient: 'from-indigo-500/20 to-indigo-500/5' },
    { label: 'Approved', value: analytics.approvedClaims, icon: CheckCircle, color: 'text-green-400', gradient: 'from-green-500/20 to-green-500/5' },
    { label: 'Rejected', value: analytics.rejectedClaims, icon: XCircle, color: 'text-red-400', gradient: 'from-red-500/20 to-red-500/5' },
    { label: 'Pending Review', value: analytics.pendingClaims, icon: Clock, color: 'text-yellow-400', gradient: 'from-yellow-500/20 to-yellow-500/5' },
    { label: 'Fraud Detected', value: analytics.fraudDetected, icon: ShieldAlert, color: 'text-orange-400', gradient: 'from-orange-500/20 to-orange-500/5' },
    { label: 'Avg. Process Time', value: `${analytics.avgProcessingTime}s`, icon: TrendingUp, color: 'text-cyan-400', gradient: 'from-cyan-500/20 to-cyan-500/5' },
  ];
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black mb-1">Admin <span className="gradient-text">Overview</span></h1>
        <p className="text-slate-400">Monitor claims, fraud detection, and system performance.</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statsConfig.map(({ label, value, icon: Icon, color, gradient }) => (
          <motion.div key={label} variants={itemVariants}>
            <Card className={`bg-gradient-to-br ${gradient}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className={`text-3xl font-black ${color}`}>{value}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-5 mb-8">
        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <h3 className="font-semibold">Claims Over Time</h3>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={analytics.claimsOverTime} barSize={32}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="url(#barGrad)" />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <h3 className="font-semibold">Damage Type Distribution</h3>
            </div>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={analytics.damageTypeDistribution} dataKey="count" cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3}>
                    {analytics.damageTypeDistribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {analytics.damageTypeDistribution.map(({ type, count }, i) => (
                  <div key={type} className="flex items-center gap-2 text-sm">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-slate-400 flex-1 truncate">{type}</span>
                    <span className="font-medium text-slate-200">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* System Health */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" /> System Health
          </h2>
          <Link to="/admin/logs" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
            View logs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'API Latency',      value: '42 ms',  status: 'healthy',  icon: Zap,    sub: '↓ 8ms vs. 1h ago' },
            { label: 'AI Pipeline',      value: '18.4 s', status: 'healthy',  icon: Cpu,    sub: 'Avg. processing time' },
            { label: 'Uptime',           value: '99.97%', status: 'healthy',  icon: Server, sub: 'Last 30 days' },
            { label: 'Error Rate',       value: '0.3%',   status: 'warning',  icon: Activity, sub: '↑ 2 errors today' },
          ].map(({ label, value, status, icon: Icon, sub }) => (
            <Card key={label} className={`bg-gradient-to-br ${status === 'healthy' ? 'from-green-500/10 to-green-500/3' : 'from-yellow-500/10 to-yellow-500/3'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400">{label}</span>
                <div className={`flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider ${status === 'healthy' ? 'text-green-400' : 'text-yellow-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${status === 'healthy' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                  {status}
                </div>
              </div>
              <div className="flex items-end gap-2">
                <Icon className={`w-5 h-5 ${status === 'healthy' ? 'text-green-400' : 'text-yellow-400'}`} />
                <p className={`text-2xl font-black ${status === 'healthy' ? 'text-green-400' : 'text-yellow-400'}`}>{value}</p>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">{sub}</p>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Recent Claims for Review */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Claims for Review</h2>
          <Link to="/admin/claims" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wider border-b border-white/5">
                  <th className="pb-3 font-medium">Claim ID</th>
                  <th className="pb-3 font-medium">Vehicle</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Cost Est.</th>
                  <th className="pb-3 font-medium">Fraud Risk</th>
                  <th className="pb-3 font-medium">Submitted</th>
                  <th className="pb-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(claims || []).slice(0, 5).map((claim) => (
                  <tr key={claim.id} className="hover:bg-white/3 transition-colors">
                    <td className="py-3 font-medium">{claim.id}</td>
                    <td className="py-3 text-slate-400">
                      {claim.vehicleInfo.year} {claim.vehicleInfo.make} {claim.vehicleInfo.model}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={claim.status} />
                    </td>
                    <td className="py-3 font-medium">
                      {claim.costEstimation ? `$${claim.costEstimation.totalEstimate.toLocaleString()}` : '—'}
                    </td>
                    <td className="py-3">
                      {claim.fraudDetection ? (
                        <span className={`text-xs font-semibold ${
                          claim.fraudDetection.riskLevel === 'low' ? 'text-green-400' :
                          claim.fraudDetection.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {claim.fraudDetection.riskLevel.toUpperCase()}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="py-3 text-slate-400">{new Date(claim.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <Link to={`/admin/claims/${claim.id}`} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
