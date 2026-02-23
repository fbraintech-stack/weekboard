"use client";

import { useEffect } from "react";
import { useWeekBoardStore } from "@/lib/store";

export function ThemeSync() {
  const theme = useWeekBoardStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return null;
}
