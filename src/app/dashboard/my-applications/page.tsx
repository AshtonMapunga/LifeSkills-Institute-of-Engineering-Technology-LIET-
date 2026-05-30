"use client";

import { useState, useEffect } from 'react';

const STATUS_CFG: Record<string, { label: string; cls: string; icon: string }> = {
  pending:   { label: 'Pending Review', cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800', icon: '⏳' },
  reviewing: { label: 'Under Review',   cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800', icon: '🔍' },
  accepted:  { label: 'Accepted!',      cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800', icon: '✅' },
  rejected:  { label: 'Rejected',       cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800', icon: '❌' },
};

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setIsLoggedOut(true);
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/applications?userId=${encodeURIComponent(userId)}`);
        if (res.ok) {
          setApplications(await res.json());
        } else {
          setError('Failed to fetch applications');
        }
      } catch {
        setError('Network error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (isLoggedOut) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 animate-fade-in-up">
        <div className="text-6xl mb-6">🔒</div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">Please Log In</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">You need to be logged in to view your applications.</p>
        <a href="/login" className="bg-[var(--primary)] text-white font-bold px-8 py-3 rounded-xl hover:bg-[var(--primary-hover)] transition-colors inline-block">Go to Login</a>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <div className="animate-spin w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-500 font-medium">Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          My Applications
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Manage and track the status of your admissions applications.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm rounded-r-xl">
          {error}
        </div>
      )}

      {/* Results */}
      {applications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 py-20 text-center shadow-sm">
          <div className="text-6xl mb-6">📭</div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-2xl mb-3">No Applications Found</h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 max-w-sm mx-auto">It looks like you haven&apos;t submitted any applications yet. Ready to start your journey?</p>
          <a href="/dashboard/application" className="bg-[var(--primary)] text-white font-bold px-8 py-3 rounded-xl hover:bg-[var(--primary-hover)] transition-colors inline-block">Apply Now</a>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">{applications.length} application{applications.length !== 1 ? 's' : ''} found</h2>
          </div>
          {applications.map((app) => {
            const cfg = STATUS_CFG[app.status] || STATUS_CFG.pending;
            return (
              <div key={app._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 group">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-xl sm:text-2xl group-hover:text-[var(--primary)] transition-colors">{app.programTrack}</h3>
                      <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg font-bold text-xs uppercase tracking-wider">{app.specificCourse}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span>Submitted on {new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl text-sm font-extrabold whitespace-nowrap shadow-sm ${cfg.cls}`}>
                    <span className="text-lg">{cfg.icon}</span>
                    <span>{cfg.label}</span>
                  </div>
                </div>

                {/* Status progress visualization */}
                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between px-2 mb-4">
                    {['pending', 'reviewing', 'accepted'].map((s, i) => {
                      const steps = ['pending', 'reviewing', 'accepted', 'rejected'];
                      const currentIdx = steps.indexOf(app.status);
                      const isRejected = app.status === 'rejected';
                      const stepIdx = i;
                      const active = !isRejected && currentIdx >= stepIdx;
                      const isLast = i === 2;
                      
                      return (
                        <div key={s} className={`flex items-center ${!isLast ? 'flex-1' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-500 ${active ? 'bg-[var(--primary)] text-white scale-110 shadow-lg shadow-[var(--primary)]/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'}`}>
                            {active ? '✓' : i + 1}
                          </div>
                          {!isLast && (
                            <div className="flex-1 px-2">
                              <div className={`h-1.5 rounded-full transition-all duration-700 ${active && currentIdx > stepIdx ? 'bg-[var(--primary)]' : 'bg-slate-100 dark:bg-slate-800'}`} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest px-1">
                    <span>Pending Review</span>
                    <span>Evaluation</span>
                    <span>Final Decision</span>
                  </div>
                </div>

                {app.status === 'accepted' && (
                  <div className="mt-8 p-5 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/30 animate-pulse-subtle">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                        <span className="text-xl">🎊</span>
                      </div>
                      <div>
                        <h4 className="text-green-800 dark:text-green-300 font-extrabold mb-1">Congratulations!</h4>
                        <p className="text-green-700 dark:text-green-400 font-medium text-sm">Your application has been accepted! Welcome to the LifeSkills Institute. Our admissions team will contact you with your official enrollment package and next steps within 48 hours.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {app.status === 'rejected' && (
                  <div className="mt-8 p-5 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                        <span className="text-xl">✉️</span>
                      </div>
                      <div>
                        <h4 className="text-red-800 dark:text-red-300 font-extrabold mb-1">Application Status Update</h4>
                        <p className="text-red-700 dark:text-red-400 font-medium text-sm">We regret to inform you that your application was not successful at this time. We appreciate your interest in LifeSkills Institute. You are welcome to re-apply for future intakes or contact our admissions office for guidance.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
