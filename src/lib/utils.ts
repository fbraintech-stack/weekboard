/**
 * Retorna a semana/ano atual no formato "2026-W10"
 */
export function getCurrentWeekYear(): string {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor(
    (now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)
  );
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
}

/**
 * Retorna o dia da semana atual (1=Seg, 7=Dom)
 */
export function getCurrentDayOfWeek(): number {
  const day = new Date().getDay();
  return day === 0 ? 7 : day;
}
