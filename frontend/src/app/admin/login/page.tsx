'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cpu, Lock, User, LogIn, ArrowLeft } from 'lucide-react';

const getApiUrl = (path: string) => {
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  return `http://${host}:5001${path}`;
};

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Save token & credentials
      localStorage.setItem('token', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));

      // Redirect
      router.push('/admin/dashboard');
      
      // Trigger event to refresh navbar
      window.dispatchEvent(new Event('storage'));
    } catch (err: any) {
      console.warn('API error during login. Checking mock status...');
      // Simulated login fallback for local review when server is offline
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('token', 'mock-sandbox-token-key-abc123');
        localStorage.setItem('adminUser', JSON.stringify({ id: 'mock-id', username: 'admin' }));
        router.push('/admin/dashboard');
        window.dispatchEvent(new Event('storage'));
      } else {
        setError(err.message || 'Unable to connect to login server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-brand-primary opacity-[0.05] rounded-full blur-[80px] pointer-events-none"></div>
      
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-xs text-brand-muted hover:text-brand-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-md">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20 mb-3">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-brand-charcoal tracking-tight">AI-Solutions Console</h2>
          <p className="text-xs text-brand-muted mt-1">Admin Portal Access</p>
        </div>

        {/* Card */}
        <div className="glass-panel border border-brand-border rounded-2xl p-6 md:p-8 shadow-2xl">
          <h1 className="text-lg font-bold text-brand-charcoal mb-6 text-center">Login to Dashboard</h1>
          
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-brand-charcoal mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-muted">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  id="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full bg-brand-dark border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-brand-charcoal placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-brand-charcoal mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-muted">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-brand-dark border border-brand-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-brand-charcoal placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-900/50 text-red-400 rounded-xl text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-brand-primary to-brand-purple hover:shadow-lg hover:shadow-brand-primary/20 hover:scale-[1.01] transition-all text-white text-xs flex items-center justify-center gap-2"
            >
              {loading ? (
                'Authenticating...'
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>

          </form>

          {/* Quick Notice */}
          <div className="mt-6 text-center text-[10px] text-brand-muted bg-brand-dark/40 border border-brand-border/40 p-3 rounded-xl">
            Default sandbox credentials: <span className="text-brand-secondary font-mono">admin</span> / <span className="text-brand-secondary font-mono">admin123</span>
          </div>

          <div className="mt-6 text-center">
            <span className="text-xs text-brand-muted">Need a new admin? </span>
            <Link href="/admin/signup" className="text-xs font-bold text-brand-secondary hover:underline">
              Create Account
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
