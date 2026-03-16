import { useQuery } from '@tanstack/react-query';
import { fetchClaims } from '../services/claimService';
import { mockClaims } from '../utils/mockData';
import type { Claim } from '../types';

export function useDamageAnalysis(claimId?: string) {
  const { data: claims, isLoading } = useQuery<Claim[]>({
    queryKey: ['claims'],
    queryFn: fetchClaims,
    placeholderData: mockClaims,
  });

  const claim = claimId ? claims?.find((c) => c.id === claimId) : undefined;

  return {
    analysis: claim?.damageAnalysis ?? null,
    costEstimation: claim?.costEstimation ?? null,
    fraudDetection: claim?.fraudDetection ?? null,
    isLoading,
  };
}
