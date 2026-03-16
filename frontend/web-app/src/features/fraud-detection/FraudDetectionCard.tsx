import { motion } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import type { FraudDetection } from '../../types';

interface FraudDetectionCardProps {
  fraud: FraudDetection;
  compact?: boolean;
}

const riskConfig = {
  low: {
    label: 'Low Risk',
    icon: CheckCircle,
    color: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    bar: 'bg-green-500',
  },
  medium: {
    label: 'Medium Risk',
    icon: AlertTriangle,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    bar: 'bg-yellow-500',
  },
  high: {
    label: 'High Risk',
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    bar: 'bg-red-500',
  },
};

export function FraudDetectionCard({ fraud, compact = false }: FraudDetectionCardProps) {
  const cfg = riskConfig[fraud.riskLevel];
  const Icon = cfg.icon;
  const pct = fraud.riskScore * 100;

  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-xl ${cfg.bg} border ${cfg.border}`}>
        <Shield className={`w-4 h-4 ${cfg.color} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">Fraud Risk</span>
            <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${cfg.bar}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.7, delay: 0.2 }}
            />
          </div>
        </div>
        <span className={`text-sm font-bold ${cfg.color}`}>{pct.toFixed(0)}%</span>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center`}>
          <Shield className={`w-5 h-5 ${cfg.color}`} />
        </div>
        <div>
          <p className="font-semibold text-slate-100">Fraud Analysis</p>
          <p className="text-xs text-slate-500">AI-powered anomaly detection</p>
        </div>
      </div>

      {/* Score gauge */}
      <div className="text-center py-3">
        <p className={`text-5xl font-black ${cfg.color}`}>{pct.toFixed(0)}%</p>
        <p className="text-sm text-slate-400 mt-1">Risk Score</p>
      </div>

      {/* Bar */}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${cfg.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </div>

      {/* Risk badge */}
      <div className={`flex items-center gap-2 p-3 rounded-xl ${cfg.bg} border ${cfg.border}`}>
        <Icon className={`w-4 h-4 ${cfg.color}`} />
        <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
      </div>

      {/* Flags */}
      {fraud.flags.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs text-slate-500 uppercase tracking-wider">Flags Detected</p>
          {fraud.flags.map((flag) => (
            <div key={flag} className="flex items-start gap-2 p-2.5 bg-yellow-500/10 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-yellow-300">{flag}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Info className="w-3.5 h-3.5" />
          No anomalies detected in this claim.
        </div>
      )}
    </div>
  );
}
