import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShieldAlert, AlertTriangle, XCircle, CheckCircle,
  Search, ArrowRight, TrendingUp,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { mockClaims } from '../utils/mockData';

const riskConfig = {
  low:    { color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20',  icon: CheckCircle },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: AlertTriangle },
  high:   { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30',    icon: XCircle },
};

const fraudClaims = mockClaims.filter((c) => c.fraudDetection);

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function FraudAlertsPage() {
  const [filter, setFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [search, setSearch] = useState('');

  const filtered = fraudClaims.filter((c) => {
    if (!c || !c.vehicleInfo) return false;
    
    const matchRisk = filter === 'all' || c.fraudDetection?.riskLevel === filter;
    const vehicleText = `${c.vehicleInfo.make || ''} ${c.vehicleInfo.model || ''}`.trim();
    const claimId = c.id || '';
    const matchSearch =
      claimId.toLowerCase().includes(search.toLowerCase()) ||
      vehicleText.toLowerCase().includes(search.toLowerCase());
    return matchRisk && matchSearch;
  });

  const stats = {
    total: fraudClaims.length,
    high: fraudClaims.filter((c) => c.fraudDetection?.riskLevel === 'high').length,
    medium: fraudClaims.filter((c) => c.fraudDetection?.riskLevel === 'medium').length,
    low: fraudClaims.filter((c) => c.fraudDetection?.riskLevel === 'low').length,
  };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black mb-1 flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-orange-400" />
          Fraud <span className="gradient-text">Alerts</span>
        </h1>
        <p className="text-slate-400">AI-detected suspicious claims requiring review.</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={containerVariants} initial="hidden" animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {[
          { label: 'Total Analysed',  value: stats.total,  color: 'text-indigo-400', bg: 'from-indigo-500/20 to-indigo-500/5',  icon: ShieldAlert },
          { label: 'High Risk',       value: stats.high,   color: 'text-red-400',    bg: 'from-red-500/20 to-red-500/5',        icon: XCircle },
          { label: 'Medium Risk',     value: stats.medium, color: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-500/5',  icon: AlertTriangle },
          { label: 'Low Risk',        value: stats.low,    color: 'text-green-400',  bg: 'from-green-500/20 to-green-500/5',    icon: CheckCircle },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <motion.div key={label} variants={itemVariants}>
            <Card className={`bg-gradient-to-br ${bg}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">{label}</span>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className={`text-3xl font-black ${color}`}>{value}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input-field pl-10"
            placeholder="Search by claim ID or vehicle…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'high', 'medium', 'low'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                filter === lvl
                  ? 'gradient-brand text-white glow-sm'
                  : 'glass glass-hover text-slate-400'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Claims list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="text-center py-16">
            <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No fraud alerts match your criteria.</p>
          </Card>
        ) : (
          filtered.map((claim, i) => {
            const fd = claim.fraudDetection!;
            const cfg = riskConfig[fd.riskLevel];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={claim.id}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Link to={`/admin/claims/${claim.id}`}>
                  <Card hover className={`border ${cfg.border}`}>
                    <div className="flex items-center gap-4">
                      {/* Risk icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
                        <Icon className={`w-5 h-5 ${cfg.color}`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold">{claim.id}</span>
                          <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                            {fd.riskLevel} Risk
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 truncate mb-1.5">
                          {[claim.vehicleInfo.year, claim.vehicleInfo.make, claim.vehicleInfo.model].filter(Boolean).join(' ')} · {claim.vehicleInfo.licensePlate}
                        </p>
                        {fd.flags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {fd.flags.map((f) => (
                              <span key={f} className="flex items-center gap-1 text-[10px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/20">
                                <AlertTriangle className="w-2.5 h-2.5" /> {f}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Score */}
                      <div className="text-right flex-shrink-0 space-y-2">
                        <div>
                          <p className={`text-2xl font-black ${cfg.color}`}>
                            {(fd.riskScore * 100).toFixed(0)}%
                          </p>
                          <p className="text-xs text-slate-500">Risk Score</p>
                        </div>
                        <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              fd.riskLevel === 'low' ? 'bg-green-500' :
                              fd.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${fd.riskScore * 100}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-1 justify-end text-xs text-indigo-400">
                          <TrendingUp className="w-3 h-3" />
                          ${claim.costEstimation?.totalEstimate.toLocaleString() ?? '—'}
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
