import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Upload, CheckCircle, Clock, TrendingUp, Plus, ArrowRight, Car } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { useAuthStore } from '../stores/authStore';
import { fetchClaims } from '../services/claimService';
import type { Claim } from '../types';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function UserDashboard() {
  const user = useAuthStore((s) => s.user);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClaims = async () => {
      try {
        const userClaims = await fetchClaims();
        setClaims(userClaims);
      } catch (error) {
        console.error('Failed to fetch claims:', error);
        toast.error('Failed to load claims');
      } finally {
        setLoading(false);
      }
    };

    loadClaims();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" text="Loading your claims..." />
      </div>
    );
  }

  // Safe stats calculation with fallbacks
  const safeClaims = claims || [];
  const stats = [
    { label: 'Total Claims', value: safeClaims.length, icon: FileText, color: 'text-indigo-400', bg: 'from-indigo-500/20 to-indigo-500/5' },
    { label: 'Approved', value: safeClaims.filter((c) => c.status === 'approved').length, icon: CheckCircle, color: 'text-green-400', bg: 'from-green-500/20 to-green-500/5' },
    { label: 'Processing', value: safeClaims.filter((c) => ['processing', 'analyzed', 'under_review'].includes(c.status)).length, icon: Clock, color: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-500/5' },
    { label: 'Total Estimated', value: `$${safeClaims.reduce((sum, c) => sum + (c.costEstimation?.totalEstimate ?? 0), 0).toLocaleString()}`, icon: TrendingUp, color: 'text-purple-400', bg: 'from-purple-500/20 to-purple-500/5' },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-black text-slate-100">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-400 mt-1">Here's an overview of your insurance claims.</p>
        </div>
        <Link to="/claims/new">
          <Button icon={<Plus className="w-4 h-4" />}>New Claim</Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <motion.div key={label} variants={itemVariants}>
            <Card className={`bg-gradient-to-br ${bg}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-slate-400">{label}</span>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className={`text-3xl font-black ${color}`}>{value}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Claims */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Recent Claims</h2>
          <Link to="/claims" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {safeClaims.map((claim, i) => (
            <motion.div
              key={claim.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.08 }}
            >
              <Link to={`/claims/${claim.id}`}>
                <Card hover className="flex items-center gap-4">
                  <div className="w-12 h-12 glass rounded-xl flex items-center justify-center flex-shrink-0">
                    <Car className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-100">{claim.id}</span>
                      <StatusBadge status={claim.status} pulse={claim.status === 'processing'} />
                    </div>
                    <p className="text-sm text-slate-400 truncate">
                      {claim.vehicleInfo.year} {claim.vehicleInfo.make} {claim.vehicleInfo.model} · {claim.vehicleInfo.licensePlate}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {claim.costEstimation ? (
                      <p className="font-bold text-slate-100">${claim.costEstimation.totalEstimate.toLocaleString()}</p>
                    ) : (
                      <p className="text-sm text-slate-500">Pending</p>
                    )}
                    <p className="text-xs text-slate-500 mt-0.5">
                      {new Date(claim.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {safeClaims.length === 0 && (
          <Card className="text-center py-16">
            <Upload className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No claims yet</h3>
            <p className="text-slate-400 mb-6">Submit your first claim to get started.</p>
            <Link to="/claims/new">
              <Button icon={<Plus className="w-4 h-4" />}>Submit First Claim</Button>
            </Link>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
