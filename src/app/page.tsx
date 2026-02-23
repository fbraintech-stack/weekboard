"use client";

import { useAuth } from "@/hooks/use-auth";
import { AuthForm } from "@/components/auth-form";
import { WeekBoard } from "@/components/week-board";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-400">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return <WeekBoard />;
}
