"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardHome() {
  const [courses, setCourses] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/lessons').then(res => res.json()),
      fetch('/api/notices').then(res => res.json())
    ]).then(([lessonsData, noticesData]) => {
      setCourses(lessonsData.slice(0, 2)); // Show only first 2 for "Continue"
      setNotices(noticesData.slice(0, 3)); // Show first 3 notices
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      {/* Creative Welcome Banner */}
      <div className="relative w-full rounded-[2rem] overflow-hidden bg-slate-900 shadow-xl group">
        <div className="absolute inset-0">
           <Image 
             src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
             fill 
             className="object-cover opacity-40 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105"
             alt="Library" 
           />
           <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/90 via-blue-900/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 p-8 sm:p-12 h-full flex flex-col justify-center min-h-[300px]">
          <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm font-bold tracking-widest uppercase mb-4 border border-white/20">
            Current Semester 2026
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 leading-tight tracking-tight">
            Ready to learn <br className="hidden sm:block"/> today?
          </h1>
          <p className="text-lg text-blue-100 max-w-xl font-medium">
            Welcome back to your educational journey. Check your latest courses and important notices below to stay updated.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4">
             <Link href="/dashboard/courses" className="bg-white text-[var(--primary)] px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-white/10">
               Resume Course
             </Link>
             <Link href="/dashboard/application" className="bg-white/10 text-white border border-white/30 px-6 py-3 rounded-full font-bold hover:bg-white/20 backdrop-blur-md transition-colors">
               Apply for New Course
             </Link>
          </div>
        </div>
        
        {/* Decorative Floating Circle */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 border-[30px] border-white/10 rounded-full blur-[2px]"></div>
      </div>

      {/* Grid Content: Courses & News */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column - Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Continue Learning</h2>
            <Link href="/dashboard/courses" className="text-sm font-bold text-[var(--primary)] dark:text-[var(--primary-light)] hover:underline">View All</Link>
          </div>
          
          {isLoading ? (
            <div className="text-slate-400 font-bold italic py-10">Syncing with curriculum...</div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {courses.map((course, i) => (
                <Link href={`/dashboard/courses/${course._id}`} key={course._id} className="bg-white dark:bg-slate-900 rounded-[1.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-xl transition-all duration-300">
                  <div className="h-32 bg-slate-200 relative overflow-hidden">
                    {course.imageUrl ? (
                        <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <Image src={`https://picsum.photos/seed/${course.imageSeed || i}/400/200`} fill alt={course.title} className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-bold text-[var(--primary)] dark:text-[var(--primary-light)] mb-1 uppercase tracking-wider">{course.subject}</p>
                    <h3 className="font-bold text-slate-800 dark:text-white mb-2 line-clamp-1">{course.title}</h3>
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-xs font-bold text-slate-400">{course.lessons?.length || 0} Lessons</span>
                        <span className="text-xs text-[var(--primary)] font-black">START →</span>
                    </div>
                  </div>
                </Link>
              ))}
              {courses.length === 0 && <p className="text-slate-400 italic">No courses enrolled yet.</p>}
            </div>
          )}
        </div>

        {/* Right Column - Notice Board */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Notice Board</h2>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6 min-h-[300px]">
            {isLoading ? (
                <div className="text-slate-400 text-sm italic">Checking bulletins...</div>
            ) : notices.map((notice, i) => (
              <div key={notice._id} className="flex gap-4 group cursor-pointer animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex flex-col items-center justify-center w-14 h-14 shrink-0 rounded-2xl bg-blue-50 dark:bg-slate-800 text-[var(--primary)] dark:text-[var(--primary-light)] border border-[var(--primary)]/10 group-hover:bg-[var(--primary)] group-hover:text-white transition-colors duration-300">
                  <span className="text-xs font-bold uppercase">{notice.date.split(' ')[0]}</span>
                  <span className="text-lg font-extrabold leading-none">{notice.date.split(' ')[1]}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-sm group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary-light)] transition-colors">{notice.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{notice.description}</p>
                </div>
              </div>
            ))}
            {!isLoading && notices.length === 0 && (
                <div className="text-center py-10 opacity-30">
                    <span className="text-3xl block mb-2">📭</span>
                    <p className="text-xs font-bold italic">No active notices.</p>
                </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
