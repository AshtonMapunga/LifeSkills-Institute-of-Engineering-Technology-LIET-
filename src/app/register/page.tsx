'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'student';
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push(`/login?role=${role}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-white dark:bg-slate-950 font-sans transition-colors duration-300">
      {/* Visual Side */}
      <div className="relative hidden lg:flex items-center justify-center p-12 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Students on campus"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/80 to-slate-950/90 mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 text-white max-w-lg text-center">
          {/* Content removed as requested */}
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Subtle background blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[var(--primary)] opacity-[0.03] dark:opacity-10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500 opacity-[0.03] dark:opacity-10 rounded-full blur-[100px]" />
        
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
            <Link href="/" className="hidden lg:inline-flex items-center gap-3 mb-10 group opacity-70 hover:opacity-100 transition-opacity">
              <svg className="w-5 h-5 text-slate-800 dark:text-slate-200 transform transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-widest">Back</span>
            </Link>

            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              Create Account {role === 'admin' ? '(Admin)' : ''}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Enter your details to enroll</p>
          </div>

          {error && <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="John Doe" className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none transition-all placeholder:text-slate-400" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none transition-all placeholder:text-slate-400" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+1 (555) 000-0000" className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none transition-all placeholder:text-slate-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength={6} placeholder="••••••••" className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none transition-all placeholder:text-slate-400" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Confirm Password</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength={6} placeholder="••••••••" className="w-full px-4 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none transition-all placeholder:text-slate-400" />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold py-4 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-[var(--primary)]/30 hover:-translate-y-0.5 mt-8 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Registering...' : 'Complete Registration'}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-slate-600 dark:text-slate-400 font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Already have an account?{' '}
            <Link href={`/login?role=${role}`} className="text-[var(--primary)] dark:text-[var(--primary-light)] font-bold hover:underline transition-all ml-1">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function Register() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
