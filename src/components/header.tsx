"use client";

import { getCurrentWeekYear, getWeekDateRange } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

interface HeaderProps {
  onCreateTask: () => void;
}

export function Header({ onCreateTask }: HeaderProps) {
  const weekYear = getCurrentWeekYear();
  const dateRange = getWeekDateRange();
  const { signOut } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">
            Week<span className="text-blue-600">Board</span>
          </h1>
          <p className="text-xs text-slate-400">
            {weekYear} &middot; {dateRange}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateTask}
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 sm:px-4 sm:text-sm"
          >
            + Tarefa
          </button>
          <button
            onClick={signOut}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-500 transition-colors hover:bg-slate-50"
            title="Sair"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
