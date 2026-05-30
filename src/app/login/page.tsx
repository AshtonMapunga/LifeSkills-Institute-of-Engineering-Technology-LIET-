'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'student';

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store in localStorage
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('token', data.token);

      if (data.role === 'admin' || role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 font-sans transition-colors duration-300">
      {/* Form Side */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative overflow-hidden w-full">
        {/* Subtle background blob */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--primary)] opacity-[0.03] dark:opacity-10 rounded-full blur-[100px]" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="lg:hidden mb-10 flex justify-center">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 bg-white rounded-lg p-1.5 border border-slate-200 dark:border-slate-800 shadow-md">
                <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">LifeSkills</span>
            </Link>
          </div>

          <div className="mb-10 text-center lg:text-left flex flex-col justify-center animate-fade-in-up">
            <Link href="/" className="hidden lg:inline-flex items-center gap-3 mb-12 group opacity-70 hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5 text-slate-800 dark:text-slate-200 transform transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Back to Home</span>
            </Link>

            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              Welcome Back {role === 'admin' ? '(Admin)' : ''}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Log in to access your portal</p>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none transition-all placeholder:text-slate-400" />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1 mb-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
                <Link href="#" className="text-xs font-bold text-[var(--primary)] dark:text-[var(--primary-light)] hover:underline transition-all">Forgot password?</Link>
              </div>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none transition-all placeholder:text-slate-400" />
            </div>

            <button type="submit" disabled={isLoading} className="w-full flex justify-center bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-[var(--primary)]/30 hover:-translate-y-0.5 mt-8 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-slate-600 dark:text-slate-400 font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Don&apos;t have an account?{' '}
            <Link href={`/register?role=${role}`} className="text-[var(--primary)] dark:text-[var(--primary-light)] font-bold hover:underline transition-all ml-1">
              Enroll now
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
