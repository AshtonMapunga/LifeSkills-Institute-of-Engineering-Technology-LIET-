"use client";

import { useState, useEffect } from 'react';

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  reviewing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  accepted:  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  rejected:  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    const res = await fetch('/api/applications');
    if (res.ok) setApplications(await res.json());
    setIsLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const res = await fetch(`/api/applications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setApplications(prev => prev.map(a => a._id === id ? { ...a, status: updated.status } : a));
      if (selected?._id === id) setSelected((prev: any) => ({ ...prev, status: updated.status }));
    }
    setUpdating(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Applications</h1>
        <span className="text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          {applications.length} Total
        </span>
      </div>

      {isLoading ? (
        <div className="text-slate-500 py-10 text-center font-semibold">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-slate-500 font-medium">No applications submitted yet.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="text-left px-5 py-3.5 font-bold text-slate-600 dark:text-slate-300">Student</th>
                <th className="text-left px-5 py-3.5 font-bold text-slate-600 dark:text-slate-300 hidden md:table-cell">Program</th>
                <th className="text-left px-5 py-3.5 font-bold text-slate-600 dark:text-slate-300 hidden lg:table-cell">Submitted</th>
                <th className="text-left px-5 py-3.5 font-bold text-slate-600 dark:text-slate-300">Status</th>
                <th className="text-left px-5 py-3.5 font-bold text-slate-600 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {applications.map(app => (
                <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-bold text-slate-800 dark:text-white">{app.fullName}</div>
                    <div className="text-xs text-slate-500">{app.email}</div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div className="text-slate-700 dark:text-slate-300 font-medium">{app.programTrack}</div>
                    <div className="text-xs text-slate-500">{app.specificCourse}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-400 hidden lg:table-cell">
                    {new Date(app.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${STATUS_STYLES[app.status] || STATUS_STYLES.pending}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => setSelected(app)} className="text-xs font-bold text-[var(--primary)] hover:underline px-2 py-1 rounded-lg hover:bg-[var(--primary)]/10 transition-colors">
                        View
                      </button>
                      {app.status !== 'accepted' && (
                        <button disabled={updating === app._id} onClick={() => updateStatus(app._id, 'accepted')} className="text-xs font-bold text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 px-2 py-1 rounded-lg transition-colors disabled:opacity-50">
                          Accept
                        </button>
                      )}
                      {app.status !== 'rejected' && (
                        <button disabled={updating === app._id} onClick={() => updateStatus(app._id, 'rejected')} className="text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded-lg transition-colors disabled:opacity-50">
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">{selected.fullName}</h2>
                  <p className="text-slate-500 text-sm mt-1">{selected.email} · {selected.phone}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize ${STATUS_STYLES[selected.status] || STATUS_STYLES.pending}`}>
                  {selected.status}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                {[
                  ['Date of Birth', selected.dateOfBirth],
                  ['Gender', selected.gender],
                  ['ID Number', selected.idNumber],
                  ['Address', selected.address],
                  ['Guardian', selected.guardianName],
                  ['Guardian Phone', selected.guardianPhone],
                  ['Previous School', selected.previousSchool],
                  ['Last Grade', selected.lastGrade],
                  ['Results', selected.currentResults],
                  ['Program Track', selected.programTrack],
                  ['Course', selected.specificCourse],
                  ['Intake', selected.intakeStatus],
                  ['Heard About Us', selected.hearAboutUs],
                  ['Applied On', new Date(selected.createdAt).toLocaleDateString()],
                ].map(([label, value]) => value ? (
                  <div key={label}>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</span>
                    <p className="font-semibold text-slate-800 dark:text-white mt-0.5">{value}</p>
                  </div>
                ) : null)}
              </div>

              <div className="mt-8 flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                {selected.status !== 'accepted' && (
                  <button onClick={() => updateStatus(selected._id, 'accepted')} disabled={updating === selected._id} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition disabled:opacity-50">
                    ✓ Accept Application
                  </button>
                )}
                {selected.status !== 'rejected' && (
                  <button onClick={() => updateStatus(selected._id, 'rejected')} disabled={updating === selected._id} className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition disabled:opacity-50">
                    ✗ Reject Application
                  </button>
                )}
                <button onClick={() => setSelected(null)} className="px-6 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold py-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
