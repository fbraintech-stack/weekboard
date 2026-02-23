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
    <header className="sticky top-0 z-10 glass border-t-0 border-x-0">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Week<span className="text-[var(--accent)]">Board</span>
          </h1>
          <p className="mt-0.5 text-[11px] tracking-wide text-slate-500">
            {weekYear} &middot; {dateRange}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateTask}
            className="rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white transition-all hover:brightness-110 sm:text-sm"
          >
            + Tarefa
          </button>
          <button
            onClick={signOut}
            className="glass glass-hover rounded-xl px-3 py-2 text-xs text-slate-400 transition-all hover:text-white"
            title="Sair"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
