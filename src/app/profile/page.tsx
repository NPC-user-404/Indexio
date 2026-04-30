'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Loader2, User, Lock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [username, setUsername] = useState('');
  const [isSavingUsername, setIsSavingUsername] = useState(false);
  const [usernameSuccess, setUsernameSuccess] = useState(false);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth');
      } else {
        setUser(session.user);
        setUsername(session.user.user_metadata?.username || '');
      }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingUsername(true);
    setUsernameSuccess(false);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { username: username.trim() }
      });
      if (error) throw error;
      setUsernameSuccess(true);
      setTimeout(() => setUsernameSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating username:', error);
    } finally {
      setIsSavingUsername(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }

    setIsSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      if (error) throw error;
      
      setPasswordSuccess('Password updated successfully. Logging out...');
      setTimeout(async () => {
        await supabase.auth.signOut();
        router.push('/auth');
      }, 2000);
    } catch (error: any) {
      setPasswordError(error.message || 'Error updating password');
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      // 1. Delete all user folders (cascades links manually or DB handles it)
      await supabase.from('folders').delete().eq('user_id', user.id);
      
      // 2. Delete all user links (in case some links are not in folders)
      await supabase.from('links').delete().eq('user_id', user.id);
      
      // 3. Delete auth user (If this fails due to permissions, data is at least cleared)
      // Note: Typically requires a backend, but we attempt it or call an RPC if setup.
      // In this MVP, we will try to call the delete_user RPC if it exists, otherwise just sign out.
      await supabase.rpc('delete_user');
      
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      // Fallback: Just log them out since we already deleted their data
      await supabase.auth.signOut();
      router.push('/');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-theme-bg">
      <nav className="bg-theme-box border-b border-theme-border sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto h-[73px] flex items-center">
          <Link href="/dashboard" className="flex items-center gap-2 text-theme-text/80 hover:text-theme-text transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-theme-text">Profile Settings</h1>
          <p className="text-theme-text/80 mt-2">Manage your account settings and preferences.</p>
        </div>

        {/* Account Info */}
        <section className="bg-theme-box rounded-3xl p-8 shadow-sm border border-theme-border">
          <div className="flex items-center gap-3 mb-6 border-b border-theme-border pb-4">
            <User className="w-6 h-6 text-theme-text" />
            <h2 className="text-xl font-semibold text-theme-text">Account Information</h2>
          </div>
          
          <div className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm font-medium text-theme-text mb-1.5">Email Address</label>
              <input
                type="email"
                disabled
                value={user.email || ''}
                className="w-full px-4 py-3 rounded-xl border border-theme-border bg-theme-bg/50 text-theme-text/60 cursor-not-allowed"
              />
              <p className="text-xs text-theme-text/60 mt-2">Your email address cannot be changed.</p>
            </div>

            <form onSubmit={handleUpdateUsername}>
              <label className="block text-sm font-medium text-theme-text mb-1.5">Username</label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-theme-border bg-theme-bg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-text/20 focus:border-theme-text/50 transition-all placeholder:text-theme-text/40"
                  placeholder="Set a username"
                />
                <button
                  type="submit"
                  disabled={isSavingUsername}
                  className="px-6 py-3 bg-theme-text text-theme-bg hover:opacity-90 rounded-xl font-medium transition-opacity shadow-sm disabled:opacity-70 flex items-center justify-center min-w-[100px]"
                >
                  {isSavingUsername ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save'}
                </button>
              </div>
              {usernameSuccess && (
                <p className="text-sm text-green-600 mt-2 font-medium">Username updated successfully!</p>
              )}
            </form>
          </div>
        </section>

        {/* Security */}
        <section className="bg-theme-box rounded-3xl p-8 shadow-sm border border-theme-border">
          <div className="flex items-center gap-3 mb-6 border-b border-theme-border pb-4">
            <Lock className="w-6 h-6 text-theme-text" />
            <h2 className="text-xl font-semibold text-theme-text">Security</h2>
          </div>
          
          <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
            {passwordError && (
              <div className="p-3 bg-red-500/20 text-red-900 text-sm rounded-xl border border-red-500/30 font-medium">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="p-3 bg-green-500/20 text-green-900 text-sm rounded-xl border border-green-500/30 font-medium">
                {passwordSuccess}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-theme-text mb-1.5">New Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-theme-border bg-theme-bg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-text/20 focus:border-theme-text/50 transition-all placeholder:text-theme-text/40"
                placeholder="Enter new password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-theme-text mb-1.5">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-theme-border bg-theme-bg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-text/20 focus:border-theme-text/50 transition-all placeholder:text-theme-text/40"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={isSavingPassword || !!passwordSuccess}
              className="px-6 py-3 bg-theme-text text-theme-bg hover:opacity-90 rounded-xl font-medium transition-opacity shadow-sm disabled:opacity-70 flex items-center justify-center min-w-[160px]"
            >
              {isSavingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
            </button>
          </form>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-50 rounded-3xl p-8 border border-red-100">
          <div className="flex items-center gap-3 mb-6 border-b border-red-200 pb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-red-900">Delete Account</h3>
              <p className="text-sm text-red-700 mt-1">
                Permanently delete your account, including all your folders and saved links. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors shadow-sm whitespace-nowrap"
            >
              Delete Account
            </button>
          </div>
        </section>
      </main>

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-theme-box border border-theme-border rounded-3xl w-full max-w-sm shadow-2xl p-6">
            <div className="w-12 h-12 bg-red-500/20 text-red-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-theme-text text-center mb-2">Delete Account?</h3>
            <p className="text-theme-text/80 text-center mb-6">
              This action cannot be undone. All your data will be permanently erased.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-theme-text bg-theme-bg hover:bg-theme-bg/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm flex items-center justify-center"
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
