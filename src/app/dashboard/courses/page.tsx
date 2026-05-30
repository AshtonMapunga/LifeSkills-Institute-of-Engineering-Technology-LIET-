"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardCourses() {
  const [activeTab, setActiveTab] = useState<'core' | 'career'>('core');
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await fetch('/api/lessons');
      if (res.ok) {
        setLessons(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const coreLessons = lessons.filter(l => l.type === 'Core Academic');
  const careerLessons = lessons.filter(l => l.type === 'Career Based');
  
  const activeLessons = activeTab === 'core' ? coreLessons : careerLessons;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
      {/* Page Header and Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            Courses & Lessons
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Browse through your enrolled curriculum and find your study materials.
          </p>
        </div>
        
        {/* Tabs */}
        <div className="inline-flex bg-white dark:bg-slate-800/80 rounded-full shadow-sm p-1.5 border border-slate-200 dark:border-slate-700 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('core')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
              activeTab === 'core'
                ? 'bg-[var(--primary)] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            Core Academic Subjects
          </button>
          <button
            onClick={() => setActiveTab('career')}
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${
              activeTab === 'career'
                ? 'bg-[var(--primary)] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            Career-Based Classes
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-slate-500 py-10 flex items-center justify-center font-semibold">Loading courses...</div>
      ) : (
        /* Grid Display */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeLessons.map((subject, i) => (
            <div 
              key={subject._id} 
              className="group block bg-white dark:bg-slate-900 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 dark:border-slate-800 flex flex-col"
              style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.05}s backwards` }}
            >
              {/* Image Section */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10 opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>
                {subject.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={subject.imageUrl}
                    alt={subject.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <Image 
                    src={`https://picsum.photos/seed/${subject.imageSeed || '10'}/400/300`} 
                    alt={subject.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                  />
                )}
                <div className="absolute top-4 right-4 z-20">
                  <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-5 relative flex flex-col flex-1 min-h-[160px]">
                {/* Accent Line */}
                <div className="absolute top-0 left-0 w-0 h-1 bg-[var(--primary)] transition-all duration-500 group-hover:w-full"></div>
                
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-white leading-tight group-hover:text-[var(--primary)] dark:group-hover:text-[var(--primary-light)] transition-colors line-clamp-2">
                  {subject.title}
                </h3>
  
                <p className="text-sm text-slate-500 mt-2 line-clamp-2">{subject.description}</p>
                
                <div className="mt-auto flex items-center justify-between text-sm pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-400 dark:text-slate-500 py-1 px-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center gap-1.5 truncate max-w-[60%]">
                    {subject.subject}
                  </span>
                  <Link href={`/dashboard/courses/${subject._id}`} className="text-[var(--primary)] dark:text-[var(--primary-light)] font-bold hover:underline transition-all">
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {activeLessons.length === 0 && (
            <div className="col-span-full py-10 text-center flex flex-col items-center">
               <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl border-transparent">📚</span>
               </div>
               <p className="text-slate-500 font-medium">No {activeTab === 'core' ? 'core academic' : 'career-based'} subjects available right now.</p>
            </div>
          )}
        </div>
      )}
      
    </div>
  );
}
