import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { mockClaims } from '../utils/mockData';
import toast from 'react-hot-toast';
import type { ClaimStatus } from '../types';

export default function AdminClaimReviewPage() {
  const { id } = useParams<{ id: string }>();
  const claim = mockClaims.find((c) => c.id === id) ?? mockClaims[1];
  const [status, setStatus] = useState<ClaimStatus>(claim.status);
  const [note, setNote] = useState('');
  const [processing, setProcessing] = useState<'approve' | 'reject' | null>(null);

  const handleDecision = async (decision: 'approve' | 'reject') => {
    setProcessing(decision);
    await new Promise((r) => setTimeout(r, 1200));
    setStatus(decision === 'approve' ? 'approved' : 'rejected');
    toast.success(`Claim ${decision === 'approve' ? 'approved' : 'rejected'} successfully.`);
    setProcessing(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <Link to="/admin/claims" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Claims
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black">{claim.id}</h1>
              <StatusBadge status={status} />
            </div>
            <p className="text-slate-400">
              {[claim.vehicleInfo.year, claim.vehicleInfo.make, claim.vehicleInfo.model].filter(Boolean).join(' ')} · {claim.vehicleInfo.licensePlate}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Images */}
          {claim.images.length > 0 && (
            <Card animate>
              <h3 className="font-semibold mb-4">Submitted Images</h3>
              <div className="grid grid-cols-2 gap-3">
                {claim.images.map((img) => (
                  <div key={img.id} className="rounded-xl overflow-hidden aspect-video bg-slate-800">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Damage */}
          {claim.damageAnalysis && (
            <Card animate>
              <h3 className="font-semibold mb-4">Damage Analysis</h3>
              <div className="grid grid-cols-3 gap-4 text-center mb-4">
                {[
                  { label: 'Severity', value: claim.damageAnalysis.overallSeverity },
                  { label: 'Confidence', value: `${(claim.damageAnalysis.confidenceScore * 100).toFixed(1)}%` },
                  { label: 'Regions', value: claim.damageAnalysis.regions.length },
                ].map(({ label, value }) => (
                  <div key={label} className="glass rounded-xl p-3">
                    <p className="text-xs text-slate-500 mb-1">{label}</p>
                    <p className="font-bold text-slate-100 capitalize">{value}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {claim.damageAnalysis.regions.map((r) => (
                  <div key={r.id} className="flex items-center justify-between text-sm glass rounded-xl px-4 py-2.5">
                    <span className="font-medium">{r.type}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.severity === 'minor' ? 'bg-green-500/20 text-green-400' : r.severity === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                      {r.severity}
                    </span>
                    <span className="text-slate-400">{(r.confidence * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Report */}
          {claim.report && (
            <Card animate>
              <h3 className="font-semibold mb-3">AI Report Summary</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{claim.report.summary}</p>
            </Card>
          )}
        </div>

        {/* Decision Sidebar */}
        <div className="space-y-5">
          {/* Cost & Fraud */}
          {claim.costEstimation && (
            <Card animate>
              <h3 className="font-semibold mb-3">Repair Estimate</h3>
              <p className="text-3xl font-black text-green-400 mb-3">
                ${claim.costEstimation.totalEstimate.toLocaleString()}
              </p>
              <div className="space-y-1.5 text-sm">
                {Object.entries(claim.costEstimation.breakdown).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-slate-400">
                    <span className="capitalize">{k}</span>
                    <span className="text-slate-200">${(v as number).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {claim.fraudDetection && (
            <Card animate className={claim.fraudDetection.riskLevel === 'high' ? 'border border-red-500/30' : ''}>
              <h3 className="font-semibold mb-3">Fraud Risk</h3>
              <div className={`text-center p-3 rounded-xl mb-3 ${
                claim.fraudDetection.riskLevel === 'low' ? 'bg-green-500/10' :
                claim.fraudDetection.riskLevel === 'medium' ? 'bg-yellow-500/10' : 'bg-red-500/10'
              }`}>
                <p className={`text-3xl font-black ${
                  claim.fraudDetection.riskLevel === 'low' ? 'text-green-400' :
                  claim.fraudDetection.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {(claim.fraudDetection.riskScore * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-slate-400 capitalize">{claim.fraudDetection.riskLevel} Risk</p>
              </div>
              {claim.fraudDetection.flags.map((f) => (
                <div key={f} className="text-xs text-yellow-400 bg-yellow-500/10 rounded-lg p-2">{f}</div>
              ))}
            </Card>
          )}

          {/* Admin Decision */}
          <Card animate>
            <h3 className="font-semibold mb-4">Admin Decision</h3>
            <div className="flex flex-col gap-3 mb-4">
              <label className="text-sm text-slate-400 font-medium">
                <MessageSquare className="w-3.5 h-3.5 inline mr-1.5" />
                Internal Note (optional)
              </label>
              <textarea
                className="input-field resize-none h-24 text-sm"
                placeholder="Add a note for this decision…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {status === 'approved' ? (
              <div className="flex items-center gap-2 text-green-400 text-sm font-semibold bg-green-500/10 rounded-xl p-3">
                <CheckCircle className="w-4 h-4" /> Claim Approved
              </div>
            ) : status === 'rejected' ? (
              <div className="flex items-center gap-2 text-red-400 text-sm font-semibold bg-red-500/10 rounded-xl p-3">
                <XCircle className="w-4 h-4" /> Claim Rejected
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="ghost"
                  icon={<CheckCircle className="w-4 h-4 text-green-400" />}
                  loading={processing === 'approve'}
                  onClick={() => handleDecision('approve')}
                  className="border border-green-500/30 text-green-400 hover:bg-green-500/10"
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  icon={<XCircle className="w-4 h-4" />}
                  loading={processing === 'reject'}
                  onClick={() => handleDecision('reject')}
                >
                  Reject
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
