import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { router } from './router';
import { useAuthStore } from './stores/authStore';
import { getCurrentUser } from './services/authService';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

export default function App() {
  const { token, setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    // Auto-login if token exists in localStorage
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken && !token) {
        try {
          // Validate token by fetching current user
          const user = await getCurrentUser();
          setAuth(user, storedToken);
        } catch {
          // Token is invalid, clear auth
          clearAuth();
        }
      }
    };

    initAuth();
  }, []); // Run only on mount

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155',
          },
        }}
      />
    </QueryClientProvider>
  );
}
