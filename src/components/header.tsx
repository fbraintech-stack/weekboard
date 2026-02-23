"use client";

import { getCurrentWeekYear, getWeekDateRange } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "./theme-toggle";

interface HeaderProps {
  onCreateTask: () => void;
}

export function Header({ onCreateTask }: HeaderProps) {
  const weekYear = getCurrentWeekYear();
  const dateRange = getWeekDateRange();
  const { signOut } = useAuth();

  return (
    <header className="sticky top-0 z-10 glass border-t-0 border-x-0">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight sm:text-xl" style={{ color: "var(--th-text)" }}>
            Week<span style={{ color: "var(--th-accent)" }}>Board</span>
          </h1>
          <p className="mt-0.5 text-[11px] tracking-wide" style={{ color: "var(--th-text-muted)" }}>
            {weekYear} &middot; {dateRange}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={onCreateTask}
            className="rounded-[10px] px-3.5 py-2 text-[13px] font-semibold transition-all hover:brightness-105 active:scale-[0.97] sm:text-sm"
            style={{
              backgroundColor: "var(--th-accent)",
              color: "#ffffff",
            }}
            aria-label="Criar nova tarefa"
          >
            + Tarefa
          </button>
          <button
            onClick={signOut}
            className="rounded-[10px] px-3 py-2 text-[13px] transition-all"
            style={{
              color: "var(--th-text-muted)",
              background: "var(--th-surface)",
              border: "1px solid var(--th-border)",
            }}
            title="Sair"
            aria-label="Sair da conta"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
