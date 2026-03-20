import { motion } from 'framer-motion';
import { CheckCircle, Clock, Brain, TrendingUp, Shield, FileText } from 'lucide-react';
import type { ClaimStatus } from '../../types';

interface Step {
  key: ClaimStatus | string;
  label: string;
  icon: React.ElementType;
  desc: string;
}

const PIPELINE_STEPS: Step[] = [
  { key: 'submitted',   label: 'Images Uploaded',   icon: CheckCircle,  desc: 'Damage images stored securely in cloud.' },
  { key: 'processing',  label: 'Preprocessing',      icon: Clock,        desc: 'Noise reduction, resizing & ROI extraction.' },
  { key: 'analyzed',    label: 'Damage Detection',   icon: Brain,        desc: 'YOLOv8 detecting damage regions & severity.' },
  { key: 'cost',        label: 'Cost Estimation',    icon: TrendingUp,   desc: 'ML model predicting repair costs.' },
  { key: 'fraud',       label: 'Fraud Detection',    icon: Shield,       desc: 'Perceptual hashing & anomaly analysis.' },
  { key: 'under_review',label: 'Report Generated',   icon: FileText,     desc: 'Generative AI creating structured report.' },
];

const stepOrder = PIPELINE_STEPS.map((s) => s.key);

function resolvedStepIndex(status: ClaimStatus): number {
  const map: Record<ClaimStatus, number> = {
    submitted: 0,
    processing: 1,
    analyzed: 3,
    under_review: 5,
    approved: 5,
    rejected: 5,
  };
  return map[status] ?? 0;
}

interface AIProcessingPipelineProps {
  status: ClaimStatus;
}

export function AIProcessingPipeline({ status }: AIProcessingPipelineProps) {
  const currentIdx = resolvedStepIndex(status);
  const isActive = status === 'processing';

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-semibold text-slate-100">AI Processing Pipeline</p>
          <p className="text-xs text-slate-500">Real-time claim analysis progress</p>
        </div>
        {isActive && (
          <div className="ml-auto flex items-center gap-1.5 text-xs text-indigo-300">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
            Live
          </div>
        )}
      </div>

      <div className="space-y-3">
        {PIPELINE_STEPS.map((step, i) => {
          const done = i <= currentIdx;
          const active = i === currentIdx && isActive;
          const Icon = step.icon;

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 ${
                active ? 'bg-indigo-500/10 border border-indigo-500/25' :
                done ? 'bg-white/3' : 'opacity-40'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                done ? 'gradient-brand' : 'bg-white/5'
              }`}>
                <Icon className={`w-4 h-4 ${done ? 'text-white' : 'text-slate-500'} ${active ? 'animate-pulse' : ''}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${done ? 'text-slate-200' : 'text-slate-500'}`}>
                    {step.label}
                  </p>
                  {active && (
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                      Processing…
                    </span>
                  )}
                  {done && !active && (
                    <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5 truncate">{step.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Overall progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span>Pipeline Progress</span>
          <span>{Math.round(((currentIdx + 1) / stepOrder.length) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full gradient-brand rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIdx + 1) / stepOrder.length) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
