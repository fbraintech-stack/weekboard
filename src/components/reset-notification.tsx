"use client";

interface ResetNotificationProps {
  recurrentReset: number;
  carryOver: number;
  removed: number;
  onDismiss: () => void;
}

export function ResetNotification({
  recurrentReset,
  carryOver,
  removed,
  onDismiss,
}: ResetNotificationProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="glass rounded-2xl border-[var(--accent)]/20 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-[var(--accent)]">
              Nova semana iniciada
            </h3>
            <ul className="mt-2 space-y-1 text-xs text-slate-400">
              {recurrentReset > 0 && (
                <li>
                  {recurrentReset} tarefa{recurrentReset > 1 ? "s" : ""}{" "}
                  recorrente{recurrentReset > 1 ? "s" : ""} resetada
                  {recurrentReset > 1 ? "s" : ""}
                </li>
              )}
              {carryOver > 0 && (
                <li>
                  {carryOver} tarefa{carryOver > 1 ? "s" : ""} pontua
                  {carryOver > 1 ? "is" : "l"} pendente
                  {carryOver > 1 ? "s" : ""} mantida{carryOver > 1 ? "s" : ""}
                </li>
              )}
              {removed > 0 && (
                <li>
                  {removed} tarefa{removed > 1 ? "s" : ""} concluída
                  {removed > 1 ? "s" : ""} removida{removed > 1 ? "s" : ""}
                </li>
              )}
            </ul>
          </div>
          <button
            onClick={onDismiss}
            className="rounded-lg p-1 text-slate-600 transition-colors hover:bg-white/5 hover:text-slate-400"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
