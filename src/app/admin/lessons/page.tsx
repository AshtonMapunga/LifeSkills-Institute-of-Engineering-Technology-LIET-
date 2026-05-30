"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdminLessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingLesson, setViewingLesson] = useState<any>(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    subject: '', 
    type: 'Core Academic', 
    description: '', 
    imageSeed: '10', 
    imageUrl: '',
    lessons: [] as any[]
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    setIsLoading(true);
    const res = await fetch('/api/lessons');
    if (res.ok) setLessons(await res.json());
    setIsLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/lessons/${editingId}` : '/api/lessons';
    const method = editingId ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    setShowModal(false);
    setEditingId(null);
    fetchLessons();
  };

  const addSubLesson = () => {
    setFormData({
      ...formData,
      lessons: [...formData.lessons, { title: '', description: '', mediaUrl: '' }]
    });
  };

  const updateSubLesson = (index: number, field: string, value: string) => {
    const newSubLessons = [...formData.lessons];
    newSubLessons[index] = { ...newSubLessons[index], [field]: value };
    setFormData({ ...formData, lessons: newSubLessons });
  };

  const removeSubLesson = (index: number) => {
    const newSubLessons = formData.lessons.filter((_, i) => i !== index);
    setFormData({ ...formData, lessons: newSubLessons });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this class/course?')) {
      await fetch(`/api/lessons/${id}`, { method: 'DELETE' });
      fetchLessons();
    }
  };

  const openEdit = (lesson: any) => {
    setFormData({ 
      title: lesson.title, 
      subject: lesson.subject, 
      type: lesson.type, 
      description: lesson.description, 
      imageSeed: lesson.imageSeed || '10', 
      imageUrl: lesson.imageUrl || '',
      lessons: lesson.lessons || []
    });
    setEditingId(lesson._id);
    setShowModal(true);
  };

  const openView = (lesson: any) => {
    setViewingLesson(lesson);
    setShowViewModal(true);
  };

  const openNew = () => {
    setFormData({ title: '', subject: '', type: 'Core Academic', description: '', imageSeed: '10', imageUrl: '', lessons: [] });
    setEditingId(null);
    setShowModal(true);
  };

  const renderMedia = (url: string) => {
    if (!url) return null;
    const isImage = url.match(/\.(jpeg|jpg|gif|png)$/i);
    const isAudio = url.match(/\.(mp3|wav|ogg)$/i);
    const isVideo = url.match(/\.(mp4|webm|ogg)$/i) || url.includes('youtube.com') || url.includes('youtu.be');

    if (isImage) return <img src={url} alt="Media" className="w-full rounded-xl" />;
    if (isAudio) return <audio controls className="w-full mt-2"><source src={url} /></audio>;
    if (isVideo) {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const id = url.split('v=')[1] || url.split('/').pop();
        return <iframe className="w-full aspect-video rounded-xl" src={`https://www.youtube.com/embed/${id}`} allowFullScreen />;
      }
      return <video controls className="w-full rounded-xl"><source src={url} /></video>;
    }
    return <a href={url} target="_blank" className="text-blue-500 underline text-sm">View Attachment</a>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Classes & Courses</h1>
        <button onClick={openNew} className="bg-[var(--primary)] text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:bg-blue-600 transition-colors">
          + Add Class or Course
        </button>
      </div>

      {isLoading ? (
        <div className="text-slate-500 py-10">Loading...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map(lesson => (
            <div key={lesson._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-lg">
              <div className="h-32 -mx-5 -mt-5 mb-4 relative overflow-hidden bg-slate-200">
                {lesson.imageUrl ? (
                  <img src={lesson.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <Image src={`https://picsum.photos/seed/${lesson.imageSeed}/400/200`} fill className="object-cover" alt="Thumbnail" unoptimized />
                )}
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{lesson.type}</span>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-1 mb-2 leading-tight">{lesson.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-2">{lesson.description}</p>
              
              <div className="mt-auto space-y-2">
                <button onClick={() => openView(lesson)} className="w-full bg-[var(--primary)]/10 text-[var(--primary)] px-4 py-2.5 rounded-xl font-bold hover:bg-[var(--primary)] hover:text-white transition-all">
                  View Lessons ({lesson.lessons?.length || 0})
                </button>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(lesson)} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 flex-1 rounded-lg font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(lesson._id)} className="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 px-4 py-2 flex-1 rounded-lg font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {lessons.length === 0 && <div className="text-slate-500 py-4">No content added yet.</div>}
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] w-full max-w-2xl shadow-2xl relative my-auto">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6">{editingId ? 'Edit Class/Course' : 'Add New Class/Course'}</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 ml-1">Title</label>
                  <input required className="w-full border-2 border-slate-100 dark:border-slate-800 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 focus:border-[var(--primary)] outline-none transition-all" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Advanced Networking" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 ml-1">Subject</label>
                  <input required className="w-full border-2 border-slate-100 dark:border-slate-800 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 focus:border-[var(--primary)] outline-none transition-all" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} placeholder="e.g. Computer Science" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 ml-1">Type</label>
                  <select className="w-full border-2 border-slate-100 dark:border-slate-800 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 focus:border-[var(--primary)] outline-none transition-all" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option>Core Academic</option>
                    <option>Career Based</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 ml-1">Card Image URL</label>
                  <input className="w-full border-2 border-slate-100 dark:border-slate-800 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 focus:border-[var(--primary)] outline-none transition-all" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} placeholder="https://..." />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1.5 ml-1">Class Description</label>
                <textarea className="w-full border-2 border-slate-100 dark:border-slate-800 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 focus:border-[var(--primary)] outline-none transition-all" rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Overall details..."></textarea>
              </div>

              {/* Lessons Section */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white">Nested Lessons ({formData.lessons.length})</h3>
                  <button type="button" onClick={addSubLesson} className="text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 transition">
                    + Add Lesson
                  </button>
                </div>
                
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.lessons.map((lesson, idx) => (
                    <div key={idx} className="p-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50 relative group">
                      <button type="button" onClick={() => removeSubLesson(idx)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      <div className="space-y-3">
                        <input className="w-full font-bold text-sm bg-transparent border-b border-transparent focus:border-[var(--primary)] outline-none" placeholder="Lesson Title" value={lesson.title} onChange={e => updateSubLesson(idx, 'title', e.target.value)} />
                        <textarea className="w-full text-xs bg-transparent border-none outline-none resize-none" placeholder="Description..." rows={1} value={lesson.description} onChange={e => updateSubLesson(idx, 'description', e.target.value)} />
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                          <span className="text-[10px] font-bold text-slate-400">MEDIA URL</span>
                          <input className="flex-1 bg-transparent text-xs outline-none" placeholder="Image, Audio, or Video link" value={lesson.mediaUrl} onChange={e => updateSubLesson(idx, 'mediaUrl', e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.lessons.length === 0 && <p className="text-center text-xs text-slate-400 py-4 italic">No lessons added. Click "+ Add Lesson" to start.</p>}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white py-4 rounded-2xl font-bold hover:bg-slate-200 transition">Cancel</button>
                <button type="submit" className="flex-1 bg-[var(--primary)] text-white py-4 rounded-2xl font-bold hover:bg-blue-600 transition shadow-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showViewModal && viewingLesson && (
        <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto pt-20 pb-10">
          <div className="bg-white dark:bg-slate-950 rounded-[2.5rem] w-full max-w-4xl shadow-2xl relative overflow-hidden my-auto">
            <button onClick={() => setShowViewModal(false)} className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="grid md:grid-cols-5 h-full max-h-[85vh]">
              {/* Left Sidebar Info */}
              <div className="md:col-span-2 bg-slate-100 dark:bg-slate-900/50 p-8 flex flex-col">
                <div className="h-48 w-full relative rounded-3xl overflow-hidden mb-6 shadow-xl">
                  {viewingLesson.imageUrl ? (
                    <img src={viewingLesson.imageUrl} alt={viewingLesson.title} className="w-full h-full object-cover" />
                  ) : (
                    <Image src={`https://picsum.photos/seed/${viewingLesson.imageSeed}/400/300`} fill className="object-cover" alt="Thumb" unoptimized />
                  )}
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">{viewingLesson.title}</h2>
                <div className="flex items-center gap-2 mb-4">
                   <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">{viewingLesson.subject}</span>
                   <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold rounded-full">{viewingLesson.type}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">{viewingLesson.description}</p>
                <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">TOTAL LESSONS</p>
                   <p className="text-3xl font-black text-[var(--primary)]">{viewingLesson.lessons?.length || 0}</p>
                </div>
              </div>

              {/* Right Content Lessons */}
              <div className="md:col-span-3 p-8 bg-white dark:bg-slate-950 overflow-y-auto custom-scrollbar">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Course Curriculum</h3>
                <div className="space-y-8">
                  {viewingLesson.lessons?.map((lesson: any, i: number) => (
                    <div key={i} className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-black text-slate-400 shrink-0">
                          {i + 1}
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-slate-900 dark:text-white">{lesson.title}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{lesson.description}</p>
                        </div>
                      </div>
                      
                      {lesson.mediaUrl && (
                        <div className="ml-12 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900">
                          {renderMedia(lesson.mediaUrl)}
                        </div>
                      )}
                    </div>
                  ))}
                  {(!viewingLesson.lessons || viewingLesson.lessons.length === 0) && (
                    <div className="text-center py-20 opacity-40">
                      <span className="text-5xl block mb-4">📢</span>
                      <p className="font-bold">No lessons added to this course yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
