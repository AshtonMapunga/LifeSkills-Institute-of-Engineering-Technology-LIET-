"use client";

import { useState, useEffect } from 'react';

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', date: '' });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    setIsLoading(true);
    const res = await fetch('/api/notices');
    if (res.ok) setNotices(await res.json());
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    if (res.ok) {
        setShowModal(false);
        setFormData({ title: '', description: '', date: '' });
        fetchNotices();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this notice?')) {
      await fetch(`/api/notices/${id}`, { method: 'DELETE' });
      fetchNotices();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Notice Board Management</h1>
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-[var(--primary)] text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-blue-600 transition-colors"
        >
          + Add New Notice
        </button>
      </div>

      {isLoading ? (
        <div className="text-slate-500 py-10 font-bold italic">Loading notices...</div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Notice Date</th>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {notices.map((notice) => (
                <tr key={notice._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-[var(--primary)] font-bold rounded-lg text-sm">
                      {notice.date}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">{notice.title}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-sm max-w-xs truncate">{notice.description}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(notice._id)} 
                      className="text-red-500 hover:text-red-600 font-bold text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {notices.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">No notices found. Add your first notice above!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ADD NOTICE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">Create New Notice</h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 ml-1">Notice Title</label>
                <input 
                  required 
                  className="w-full border-2 border-slate-100 dark:border-slate-800 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 focus:border-[var(--primary)] outline-none transition-all" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. Tuition Deadline" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 ml-1">Display Date</label>
                <input 
                  required 
                  className="w-full border-2 border-slate-100 dark:border-slate-800 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 focus:border-[var(--primary)] outline-none transition-all" 
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})} 
                  placeholder="e.g. Oct 24" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 ml-1">Description</label>
                <textarea 
                  required 
                  className="w-full border-2 border-slate-100 dark:border-slate-800 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 focus:border-[var(--primary)] outline-none transition-all" 
                  rows={3} 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Provide brief details..." 
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white py-4 rounded-2xl font-bold hover:bg-slate-200 transition">Cancel</button>
                <button type="submit" className="flex-1 bg-[var(--primary)] text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition shadow-lg">Publish Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
