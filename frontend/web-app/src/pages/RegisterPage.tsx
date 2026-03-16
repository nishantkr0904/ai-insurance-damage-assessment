import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Zap } from 'lucide-react';
import { InputField } from '../components/ui/InputField';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { register } from '../services/authService';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { user, token } = await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setAuth(user, token);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch {
      // Demo mode
      const mockUser = { id: Date.now().toString(), name: form.name, email: form.email, role: 'user' as const, createdAt: new Date().toISOString() };
      setAuth(mockUser, 'mock-token');
      toast.success('Account created! Welcome aboard.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value })),
    error: errors[key],
  });

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 gradient-brand rounded-xl flex items-center justify-center glow">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">AutoClaim AI</span>
        </div>

        <div className="card">
          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-slate-400 text-sm mb-7">Start automating your insurance claims</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Full name"
              type="text"
              placeholder="John Smith"
              {...field('name')}
              icon={<User className="w-4 h-4" />}
            />
            <InputField
              label="Email address"
              type="email"
              placeholder="you@example.com"
              {...field('email')}
              icon={<Mail className="w-4 h-4" />}
            />
            <InputField
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              {...field('password')}
              icon={<Lock className="w-4 h-4" />}
            />
            <InputField
              label="Confirm password"
              type="password"
              placeholder="Repeat your password"
              {...field('confirm')}
              icon={<Lock className="w-4 h-4" />}
            />

            <div className="flex items-start gap-3 pt-1">
              <input type="checkbox" required id="terms" className="mt-0.5 accent-indigo-500" />
              <label htmlFor="terms" className="text-xs text-slate-400 leading-relaxed">
                I agree to the{' '}
                <span className="text-indigo-400 cursor-pointer">Terms of Service</span> and{' '}
                <span className="text-indigo-400 cursor-pointer">Privacy Policy</span>
              </label>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign in
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
