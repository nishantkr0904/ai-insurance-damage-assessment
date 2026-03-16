import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Zap, Eye, EyeOff } from 'lucide-react';
import { InputField } from '../components/ui/InputField';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { login } from '../services/authService';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.email) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { user, token } = await login(form);
      setAuth(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch {
      toast.error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Demo quick-login
  const quickLogin = async (role: 'user' | 'admin') => {
    const creds = role === 'admin'
      ? { email: 'admin@autoclaim.ai', password: 'admin123' }
      : { email: 'user@autoclaim.ai', password: 'user123' };
    setForm(creds);
    setLoading(true);
    try {
      const { user, token } = await login(creds);
      setAuth(user, token);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch {
      // Demo mode: mock auth
      const mockUser = { id: '1', name: role === 'admin' ? 'Admin User' : 'John Driver', email: creds.email, role, createdAt: new Date().toISOString() };
      setAuth(mockUser, 'mock-token');
      navigate(role === 'admin' ? '/admin' : '/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center glow">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">AutoClaim AI</span>
        </div>

        <div className="card">
          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-7">Sign in to manage your claims</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              error={errors.email}
              icon={<Mail className="w-4 h-4" />}
            />
            <div className="flex flex-col gap-1.5">
              <InputField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                error={errors.password}
                icon={<Lock className="w-4 h-4" />}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="self-end flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showPassword ? 'Hide' : 'Show'} password
              </button>
              <Link to="/forgot-password" className="self-end text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2">
              Sign In
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 pt-5 border-t border-white/5">
            <p className="text-xs text-slate-500 text-center mb-3">Quick demo access</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => quickLogin('user')}
                className="glass glass-hover rounded-xl py-2.5 text-sm text-slate-300 font-medium transition-all"
              >
                👤 Demo User
              </button>
              <button
                onClick={() => quickLogin('admin')}
                className="glass glass-hover rounded-xl py-2.5 text-sm text-slate-300 font-medium transition-all"
              >
                🛡️ Demo Admin
              </button>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          <Link to="/" className="hover:text-slate-400 transition-colors">← Back to home</Link>
        </p>
      </motion.div>
    </div>
  );
}
