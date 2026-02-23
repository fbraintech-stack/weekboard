"use client";

import { getCurrentWeekYear } from "@/lib/utils";

export function Header() {
  const weekYear = getCurrentWeekYear();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Week<span className="text-blue-600">Board</span>
        </h1>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:text-sm">
          {weekYear}
        </span>
      </div>
    </header>
  );
}
