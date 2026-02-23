"use client";

import { useWeekBoardStore } from "@/lib/store";

export function ThemeToggle() {
  const theme = useWeekBoardStore((s) => s.theme);
  const toggleTheme = useWeekBoardStore((s) => s.toggleTheme);

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => {
        document.documentElement.classList.add("theme-transition");
        toggleTheme();
        setTimeout(() => {
          document.documentElement.classList.remove("theme-transition");
        }, 500);
      }}
      className="relative flex h-7 w-[52px] items-center rounded-full p-[3px] transition-colors duration-300"
      style={{
        background: isDark
          ? "rgba(255, 255, 255, 0.12)"
          : "rgba(120, 120, 128, 0.16)",
      }}
      title={isDark ? "Tema claro (Apple)" : "Tema escuro"}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      {/* Track icons */}
      <span className="absolute left-[7px] top-1/2 -translate-y-1/2">
        <svg
          className="h-3 w-3 transition-opacity duration-300"
          style={{ opacity: isDark ? 0.5 : 0.2 }}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
            clipRule="evenodd"
            style={{ color: "var(--th-text-muted)" }}
          />
        </svg>
      </span>
      <span className="absolute right-[7px] top-1/2 -translate-y-1/2">
        <svg
          className="h-3 w-3 transition-opacity duration-300"
          style={{ opacity: isDark ? 0.2 : 0.4 }}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
            style={{ color: "var(--th-text-muted)" }}
          />
        </svg>
      </span>

      {/* Sliding thumb */}
      <span
        className="relative z-10 flex h-[21px] w-[21px] items-center justify-center rounded-full shadow-sm transition-all duration-300 ease-out"
        style={{
          transform: isDark ? "translateX(0)" : "translateX(25px)",
          background: isDark ? "#818cf8" : "#FFFFFF",
          boxShadow: isDark
            ? "0 1px 3px rgba(0, 0, 0, 0.3)"
            : "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        }}
      >
        {isDark ? (
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            style={{ color: "#ffffff" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
          </svg>
        ) : (
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            style={{ color: "#FF9500" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
