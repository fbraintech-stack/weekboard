import { Header } from "@/components/header";
import { WeekBoard } from "@/components/week-board";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <WeekBoard />
    </div>
  );
}
