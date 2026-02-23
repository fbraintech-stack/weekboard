import type { DayOfWeek } from "@/types/task";

/**
 * Retorna a semana ISO atual no formato "2026-W10"
 */
export function getCurrentWeekYear(): string {
  return getWeekYear(new Date());
}

/**
 * Retorna a semana ISO de uma data no formato "2026-W10"
 */
export function getWeekYear(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const yearStart = new Date(d.getFullYear(), 0, 4);
  const weekNumber = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + yearStart.getDay() + 1) /
      7
  );
  return `${d.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

/**
 * Retorna o dia da semana atual (1=Seg, 7=Dom)
 */
export function getCurrentDayOfWeek(): DayOfWeek {
  const day = new Date().getDay();
  return (day === 0 ? 7 : day) as DayOfWeek;
}

/**
 * Retorna a segunda-feira da semana atual
 */
export function getMondayOfCurrentWeek(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * Retorna o intervalo de datas da semana (ex: "24 Fev - 2 Mar 2026")
 */
export function getWeekDateRange(): string {
  const monday = getMondayOfCurrentWeek();
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const startDay = monday.getDate();
  const startMonth = months[monday.getMonth()];
  const endDay = sunday.getDate();
  const endMonth = months[sunday.getMonth()];
  const year = sunday.getFullYear();

  if (monday.getMonth() === sunday.getMonth()) {
    return `${startDay}-${endDay} ${startMonth} ${year}`;
  }
  return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
}

/**
 * Retorna o week_year da semana anterior (ex: "2026-W09")
 */
export function getPreviousWeekYear(): string {
  const monday = getMondayOfCurrentWeek();
  const prevMonday = new Date(monday);
  prevMonday.setDate(monday.getDate() - 7);
  return getWeekYear(prevMonday);
}
