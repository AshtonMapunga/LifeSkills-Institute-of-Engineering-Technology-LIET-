import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-blue-100/30 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 -z-10" />
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[var(--primary)]/20 dark:bg-[var(--primary)]/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[150px] -z-10" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="w-full max-w-5xl z-10 animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-xl mb-6 hover:scale-105 transition-transform duration-300">
            <Image src="/logo.png" alt="LifeSkills Logo" width={64} height={64} className="object-contain drop-shadow-md" priority />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Welcome to <br className="sm:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)]">LifeSkills</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-medium">
            Select your role to access your personalized portal and continue your journey with us.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10 max-w-4xl mx-auto">
          {/* User Role Card */}
          <Link href="/login?role=student" className="group relative bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 sm:p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--primary)]/20 hover:border-[var(--primary)]/50 focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20 overflow-hidden block">
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 bg-blue-100/50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-[var(--primary)] mb-8 group-hover:scale-110 group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-500 shadow-sm border border-blue-200 dark:border-slate-700 group-hover:border-transparent">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-[var(--primary)] transition-colors">User / Student</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                Access your courses, track your progress, participate in activities, and manage your student profile.
              </p>
              
              <div className="mt-auto flex items-center text-sm font-bold tracking-wider uppercase text-[var(--primary)]">
                <span>Continue as User</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Admin Role Card */}
          <Link href="/login?role=admin" className="group relative bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 sm:p-10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--primary)]/20 hover:border-[var(--primary)]/50 focus:outline-none focus:ring-4 focus:ring-[var(--primary)]/20 overflow-hidden block">
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="w-16 h-16 bg-blue-100/50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-[var(--primary)] mb-8 group-hover:scale-110 group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-500 shadow-sm border border-blue-200 dark:border-slate-700 group-hover:border-transparent">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-[var(--primary)] transition-colors">Administrator</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                Manage student records, organize activities, review applications, and oversee institute operations.
              </p>
              
              <div className="mt-auto flex items-center text-sm font-bold tracking-wider uppercase text-[var(--primary)]">
                <span>Continue as Admin</span>
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Link / Info */}
        <div className="mt-16 text-center text-slate-500 dark:text-slate-400 text-sm font-medium animate-fade-in-up md:mt-24">
          <p>© 2026 LifeSkills Institute of Engineering Technology.</p>
        </div>
      </div>
    </main>
  );
}
