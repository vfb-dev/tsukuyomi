"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createMovie } from "@/lib/api";
import { MovieFormFields } from "@/components/MovieFormFields";

export function CreateMovieForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const movieInput = {
      title: String(formData.get("title")),
      description: String(formData.get("description")),
      releaseYear: Number(formData.get("releaseYear")),
      durationMinutes: Number(formData.get("durationMinutes")),
      category: String(formData.get("category")),
      posterUrl: String(formData.get("posterUrl")),
      videoUrl: String(formData.get("videoUrl")),
    };

    try {
      setStatus("saving");

      await createMovie(movieInput);

      form.reset();
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
