import { motion } from 'framer-motion';
import { Brain, TrendingUp, Shield, CheckCircle } from 'lucide-react';
import type { DamageAnalysis, CostEstimation, FraudDetection } from '../../types';

interface DamageAnalysisPanelProps {
  analysis: DamageAnalysis;
  costEstimation?: CostEstimation;
  fraudDetection?: FraudDetection;
}

const severityColor = {
  minor: 'text-green-400 bg-green-500/15 border-green-500/30',
  moderate: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30',
  severe: 'text-red-400 bg-red-500/15 border-red-500/30',
};

export function DamageAnalysisPanel({
  analysis,
  costEstimation,
  fraudDetection,
}: DamageAnalysisPanelProps) {
  return (
    <div className="space-y-5">
      {/* Header metrics */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: 'Severity',
            value: analysis.overallSeverity,
            icon: Brain,
            color: 'text-indigo-400',
            capitalize: true,
          },
          {
            label: 'Confidence',
            value: `${(analysis.confidenceScore * 100).toFixed(1)}%`,
            icon: CheckCircle,
            color: 'text-green-400',
          },
          {
            label: 'Regions',
            value: String(analysis.regions.length),
            icon: TrendingUp,
            color: 'text-purple-400',
          },
        ].map(({ label, value, icon: Icon, color, capitalize }) => (
          <div key={label} className="glass rounded-xl p-4 text-center">
            <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
            <p className="text-xs text-slate-500 mb-1">{label}</p>
            <p className={`font-bold ${color} ${capitalize ? 'capitalize' : ''}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Damage regions */}
      <div className="space-y-2">
        {analysis.regions.map((region, i) => (
          <motion.div
            key={region.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3 p-3 glass rounded-xl"
          >
            <div
              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                region.severity === 'minor'
                  ? 'bg-green-400'
                  : region.severity === 'moderate'
                  ? 'bg-yellow-400'
                  : 'bg-red-400'
              }`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{region.type}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border ${
                    severityColor[region.severity]
                  }`}
                >
                  {region.severity}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full gradient-brand"
                    initial={{ width: 0 }}
                    animate={{ width: `${region.confidence * 100}%` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                  />
                </div>
                <span className="text-xs text-slate-400 w-10 text-right">
                  {(region.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cost summary strip */}
      {costEstimation && (
        <div className="flex items-center justify-between p-4 glass rounded-xl border border-green-500/20">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-slate-300">Estimated Repair Cost</span>
          </div>
          <span className="text-xl font-black text-green-400">
            ${costEstimation.totalEstimate.toLocaleString()}
          </span>
        </div>
      )}

      {/* Fraud strip */}
      {fraudDetection && (
        <div
          className={`flex items-center justify-between p-4 glass rounded-xl ${
            fraudDetection.riskLevel === 'high' ? 'border border-red-500/30' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-slate-300">Fraud Risk</span>
          </div>
          <span
            className={`text-sm font-bold uppercase ${
              fraudDetection.riskLevel === 'low'
                ? 'text-green-400'
                : fraudDetection.riskLevel === 'medium'
                ? 'text-yellow-400'
                : 'text-red-400'
            }`}
          >
            {fraudDetection.riskLevel} · {(fraudDetection.riskScore * 100).toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
}
