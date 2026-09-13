"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { MovieFormFields } from "@/components/MovieFormFields";
import { createMovie } from "@/lib/api";
import { getMovieInputFromFormData } from "@/lib/movieForm";

type CreateMovieFormProps = {
  onMovieCreated?: () => void;
};

export function CreateMovieForm({ onMovieCreated }: CreateMovieFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const movieInput = getMovieInputFromFormData(formData);

    try {
      setStatus("saving");

      await createMovie(movieInput);

      form.reset();
      onMovieCreated?.();
      router.refresh();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 grid gap-4 rounded border border-gray-800 bg-zinc-950 p-6"
    >
      <MovieFormFields />

      <button
        type="submit"
        disabled={status === "saving"}
        className="mt-2 rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-gray-700"
      >
        {status === "saving" ? "Creating..." : "Create Movie"}
      </button>

      {status === "success" && (
        <p className="text-sm text-green-400">Movie created successfully.</p>
      )}

      {status === "error" && (
        <p className="text-sm text-red-400">Could not create movie.</p>
      )}
    </form>
  );
}
