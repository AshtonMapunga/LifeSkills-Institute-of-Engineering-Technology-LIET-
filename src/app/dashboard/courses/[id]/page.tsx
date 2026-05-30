'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export default function CourseDetailPage({ params }: Params) {
  const { id } = use(params);
  const [lesson, setLesson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`/api/lessons/${id}`);
        if (res.ok) {
          setLesson(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLesson();
  }, [id]);

  const renderMedia = (url: string) => {
    if (!url) return null;
    const isImage = url.match(/\.(jpeg|jpg|gif|png)$/i);
    const isAudio = url.match(/\.(mp3|wav|ogg)$/i);
    const isVideo = url.match(/\.(mp4|webm|ogg)$/i) || url.includes('youtube.com') || url.includes('youtu.be');

    if (isImage) return <img src={url} alt="Media" className="w-full rounded-xl" />;
    if (isAudio) return <audio controls className="w-full mt-2"><source src={url} /></audio>;
    if (isVideo) {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.split('v=')[1] || url.split('/').pop();
        return <iframe className="w-full aspect-video rounded-xl" src={`https://www.youtube.com/embed/${videoId}`} allowFullScreen />;
      }
      return <video controls className="w-full rounded-xl"><source src={url} /></video>;
    }
    return <a href={url} target="_blank" className="text-blue-500 underline text-sm">View Attachment</a>;
  };

  if (isLoading) return <div className="max-w-6xl mx-auto py-20 text-center font-bold text-slate-500 italic">Accessing Course Materials...</div>;

  if (!lesson) return <div className="max-w-6xl mx-auto py-20 text-center text-red-500 font-bold">Course not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-in-up pb-20">
      {/* Header / Breadcrumb */}
      <div className="flex flex-col gap-4">
        <Link href="/dashboard/courses" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[var(--primary)] transition-colors group">
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
          Back to Courses
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
           <div>
              <div className="flex items-center gap-3 mb-3">
                 <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full uppercase tracking-widest">{lesson.subject}</span>
                 <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold rounded-full uppercase tracking-widest">{lesson.type}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {lesson.title}
              </h1>
           </div>
           <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold text-xl">
                 {lesson.lessons?.length || 0}
              </div>
              <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</p>
                 <p className="font-extrabold text-slate-900 dark:text-white">Lessons</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-12">
          {/* Overview Section */}
          <section className="bg-white dark:bg-slate-950 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[var(--primary)] rounded-full"></span>
                Course Overview
             </h2>
             <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                {lesson.description}
             </p>
          </section>

          {/* Curriculum Section */}
          <section className="space-y-8">
             <h2 className="text-2xl font-black text-slate-900 dark:text-white px-2">Learning Curriculum</h2>
             
             <div className="space-y-6">
                {lesson.lessons?.map((subLesson: any, i: number) => (
                   <div key={i} className="group bg-white dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl transition-all duration-500">
                      <div className="flex flex-col sm:flex-row gap-6">
                         <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-xl font-black text-slate-300 dark:text-slate-700 shrink-0 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                            {String(i + 1).padStart(2, '0')}
                         </div>
                         <div className="space-y-4 flex-1">
                            <div>
                               <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-[var(--primary)] transition-colors">{subLesson.title}</h3>
                               <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">{subLesson.description}</p>
                            </div>
                            
                            {subLesson.mediaUrl && (
                               <div className="mt-6 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] overflow-hidden shadow-inner">
                                  {renderMedia(subLesson.mediaUrl)}
                               </div>
                            )}
                         </div>
                      </div>
                   </div>
                ))}

                {(!lesson.lessons || lesson.lessons.length === 0) && (
                   <div className="bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 p-20 text-center">
                      <span className="text-6xl block mb-6">🏜️</span>
                      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No lesson added</h3>
                      <p className="text-slate-500 font-medium max-w-xs mx-auto">This course content is placeholder and our instructors haven&apos;t added detailed lessons yet.</p>
                   </div>
                )}
             </div>
          </section>
        </div>

        {/* Sidebar Info Area */}
        <div className="lg:col-span-4 space-y-6">
           <div className="sticky top-10">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--primary)] opacity-20 blur-3xl rounded-full"></div>
                 <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500 opacity-10 blur-3xl rounded-full"></div>
                 
                 <div className="relative z-10 space-y-6">
                    <h3 className="text-xl font-black">Course Information</h3>
                    <div className="space-y-4">
                       <div className="flex justify-between py-3 border-b border-white/10 text-sm">
                          <span className="text-white/60 font-bold uppercase tracking-wider">Level</span>
                          <span className="font-black">Intermediate</span>
                       </div>
                       <div className="flex justify-between py-3 border-b border-white/10 text-sm">
                          <span className="text-white/60 font-bold uppercase tracking-wider">Language</span>
                          <span className="font-black">English</span>
                       </div>
                       <div className="flex justify-between py-3 border-b border-white/10 text-sm">
                          <span className="text-white/60 font-bold uppercase tracking-wider">Access</span>
                          <span className="font-black">Lifetime</span>
                       </div>
                    </div>
                    
                    <button className="w-full bg-white text-slate-900 font-black py-4 rounded-2xl hover:bg-slate-100 transition-colors shadow-lg active:scale-95 transform duration-200">
                       Mark as Completed
                    </button>
                 </div>
              </div>

              {/* Progress Sidebar */}
              <div className="mt-6 bg-white dark:bg-slate-950 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm text-center">
                 <div className="w-20 h-20 rounded-full border-4 border-slate-100 dark:border-slate-900 flex items-center justify-center mx-auto mb-4">
                    <span className="font-black text-xl text-slate-300 dark:text-slate-700">0%</span>
                 </div>
                 <p className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-widest">Enrolled Student</p>
                 <p className="text-xs text-slate-400 mt-1 font-bold">Start your learning journey above</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
