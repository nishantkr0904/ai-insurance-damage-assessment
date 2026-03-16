import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Toaster } from 'react-hot-toast';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-cyan-600/8 rounded-full blur-3xl" />
      </div>

      <Sidebar />

      <main className="ml-64 min-h-screen relative">
        <div className="p-8">
          <Outlet />
        </div>
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15,23,42,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#e2e8f0',
            backdropFilter: 'blur(12px)',
          },
        }}
      />
    </div>
  );
}
