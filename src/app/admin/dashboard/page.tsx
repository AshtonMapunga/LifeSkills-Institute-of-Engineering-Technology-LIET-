"use client";

import Link from "next/link";

export default function AdminDashboardHome() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="relative w-full rounded-[2rem] overflow-hidden bg-slate-900 shadow-xl p-8 sm:p-12">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)] to-blue-900/80"></div>
        <div className="relative z-10 text-white">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Admin Dashboard</h1>
          <p className="text-lg text-blue-100 max-w-xl font-medium mb-8">
            Manage your institution's lessons, courses, and overall curriculum here.
          </p>
          <Link href="/admin/lessons" className="bg-white text-[var(--primary)] px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg">
            Manage Lessons
          </Link>
        </div>
      </div>
    </div>
  );
}
