import { useState, type FormEvent } from "react";

interface LoginFormProps {
  onLogin: (user: string, password: string) => Promise<void>;
  disabled: boolean;
}

export default function LoginForm({ onLogin, disabled }: LoginFormProps) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void onLogin(user, password);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-xl bg-white p-4 shadow-sm">
      <label className="flex flex-col text-sm">
        Usuario
        <input
          className="mt-1 rounded-md border border-slate-300 px-3 py-2"
          value={user}
          onChange={(event) => setUser(event.target.value)}
          autoComplete="username"
          required
        />
      </label>
      <label className="flex flex-col text-sm">
        Clave
        <input
          type="password"
          className="mt-1 rounded-md border border-slate-300 px-3 py-2"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />
      </label>
      <button
        type="submit"
        disabled={disabled}
        className="rounded-md bg-blue-700 px-4 py-2 text-white disabled:opacity-50"
      >
        Iniciar sesión
      </button>
    </form>
  );
}
