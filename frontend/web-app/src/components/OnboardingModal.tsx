import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Zap, Upload, Brain, FileText, Shield, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const STORAGE_KEY = 'autoclaim_onboarding_done';

const steps = [
  {
    icon: Zap,
    color: 'from-indigo-500 to-purple-600',
    title: 'Welcome to AutoClaim AI',
    description: 'Your intelligent insurance claims platform. AI-powered damage detection, cost estimation, and fraud analysis — all in one place.',
    cta: null,
  },
  {
    icon: Upload,
    color: 'from-cyan-500 to-indigo-600',
    title: 'Submit a Claim',
    description: 'Upload photos of your damaged vehicle. Our AI processes images in seconds, detecting damage regions with bounding-box precision.',
    cta: { label: 'Submit a Claim', to: '/claims/new' },
  },
  {
    icon: Brain,
    color: 'from-purple-500 to-pink-600',
    title: 'AI Does the Heavy Lifting',
    description: 'Damage detection, severity scoring, repair cost estimation, and fraud analysis run automatically — no manual input required.',
    cta: null,
  },
  {
    icon: FileText,
    color: 'from-green-500 to-cyan-600',
    title: 'Download Your Report',
    description: 'Once analysis completes, a structured PDF report is generated. Review your claim summary and download it anytime.',
    cta: { label: 'View My Claims', to: '/claims' },
  },
  {
    icon: Shield,
    color: 'from-orange-500 to-red-600',
    title: 'Built-in Fraud Protection',
    description: 'Every claim is screened for duplicate images, metadata anomalies, and AI-generated content — keeping the system fair for everyone.',
    cta: null,
  },
];

export function OnboardingModal() {
  const user = useAuthStore((s) => s.user);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!user) return;
    const done = sessionStorage.getItem(STORAGE_KEY);
    if (!done) {
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
          >
            <div className="relative w-full max-w-md glass rounded-2xl shadow-2xl border border-white/8 p-8 pointer-events-auto overflow-hidden">
              {/* Close */}
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg glass flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Step content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="text-center"
                >
                  {/* Icon */}
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${current.color} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <current.icon className="w-10 h-10 text-white" />
                  </div>

                  <h2 className="text-2xl font-black text-slate-100 mb-3">{current.title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{current.description}</p>

                  {current.cta && (
                    <Link to={current.cta.to} onClick={dismiss}>
                      <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className="gradient-brand text-white text-sm font-semibold px-5 py-2.5 rounded-xl glow-sm mb-6 inline-block"
                      >
                        {current.cta.label}
                      </motion.button>
                    </Link>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Progress dots */}
              <div className="flex items-center justify-center gap-1.5 mb-6">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === step ? 'w-5 h-2 gradient-brand' : 'w-2 h-2 bg-white/20 hover:bg-white/30'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => step > 0 ? setStep((s) => s - 1) : dismiss()}
                  className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {step > 0 ? (
                    <><ChevronLeft className="w-4 h-4" /> Back</>
                  ) : (
                    'Skip tour'
                  )}
                </button>

                <motion.button
                  onClick={() => isLast ? dismiss() : setStep((s) => s + 1)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-1.5 gradient-brand text-white text-sm font-semibold px-5 py-2.5 rounded-xl glow-sm"
                >
                  {isLast ? 'Get Started' : 'Next'}
                  {!isLast && <ChevronRight className="w-4 h-4" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
