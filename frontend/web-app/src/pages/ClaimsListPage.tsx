import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowRight, Car, FileText } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { mockClaims } from '../utils/mockData';
import type { ClaimStatus } from '../types';

const ALL_STATUSES: ClaimStatus[] = ['uploaded', 'processing', 'analyzed', 'under_review', 'approved', 'rejected'];

export default function ClaimsListPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ClaimStatus | 'all'>('all');
  const location = useLocation();

  // Check if we're in admin mode based on the current path
  const isAdminMode = location.pathname.startsWith('/admin');

  const filtered = mockClaims.filter((c) => {
    const matchSearch =
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      `${c.vehicleInfo.make} ${c.vehicleInfo.model}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black mb-1">{isAdminMode ? 'All Claims' : 'My Claims'}</h1>
        <p className="text-slate-400">
          {isAdminMode
            ? 'Review and manage all insurance claims submitted by users.'
            : 'Track all your submitted insurance claims.'}
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input-field pl-10"
            placeholder="Search by claim ID or vehicle…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            className="input-field pl-10 pr-8 appearance-none cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value as ClaimStatus | 'all')}
          >
            <option value="all">All Statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Claims */}
      <div className="space-y-3">
        {filtered.map((claim, i) => (
          <motion.div
            key={claim.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Link to={isAdminMode ? `/admin/claims/${claim.id}` : `/claims/${claim.id}`}>
              <Card hover className="flex items-center gap-4">
                <div className="w-12 h-12 glass rounded-xl flex items-center justify-center flex-shrink-0">
                  <Car className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold">{claim.id}</span>
                    <StatusBadge status={claim.status} pulse={claim.status === 'processing'} />
                  </div>
                  <p className="text-sm text-slate-400 truncate">
                    {claim.vehicleInfo.year} {claim.vehicleInfo.make} {claim.vehicleInfo.model} · {claim.vehicleInfo.licensePlate}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  {claim.costEstimation
                    ? <p className="font-bold">${claim.costEstimation.totalEstimate.toLocaleString()}</p>
                    : <p className="text-slate-500 text-sm">Pending</p>
                  }
                  <p className="text-xs text-slate-500 mt-0.5">{new Date(claim.createdAt).toLocaleDateString()}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
              </Card>
            </Link>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <EmptyState
            icon={search || filter !== 'all' ? Search : FileText}
            title={search || filter !== 'all' ? 'No matching claims' : isAdminMode ? 'No claims found' : 'No claims yet'}
            description={search || filter !== 'all'
              ? 'Try adjusting your search or filter to find what you\'re looking for.'
              : isAdminMode
                ? 'There are no claims in the system at the moment.'
                : 'Submit your first claim to get started with AI-powered damage assessment.'
            }
            action={search || filter !== 'all' ? undefined : isAdminMode ? undefined : { label: 'Submit First Claim', to: '/claims/new' }}
            secondaryAction={search || filter !== 'all'
              ? { label: 'Clear filters', onClick: () => { setSearch(''); setFilter('all'); } }
              : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
