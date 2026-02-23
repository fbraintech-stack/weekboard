export type TaskType = "recurrent" | "oneoff";

export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const DAY_LABELS: Record<DayOfWeek, string> = {
  1: "Seg",
  2: "Ter",
  3: "Qua",
  4: "Qui",
  5: "Sex",
  6: "Sáb",
  7: "Dom",
};

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  category_id: string;
  title: string;
  type: TaskType;
  days: DayOfWeek[];
  completed: boolean;
  week_year: string;
  carry_over: boolean;
  created_at: string;
  updated_at: string;
}
