"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-heading text-3xl font-semibold uppercase tracking-wide text-center mb-1">
          Yönetim Paneli
        </h1>
        <p className="text-muted text-sm text-center mb-8">Devam etmek için giriş yapın</p>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm text-muted mb-1.5">
              Kullanıcı adı
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full rounded-lg border border-surface-border bg-surface px-3.5 py-2.5 text-foreground outline-none focus:border-accent"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-muted mb-1.5">
              Şifre
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-surface-border bg-surface px-3.5 py-2.5 text-foreground outline-none focus:border-accent"
            />
          </div>

          {state.error && (
            <p className="text-sm text-accent" role="alert">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-accent py-2.5 font-medium text-white transition hover:bg-red-500 disabled:opacity-60"
          >
            {pending ? "Giriş yapılıyor…" : "Giriş yap"}
          </button>
        </form>
      </div>
    </main>
  );
}
