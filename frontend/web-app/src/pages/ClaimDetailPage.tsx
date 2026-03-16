import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Car, Brain, TrendingUp, Shield, FileText,
  Download, CheckCircle, AlertTriangle, XCircle, Wrench,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { DamageImageViewer } from '../components/DamageImageViewer';
import { mockClaims } from '../utils/mockData';
import toast from 'react-hot-toast';

const SeverityColor = {
  minor: 'text-green-400 bg-green-500/15 border-green-500/30',
  moderate: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30',
  severe: 'text-red-400 bg-red-500/15 border-red-500/30',
};

const FraudColor = {
  low: 'text-green-400',
  medium: 'text-yellow-400',
  high: 'text-red-400',
};

export default function ClaimDetailPage() {
  const { id } = useParams<{ id: string }>();
  const claim = mockClaims.find((c) => c.id === id) ?? mockClaims[0];

  const handleDownload = () => toast.success('Report download started (mock).');

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back & Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link to="/claims" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Claims
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black">{claim.id}</h1>
              <StatusBadge status={claim.status} pulse={claim.status === 'processing'} />
            </div>
            <p className="text-slate-400">
              {claim.vehicleInfo.year} {claim.vehicleInfo.make} {claim.vehicleInfo.model} · {claim.vehicleInfo.licensePlate}
            </p>
          </div>
          {claim.report && (
            <Button variant="ghost" icon={<Download className="w-4 h-4" />} onClick={handleDownload}>
              Download Report
            </Button>
          )}
        </div>
      </motion.div>

      {/* Processing state */}
      {claim.status === 'processing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <Card className="border border-indigo-500/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 gradient-brand rounded-xl flex items-center justify-center animate-pulse">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-indigo-300">AI Analysis in Progress</p>
                <p className="text-sm text-slate-400">Detecting damage, estimating costs, and screening for fraud…</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {['Upload', 'Preprocess', 'Detect', 'Estimate', 'Report'].map((s, i) => (
                <div key={s} className="text-center">
                  <div className={`h-1.5 rounded-full mb-1.5 ${i === 0 ? 'gradient-brand' : 'bg-white/10'}`} />
                  <span className="text-[10px] text-slate-500">{s}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid lg:grid-cols-3 gap-5">

        {/* Main col */}
        <div className="lg:col-span-2 space-y-5">

          {/* Vehicle Image */}
          {claim.images.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Car className="w-4 h-4 text-indigo-400" /> Damage Images
                  {claim.damageAnalysis && (
                    <span className="ml-auto text-xs text-slate-500 font-normal">AI detection overlay active</span>
                  )}
                </h3>
                <DamageImageViewer
                  images={claim.images}
                  regions={claim.damageAnalysis?.regions ?? []}
                />
              </Card>
            </motion.div>
          )}

          {/* Damage Analysis */}
          {claim.damageAnalysis && (
            <motion.div variants={itemVariants}>
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-indigo-400" /> AI Damage Analysis
                </h3>
                <div className="flex items-center gap-4 mb-5 p-4 glass rounded-xl">
                  <div className="text-center flex-1">
                    <p className="text-xs text-slate-500 mb-1">Overall Severity</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${SeverityColor[claim.damageAnalysis.overallSeverity]}`}>
                      {claim.damageAnalysis.overallSeverity.charAt(0).toUpperCase() + claim.damageAnalysis.overallSeverity.slice(1)}
                    </span>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-xs text-slate-500 mb-1">Confidence Score</p>
                    <p className="text-2xl font-black text-indigo-400">
                      {(claim.damageAnalysis.confidenceScore * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-xs text-slate-500 mb-1">Regions Detected</p>
                    <p className="text-2xl font-black text-purple-400">{claim.damageAnalysis.regions.length}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {claim.damageAnalysis.regions.map((region) => (
                    <div key={region.id} className="flex items-center gap-4 p-3 glass rounded-xl">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${region.severity === 'minor' ? 'bg-green-400' : region.severity === 'moderate' ? 'bg-yellow-400' : 'bg-red-400'}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{region.type}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${SeverityColor[region.severity]}`}>
                            {region.severity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full gradient-brand"
                              initial={{ width: 0 }}
                              animate={{ width: `${region.confidence * 100}%` }}
                              transition={{ delay: 0.5, duration: 0.6 }}
                            />
                          </div>
                          <span className="text-xs text-slate-400">{(region.confidence * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Report */}
          {claim.report && (
            <motion.div variants={itemVariants}>
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" /> AI Claim Report
                </h3>
                <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Summary</p>
                    <p>{claim.report.summary}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Damage Description</p>
                    <p>{claim.report.damageDescription}</p>
                  </div>
                  <div className="flex items-start gap-2 p-3 glass rounded-xl border border-indigo-500/20">
                    <Wrench className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Recommendation</p>
                      <p>{claim.report.repairRecommendation}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">

          {/* Cost Estimation */}
          {claim.costEstimation && (
            <motion.div variants={itemVariants}>
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" /> Cost Estimation
                </h3>
                <div className="text-center mb-5">
                  <p className="text-4xl font-black text-green-400">
                    ${claim.costEstimation.totalEstimate.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">{claim.costEstimation.currency}</p>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Parts', value: claim.costEstimation.breakdown.parts },
                    { label: 'Labor', value: claim.costEstimation.breakdown.labor },
                    { label: 'Miscellaneous', value: claim.costEstimation.breakdown.miscellaneous },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">{label}</span>
                      <span className="font-medium">${value.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="h-px bg-white/10" />
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span>Total</span>
                    <span className="text-green-400">${claim.costEstimation.totalEstimate.toLocaleString()}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Fraud Detection */}
          {claim.fraudDetection && (
            <motion.div variants={itemVariants}>
              <Card>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-cyan-400" /> Fraud Analysis
                </h3>
                <div className="text-center mb-4">
                  <p className={`text-3xl font-black ${FraudColor[claim.fraudDetection.riskLevel]}`}>
                    {(claim.fraudDetection.riskScore * 100).toFixed(0)}%
                  </p>
                  <p className="text-sm text-slate-400">Risk Score</p>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                  <motion.div
                    className={`h-full rounded-full ${
                      claim.fraudDetection.riskLevel === 'low' ? 'bg-green-500' :
                      claim.fraudDetection.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${claim.fraudDetection.riskScore * 100}%` }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                  />
                </div>
                <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${
                  claim.fraudDetection.riskLevel === 'low' ? 'bg-green-500/10 text-green-400' :
                  claim.fraudDetection.riskLevel === 'medium' ? 'bg-yellow-500/10 text-yellow-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {claim.fraudDetection.riskLevel === 'low' ? <CheckCircle className="w-4 h-4" /> :
                   claim.fraudDetection.riskLevel === 'medium' ? <AlertTriangle className="w-4 h-4" /> :
                   <XCircle className="w-4 h-4" />}
                  <span className="font-medium capitalize">{claim.fraudDetection.riskLevel} Risk</span>
                </div>
                {claim.fraudDetection.flags.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {claim.fraudDetection.flags.map((flag) => (
                      <div key={flag} className="flex items-start gap-2 text-xs text-yellow-400 bg-yellow-500/10 rounded-lg p-2">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        {flag}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {/* Timeline */}
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="font-semibold mb-4">Claim Timeline</h3>
              <div className="space-y-3">
                {[
                  { label: 'Submitted', date: claim.createdAt, done: true },
                  { label: 'Processing', date: claim.damageAnalysis?.processedAt, done: !!claim.damageAnalysis },
                  { label: 'Analysis Complete', date: claim.costEstimation?.estimatedAt, done: !!claim.costEstimation },
                  { label: 'Under Review', date: claim.status === 'under_review' || claim.status === 'approved' || claim.status === 'rejected' ? claim.updatedAt : undefined, done: ['under_review', 'approved', 'rejected'].includes(claim.status) },
                  { label: 'Decision Made', date: claim.status === 'approved' || claim.status === 'rejected' ? claim.updatedAt : undefined, done: claim.status === 'approved' || claim.status === 'rejected' },
                ].map(({ label, date, done }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${done ? 'gradient-brand' : 'bg-white/10'}`}>
                      {done && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${done ? 'text-slate-200' : 'text-slate-500'}`}>{label}</p>
                      {date && <p className="text-xs text-slate-500">{new Date(date).toLocaleString()}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
