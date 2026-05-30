"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function StudentCoCurriculumPage() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    const res = await fetch('/api/co-curriculum');
    if (res.ok) setItems(await res.json());
    setIsLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="bg-gradient-to-r from-blue-700 to-[var(--primary)] p-12 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-4">Co-Curriculum Activities</h1>
          <p className="text-blue-100 max-w-xl text-lg font-medium">Explore our vibrant range of sports, physical development programs, and life-skill academies designed to build character and community.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </div>

      {isLoading ? (
        <div className="text-slate-400 font-bold italic py-10 text-center">Opening the activity catalog...</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <div key={item._id} className="bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm group hover:shadow-2xl transition-all duration-500 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="h-48 bg-slate-200 relative overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl bg-slate-100 dark:bg-slate-800">🏆</div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[10px] font-black text-[var(--primary)] uppercase tracking-widest shadow-sm">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="font-black text-xl text-slate-800 dark:text-white mb-3 group-hover:text-[var(--primary)] transition-colors">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-4 font-medium">{item.description}</p>
                
                <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Available to all students</span>
                    <button className="text-[var(--primary)] font-black text-sm hover:translate-x-2 transition-transform">EXPLORE →</button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full py-20 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
              <span className="text-5xl block mb-4">👟</span>
              <p className="font-bold">No co-curriculum activities published yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
