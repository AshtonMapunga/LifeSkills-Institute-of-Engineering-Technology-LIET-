"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardHome() {
  const [courses, setCourses] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/lessons').then(res => res.json()),
      fetch('/api/notices').then(res => res.json()),
      fetch('/api/co-curriculum').then(res => res.json())
    ]).then(([lessonsData, noticesData, activitiesData]) => {
      setCourses(lessonsData.slice(0, 2));
      setNotices(noticesData.slice(0, 3));
      setActivities(activitiesData.slice(0, 3));
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in-up">
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
        
        <div className="relative z-10 p-8 sm:p-12 h-full flex flex-col justify-center min-h-[350px]">
          <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm font-bold tracking-widest uppercase mb-4 border border-white/20">
            Current Semester 2026
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
            Elevate Your <br className="hidden sm:block"/> Potential Today.
          </h1>
          <p className="text-xl text-blue-100 max-w-xl font-medium leading-relaxed">
            From technical mastery to physical excellence, your journey at LifeSkills is designed to build the person you want to become.
          </p>
        </div>
      </div>

      {/* Main Grid Content: Courses & News */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column - Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">📖</span>
                Continue Learning
            </h2>
            <Link href="/dashboard/courses" className="text-sm font-bold text-[var(--primary)] dark:text-[var(--primary-light)] hover:underline">View All</Link>
          </div>
          
          {isLoading ? (
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[2rem] text-center text-slate-400 italic">Syncing with curriculum...</div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {courses.map((course, i) => (
                <Link href={`/dashboard/courses/${course._id}`} key={course._id} className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-xl transition-all duration-300">
                  <div className="h-40 bg-slate-200 relative overflow-hidden">
                    {course.imageUrl ? (
                        <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <Image src={`https://picsum.photos/seed/${course.imageSeed || i}/400/200`} fill alt={course.title} className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] font-black text-[var(--primary)] dark:text-[var(--primary-light)] mb-2 uppercase tracking-widest">{course.subject}</p>
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 line-clamp-1 group-hover:text-[var(--primary)] transition-colors">{course.title}</h3>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400">{course.lessons?.length || 0} Modules</span>
                        <span className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-white transition-all transform group-hover:rotate-45">→</span>
                    </div>
                  </div>
                </Link>
              ))}
              {courses.length === 0 && <p className="text-slate-400 italic py-10 px-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] w-full col-span-2">No courses enrolled yet.</p>}
            </div>
          )}
        </div>

        {/* Right Column - Notice Board */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-orange-100 dark:bg-orange-900/40 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400">🔔</span>
                Notice Board
            </h2>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-8 space-y-8 min-h-[300px]">
            {isLoading ? (
                <div className="text-slate-400 text-sm italic">Checking bulletins...</div>
            ) : notices.map((notice, i) => (
              <div key={notice._id} className="flex gap-5 group cursor-pointer animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex flex-col items-center justify-center w-14 h-14 shrink-0 rounded-2xl bg-blue-50 dark:bg-slate-800 text-[var(--primary)] dark:text-[var(--primary-light)] border border-[var(--primary)]/10 group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                  <span className="text-[10px] font-black uppercase tracking-tighter">{notice.date.split(' ')[0]}</span>
                  <span className="text-xl font-black leading-none">{notice.date.split(' ')[1]}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-slate-800 dark:text-white text-sm group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary-light)] transition-colors leading-tight">{notice.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-medium">{notice.description}</p>
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

      {/* Co-Curriculum Sections */}
      <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">🏆</span>
                Co-Curriculum Highlights
            </h2>
            <Link href="/dashboard/co-curriculum" className="text-sm font-bold text-[var(--primary)] dark:text-[var(--primary-light)] hover:underline">Explore All</Link>
          </div>

          {isLoading ? (
            <div className="text-slate-400 italic font-bold">Loading activities...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
                {activities.map((activity, i) => (
                    <Link href="/dashboard/co-curriculum" key={activity._id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                        <div className="relative z-10">
                            <span className="px-3 py-1 bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-black rounded-full uppercase tracking-widest mb-4 block w-fit italic">
                                {activity.category.split(' ')[0]}
                            </span>
                            <h3 className="font-extrabold text-lg text-slate-800 dark:text-white mb-2 leading-tight">{activity.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium mb-4">{activity.description}</p>
                            <span className="text-[10px] font-black text-[var(--primary)] group-hover:gap-2 flex items-center gap-1 transition-all">VIEW ACTIVITY ➜</span>
                        </div>
                        {activity.imageUrl && (
                            <Image 
                                src={activity.imageUrl} 
                                width={100} height={100} 
                                alt={activity.title} 
                                className="absolute -bottom-4 -right-4 w-24 h-24 object-cover opacity-10 group-hover:scale-125 transition-transform duration-700 blur-[0.5px]" 
                                unoptimized 
                            />
                        )}
                    </Link>
                ))}
                {activities.length === 0 && <p className="text-slate-400 italic py-6">No activities spotlighted yet.</p>}
            </div>
          )}
      </div>
    </div>
  );
}
