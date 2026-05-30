"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminCoCurriculumPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    imageUrl: '', 
    category: 'Sports and Physical Development' 
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    const res = await fetch('/api/co-curriculum');
    if (res.ok) setItems(await res.json());
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/co-curriculum/${editingId}` : '/api/co-curriculum';
    const method = editingId ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    setShowModal(false);
    setEditingId(null);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      await fetch(`/api/co-curriculum/${id}`, { method: 'DELETE' });
      fetchItems();
    }
  };

  const openEdit = (item: any) => {
    setFormData({ 
      title: item.title, 
      description: item.description, 
      imageUrl: item.imageUrl || '', 
      category: item.category 
    });
    setEditingId(item._id);
    setShowModal(true);
  };

  const openNew = () => {
    setFormData({ title: '', description: '', imageUrl: '', category: 'Sports and Physical Development' });
    setEditingId(null);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Co-Curriculum Management</h1>
        <button onClick={openNew} className="bg-[var(--primary)] text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-blue-600 transition-colors">
          + Add Activity
        </button>
      </div>

      {isLoading ? (
        <div className="text-slate-500 py-10 font-bold italic">Loading activities...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col group hover:shadow-lg transition-all overflow-hidden">
              <div className="h-40 -mx-5 -mt-5 mb-4 relative overflow-hidden bg-slate-200">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="Activity" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">🏆</div>
                )}
              </div>
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded w-fit mb-3">
                {item.category}
              </span>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 leading-tight">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-3">{item.description}</p>
              
              <div className="flex gap-2 mt-auto">
                <button onClick={() => openEdit(item)} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 flex-1 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                  Edit
                </button>
                <button onClick={() => handleDelete(item._id)} className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 px-4 py-2 flex-1 rounded-lg font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <div className="text-slate-500 py-4 italic">No activities added yet.</div>}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] w-full max-w-md shadow-2xl relative">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">{editingId ? 'Edit Activity' : 'Add New Activity'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 ml-1">Title</label>
                <input required className="w-full border-2 border-slate-100 dark:border-slate-800 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 focus:border-[var(--primary)] outline-none transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Football Academy" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 ml-1">Category</label>
                <select className="w-full border-2 border-slate-100 dark:border-slate-800 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 focus:border-[var(--primary)] outline-none transition-all" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option>Sports and Physical Development</option>
                  <option>Life Skill Sport Academy</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 ml-1">Image URL</label>
                <input className="w-full border-2 border-slate-100 dark:border-slate-800 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 focus:border-[var(--primary)] outline-none transition-all" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 ml-1">Description</label>
                <textarea required className="w-full border-2 border-slate-100 dark:border-slate-800 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 focus:border-[var(--primary)] outline-none transition-all" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the activity..."></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white py-4 rounded-2xl font-bold hover:bg-slate-200 transition">Cancel</button>
                <button type="submit" className="flex-1 bg-[var(--primary)] text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition shadow-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
