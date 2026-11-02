import React, { useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { Scissors, Lock, User, Sparkles, AlertCircle } from 'lucide-react';

export const Login = () => {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(username, password);
    } catch (err) {
      setError(err?.message || 'Invalid username or password');
    }
  };

  const handleQuickDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    login('admin', 'admin123').catch(() => {});
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-rose-500 selection:text-white">
      <div className="w-full max-w-md">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-lg shadow-rose-950/40 mb-3 ring-4 ring-rose-500/20">
            <Scissors className="w-8 h-8 rotate-90" />
          </div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-white">
            Sakuni Fashion
          </h1>
          <p className="text-rose-200/70 text-sm mt-1 font-sans">
            Apparel Manufacturing &amp; Tailoring Management System
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-2xl p-7 backdrop-blur-md">
          <div className="mb-6 pb-4 border-b border-slate-700/60">
            <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400" /> Admin Portal Access
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Only authorized administrators have system privileges.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 active:scale-[0.99] text-white font-medium py-2.5 rounded-xl shadow-lg shadow-rose-900/30 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Sign In to System</span>
                </>
              )}
            </button>
          </form>

          {/* Quick login hint */}
          <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <span>Demo default: <strong className="text-rose-400">admin / admin123</strong></span>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-amber-400 hover:text-amber-300 underline underline-offset-2 cursor-pointer"
            >
              Auto-fill &amp; Login
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Sakuni Fashion &copy; {new Date().getFullYear()} All Rights Reserved.
        </p>
      </div>
    </div>
  );
};
