import { useQuery } from '@tanstack/react-query';
import { fetchClaimById } from '../services/claimService';
import { mockClaims } from '../utils/mockData';
import type { Claim } from '../types';

export function useClaimStatus(claimId: string) {
  const { data, isLoading, error, refetch } = useQuery<Claim>({
    queryKey: ['claim', claimId],
    queryFn: () => fetchClaimById(claimId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Poll every 5s while actively processing
      return status === 'processing' || status === 'submitted' ? 5000 : false;
    },
    // Fall back to mock data when backend is unavailable
    placeholderData: mockClaims.find((c) => c.id === claimId),
  });

  return { claim: data, isLoading, error, refetch };
}
