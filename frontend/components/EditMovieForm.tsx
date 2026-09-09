"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { MovieFormFields } from "@/components/MovieFormFields";
import { updateMovie } from "@/lib/api";
import { getMovieInputFromFormData } from "@/lib/movieForm";
import { Movie } from "@/types/movie";

type EditMovieFormProps = {
  movie: Movie;
};

type FormStatus = "idle" | "saving" | "success" | "error";

export function EditMovieForm({ movie }: EditMovieFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const updatedMovie = getMovieInputFromFormData(formData);

    try {
      setStatus("saving");

      await updateMovie(movie.id, updatedMovie);

      setStatus("success");
      router.push("/admin/movies");
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded border border-zinc-800 bg-zinc-950 p-6"
    >
      <MovieFormFields defaultValues={movie} />

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-zinc-700"
        >
          {status === "saving" ? "Saving..." : "Save changes"}
        </button>

        {status === "success" && (
          <p className="text-sm text-green-400">Movie updated.</p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-400">Could not update movie.</p>
        )}
      </div>
    </form>
  );
}
