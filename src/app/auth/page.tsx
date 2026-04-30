'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Bookmark, Loader2 } from 'lucide-react';
import Link from 'next/link';

function AuthContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
        });
        if (error) throw error;
        // Since we disabled email verification, they should be able to sign in or might be signed in automatically
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-bg px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-theme-box p-10 rounded-3xl shadow-xl border border-theme-border">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-6 group">
            <div className="w-12 h-12 bg-theme-bg rounded-2xl flex items-center justify-center group-hover:bg-theme-bg/80 transition-colors">
              <Bookmark className="w-6 h-6 text-theme-text" />
            </div>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-theme-text">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="mt-2 text-sm text-theme-text/80">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="font-semibold text-theme-text hover:opacity-80 transition-opacity"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          {error && (
            <div className="p-4 bg-red-500/20 text-red-900 text-sm rounded-xl border border-red-500/30 text-center font-medium">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-theme-border bg-theme-bg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-text/20 focus:border-theme-text/50 transition-all placeholder:text-theme-text/40"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-theme-text mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-theme-border bg-theme-bg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-text/20 focus:border-theme-text/50 transition-all placeholder:text-theme-text/40"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-theme-bg bg-theme-text hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-text transition-all font-semibold shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              isLogin ? 'Log in' : 'Create account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-theme-text" /></div>}>
      <AuthContent />
    </Suspense>
  );
}
