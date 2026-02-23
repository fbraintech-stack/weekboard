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
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{
          background: "var(--th-surface-raised)",
          border: "1px solid var(--th-border)",
          boxShadow: "var(--th-shadow-elevated)",
        }}
      >
        <h1 className="mb-1 text-2xl font-bold" style={{ color: "var(--th-text)" }}>
          Week<span style={{ color: "var(--th-accent)" }}>Board</span>
        </h1>
        <p className="mb-8 text-sm" style={{ color: "var(--th-text-faint)" }}>
          {isLogin ? "Entre na sua conta" : "Crie sua conta"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-[10px] px-4 py-3 text-sm outline-none transition-colors"
            style={{
              background: "var(--th-input-bg)",
              border: "1px solid var(--th-border-input)",
              color: "var(--th-text)",
            }}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="rounded-[10px] px-4 py-3 text-sm outline-none transition-colors"
            style={{
              background: "var(--th-input-bg)",
              border: "1px solid var(--th-border-input)",
              color: "var(--th-text)",
            }}
          />

          {error && (
            <p
              className="rounded-xl px-3 py-2 text-xs"
              style={{
                background: "var(--th-error-bg)",
                border: "1px solid var(--th-error-border)",
                color: "var(--th-error-text)",
              }}
            >
              {error}
            </p>
          )}
          {success && (
            <p
              className="rounded-xl px-3 py-2 text-xs"
              style={{
                background: "var(--th-success-bg)",
                border: "1px solid var(--th-success-border)",
                color: "var(--th-success-text)",
              }}
            >
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-[10px] py-3 text-sm font-semibold transition-all hover:brightness-105 disabled:opacity-50"
            style={{ background: "var(--th-accent)", color: "#ffffff" }}
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
          className="mt-6 w-full text-center text-xs transition-colors"
          style={{ color: "var(--th-text-muted)" }}
        >
          {isLogin ? "Não tem conta? Crie uma" : "Já tem conta? Entre"}
        </button>
      </div>
    </div>
  );
}
