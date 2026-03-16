import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadClaimImages } from '../services/claimService';
import toast from 'react-hot-toast';

export function useUploadImage(claimId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (files: File[]) => uploadClaimImages(claimId, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claim', claimId] });
      toast.success('Images uploaded successfully.');
    },
    onError: () => {
      toast.error('Failed to upload images. Please try again.');
    },
  });
}
