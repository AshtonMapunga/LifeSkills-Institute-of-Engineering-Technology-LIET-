"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { 
      name: 'Dashboard', 
      href: '/dashboard',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      name: 'Courses & Lessons', 
      href: '/dashboard/courses',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    { 
      name: 'Co-Curriculum', 
      href: '/dashboard/activities',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      name: 'Online Application', 
      href: '/dashboard/application',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      name: 'My Applications',
      href: '/dashboard/my-applications',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 left-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-sm z-30 transition-colors duration-300">
        <div className="p-6">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-lg p-1 transition-transform duration-300 border border-slate-100 dark:border-slate-800 shadow-sm">
              <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
            </div>
            <span className="font-extrabold text-xl text-[var(--primary)] dark:text-[var(--primary-light)]">LifeSkills</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className={`${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                  {item.icon}
                </div>
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-slate-200 dark:border-slate-800">
          <button className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 pb-[88px] lg:pb-0 relative overflow-x-hidden min-h-screen flex flex-col">
        {/* Desktop Top Header */}
        <header className="hidden lg:flex h-20 items-center justify-between px-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800">
          <div className="font-bold text-xl text-slate-800 dark:text-slate-100">Welcome back, Sarah! 👋</div>
          <div className="flex items-center gap-4">
             {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {theme === 'dark' ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    )}
                </button>
             )}
             <div className="w-10 h-10 rounded-full border-2 border-[var(--primary)] overflow-hidden relative shadow-sm">
                <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" fill alt="Profile" className="object-cover" />
             </div>
          </div>
        </header>

        {/* Mobile Top Header */}
        <header className="lg:hidden flex h-16 items-center justify-between px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded p-0.5 border border-slate-200 dark:border-slate-700">
              <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
            </div>
            <span className="font-extrabold text-lg text-[var(--primary)] dark:text-[var(--primary-light)]">LifeSkills</span>
          </Link>
          <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 overflow-hidden relative">
            <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" fill alt="Profile" className="object-cover" />
          </div>
        </header>

        <div className="p-4 sm:p-8 flex-1 animate-fade-in-up">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation (hidden on desktop) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-none z-40 pb-safe">
        <ul className="flex justify-around items-center h-[72px] px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} className="w-1/4">
                <Link 
                  href={item.href}
                  className={`flex flex-col items-center justify-center h-full space-y-1 transition-all duration-300 ${
                    isActive ? 'text-[var(--primary)] dark:text-[var(--primary-light)]' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <div className={`transition-all duration-300 ${isActive ? 'scale-110 -translate-y-1' : 'scale-100'}`}>
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-bold tracking-wide truncate w-full text-center px-1 ${isActive ? 'opacity-100' : 'opacity-0 translate-y-2'}`} style={{ transition: 'all 0.3s ease' }}>
                    {item.name.replace(/ & Lessons|Co-/, '')}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

    </div>
  );
}
