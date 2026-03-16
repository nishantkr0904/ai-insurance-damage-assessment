import { useQuery } from '@tanstack/react-query';
import { fetchClaims } from '../services/claimService';
import { mockClaims } from '../utils/mockData';
import type { Claim } from '../types';

export function useClaims() {
  const { data, isLoading, error, refetch } = useQuery<Claim[]>({
    queryKey: ['claims'],
    queryFn: fetchClaims,
    placeholderData: mockClaims,
    staleTime: 1000 * 30,
  });

  return { claims: data ?? [], isLoading, error, refetch };
}
