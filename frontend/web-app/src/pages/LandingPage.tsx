import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Zap,
  Shield,
  Car,
  Brain,
  TrendingUp,
  Clock,
  ChevronRight,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Damage Detection',
    desc: 'YOLOv8 computer vision identifies scratches, dents, and cracks with high accuracy.',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: TrendingUp,
    title: 'Instant Cost Estimation',
    desc: 'ML regression models predict repair costs in seconds based on damage severity.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Fraud Detection',
    desc: 'Perceptual hashing and anomaly detection catch fraudulent and duplicate claims.',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Clock,
    title: 'Automated Reports',
    desc: 'Generative AI creates structured claim reports — no manual documentation needed.',
    color: 'from-green-500 to-emerald-500',
  },
];

const stats = [
  { value: '< 30s', label: 'Claim Processing' },
  { value: '98.4%', label: 'Detection Accuracy' },
  { value: '3×', label: 'Faster Settlements' },
  { value: '40%', label: 'Fraud Reduction' },
];

const steps = [
  { step: '01', title: 'Upload Images', desc: 'Submit photos of your damaged vehicle.' },
  { step: '02', title: 'AI Analysis', desc: 'Our AI pipeline detects and classifies all damage.' },
  { step: '03', title: 'Get Results', desc: 'Receive your cost estimate and claim report instantly.' },
  { step: '04', title: 'Fast Settlement', desc: 'Admin reviews, approves, and processes your claim.' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      {/* Ambient bg */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-60 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/8 rounded-full blur-3xl" />
      </div>

      {/* ── NAVBAR ── */}
      <nav className="relative z-10 flex items-center justify-between max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center glow-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">AutoClaim AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#features" className="hover:text-slate-100 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-slate-100 transition-colors">How it Works</a>
          <a href="#stats" className="hover:text-slate-100 transition-colors">Results</a>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-slate-400 hover:text-slate-100 transition-colors">
            Sign in
          </Link>
          <Link
            to="/register"
            className="btn-primary text-sm py-2 px-4"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 pt-20 pb-28 px-6 text-center max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-indigo-300 mb-8">
            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
            Powered by YOLOv8 · EfficientNet · LLMs
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            AI-Powered{' '}
            <span className="gradient-text">Vehicle Damage</span>
            <br />
            Assessment Platform
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Submit your insurance claim in minutes. Our AI detects damage, estimates costs,
            screens for fraud, and generates your report automatically.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="gradient-brand text-white font-semibold px-8 py-4 rounded-2xl text-base glow flex items-center gap-2"
              >
                Start Your Claim
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="glass glass-hover text-slate-200 font-semibold px-8 py-4 rounded-2xl text-base flex items-center gap-2"
              >
                Sign In
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 relative"
        >
          <div className="glass rounded-3xl p-8 max-w-3xl mx-auto glow">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-3 text-xs text-slate-500">AI Analysis Dashboard</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Damage Detected', value: 'Moderate Dent', icon: Car, color: 'text-orange-400' },
                { label: 'Confidence Score', value: '94.7%', icon: Brain, color: 'text-indigo-400' },
                { label: 'Repair Estimate', value: '$2,340', icon: TrendingUp, color: 'text-green-400' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white/5 rounded-2xl p-4 text-left">
                  <Icon className={`w-5 h-5 ${color} mb-2`} />
                  <p className="text-xs text-slate-500 mb-1">{label}</p>
                  <p className={`font-semibold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium">Processing Pipeline</span>
                <span className="text-xs text-green-400">Completed in 12.3s</span>
              </div>
              <div className="flex gap-2">
                {['Upload', 'Preprocess', 'Detect', 'Estimate', 'Report'].map((s, i) => (
                  <div key={s} className="flex-1 text-center">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 mb-1.5" style={{ opacity: 1 - i * 0.05 }} />
                    <span className="text-[10px] text-slate-500">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map(({ value, label }) => (
              <motion.div key={label} variants={itemVariants} className="card text-center">
                <p className="text-4xl font-black gradient-text mb-2">{value}</p>
                <p className="text-sm text-slate-400">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-black mb-4">Everything Automated</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              From damage detection to claim approval — our AI pipeline handles it all.
            </p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {features.map(({ icon: Icon, title, desc, color }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="card group"
              >
                <div className={`w-11 h-11 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-slate-100">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-black mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Four simple steps from damage to settlement.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-full w-full h-px bg-gradient-to-r from-indigo-500/40 to-transparent -translate-y-1/2 z-0" />
                )}
                <div className="card text-center relative z-10">
                  <div className="w-14 h-14 gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-black text-lg glow-sm">
                    {step}
                  </div>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-slate-400">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto card text-center glow"
        >
          <div className="w-16 h-16 gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-6 glow">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black mb-4">Ready to Automate Claims?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            Join thousands of policyholders getting faster, fairer claim settlements with AI.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="gradient-brand text-white font-semibold px-8 py-4 rounded-2xl text-base glow flex items-center gap-2"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-500">
            {['No credit card required', 'Instant setup', 'Cancel anytime'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-6 text-center text-sm text-slate-600">
        <p>© 2026 AutoClaim AI · AI-Powered Vehicle Insurance Platform</p>
      </footer>
    </div>
  );
}
