"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { saveAuthToken } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await login({ username, password });

      saveAuthToken(response.token);

      router.push(response.user.role === "ADMIN" ? "/admin/movies" : "/");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not log in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-950 p-6"
    >
      <div>
        <label htmlFor="username" className="text-sm font-medium text-white">
          Username
        </label>
        <input
          id="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="mt-2 w-full rounded border border-zinc-700 bg-black px-3 py-2 text-white outline-none focus:border-red-500"
        />
      </div>

      <div className="mt-5">
        <label htmlFor="password" className="text-sm font-medium text-white">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded border border-zinc-700 bg-black px-3 py-2 text-white outline-none focus:border-red-500"
        />
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
