import type { ClaimStatus } from '../../types';

const statusConfig: Record<ClaimStatus, { label: string; color: string; dot: string }> = {
  uploaded:     { label: 'Uploaded',       color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',    dot: 'bg-blue-400' },
  processing:   { label: 'Processing',     color: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30', dot: 'bg-yellow-400' },
  analyzed:     { label: 'Analyzed',       color: 'bg-purple-500/20 text-purple-400 border border-purple-500/30', dot: 'bg-purple-400' },
  under_review: { label: 'Under Review',   color: 'bg-orange-500/20 text-orange-400 border border-orange-500/30', dot: 'bg-orange-400' },
  approved:     { label: 'Approved',       color: 'bg-green-500/20 text-green-400 border border-green-500/30',  dot: 'bg-green-400' },
  rejected:     { label: 'Rejected',       color: 'bg-red-500/20 text-red-400 border border-red-500/30',       dot: 'bg-red-400' },
};

interface StatusBadgeProps {
  status: ClaimStatus;
  pulse?: boolean;
}

export function StatusBadge({ status, pulse }: StatusBadgeProps) {
  const cfg = statusConfig[status];
  return (
    <span className={`status-badge ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${pulse ? 'animate-pulse' : ''}`} />
      {cfg.label}
    </span>
  );
}
