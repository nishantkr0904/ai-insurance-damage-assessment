import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { BarChart3, TrendingUp, ShieldAlert, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { mockAnalytics as a } from '../utils/mockData';

const PIE_COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name?: string; fill?: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-xl px-3 py-2 text-xs border-0">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill ?? '#6366f1' }} className="font-semibold">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const approvalRate = ((a.approvedClaims / a.totalClaims) * 100).toFixed(1);
  const fraudRate = ((a.fraudDetected / a.totalClaims) * 100).toFixed(1);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black mb-1">Analytics <span className="gradient-text">&amp; Insights</span></h1>
        <p className="text-slate-400">Platform-wide performance and claim statistics.</p>
      </motion.div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Approval Rate', value: `${approvalRate}%`, icon: TrendingUp, color: 'text-green-400', sub: `${a.approvedClaims} approved` },
          { label: 'Fraud Rate', value: `${fraudRate}%`, icon: ShieldAlert, color: 'text-orange-400', sub: `${a.fraudDetected} flagged` },
          { label: 'Avg. Processing', value: `${a.avgProcessingTime}s`, icon: Clock, color: 'text-cyan-400', sub: 'Per claim' },
          { label: 'Total Claims', value: a.totalClaims.toLocaleString(), icon: BarChart3, color: 'text-indigo-400', sub: 'All time' },
        ].map(({ label, value, icon: Icon, color, sub }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-500">{label}</span>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className={`text-3xl font-black ${color} mb-1`}>{value}</p>
              <p className="text-xs text-slate-500">{sub}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* Area chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <h3 className="font-semibold mb-5 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" /> Claims Trend
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={a.claimsOverTime}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="count" name="Claims" stroke="#6366f1" strokeWidth={2} fill="url(#areaGrad)" dot={{ fill: '#6366f1', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Fraud Risk Pie */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <h3 className="font-semibold mb-5 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-orange-400" /> Fraud Risk Distribution
            </h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={a.fraudRiskDistribution} dataKey="count" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                    {a.fraudRiskDistribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {a.fraudRiskDistribution.map(({ level, count }, i) => (
                  <div key={level} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-slate-400 flex-1">{level} Risk</span>
                    <span className="font-semibold">{count}</span>
                    <span className="text-xs text-slate-500">({((count / a.totalClaims) * 100).toFixed(1)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Damage types bar */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <h3 className="font-semibold mb-5 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" /> Damage Type Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={a.damageTypeDistribution} barSize={40}>
              <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="count" name="Claims" radius={[6, 6, 0, 0]}>
                {a.damageTypeDistribution.map((_, i) => (
                  <Cell key={i} fill={`hsl(${240 + i * 25}, 80%, 65%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>
    </div>
  );
}
