"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export function AuthForm() {
  const { signUp, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const result = isLogin
      ? await signIn(email, password)
      : await signUp(email, password);

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else if (!isLogin) {
      setSuccess("Conta criada! Verifique seu email para confirmar.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm glass rounded-3xl p-8">
        <h1 className="mb-1 text-2xl font-bold text-white">
          Week<span className="text-[var(--accent)]">Board</span>
        </h1>
        <p className="mb-8 text-sm text-slate-500">
          {isLogin ? "Entre na sua conta" : "Crie sua conta"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-colors focus:border-[var(--accent)]/40 focus:bg-white/[0.07]"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition-colors focus:border-[var(--accent)]/40 focus:bg-white/[0.07]"
          />

          {error && (
            <p className="rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs text-emerald-300">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-xl bg-[var(--accent)] py-3 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "..." : isLogin ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
            setSuccess("");
          }}
          className="mt-6 w-full text-center text-xs text-slate-600 transition-colors hover:text-[var(--accent)]"
        >
          {isLogin ? "Não tem conta? Crie uma" : "Já tem conta? Entre"}
        </button>
      </div>
    </div>
  );
}
