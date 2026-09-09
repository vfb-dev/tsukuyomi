"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Movie } from "@/types/movie";
import { updateMovie } from "@/lib/api";

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

    const updatedMovie = {
      title: String(formData.get("title")),
      description: String(formData.get("description")),
      releaseYear: Number(formData.get("releaseYear")),
      durationMinutes: Number(formData.get("durationMinutes")),
      posterUrl: String(formData.get("posterUrl")),
      videoUrl: String(formData.get("videoUrl")),
      category: String(formData.get("category")),
    };

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
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-zinc-200"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={movie.title}
          className="mt-2 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-red-500"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-zinc-200"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          required
          defaultValue={movie.description}
          rows={4}
          className="mt-2 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-red-500"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="releaseYear"
            className="block text-sm font-medium text-zinc-200"
          >
            Release year
          </label>
          <input
            id="releaseYear"
            name="releaseYear"
            type="number"
            required
            min={1888}
            defaultValue={movie.releaseYear}
            className="mt-2 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label
            htmlFor="durationMinutes"
            className="block text-sm font-medium text-zinc-200"
          >
            Duration minutes
          </label>
          <input
            id="durationMinutes"
            name="durationMinutes"
            type="number"
            required
            min={1}
            defaultValue={movie.durationMinutes}
            className="mt-2 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-red-500"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-zinc-200"
        >
          Category
        </label>
        <input
          id="category"
          name="category"
          type="text"
          required
          defaultValue={movie.category}
          className="mt-2 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-red-500"
        />
      </div>

      <div>
        <label
          htmlFor="posterUrl"
          className="block text-sm font-medium text-zinc-200"
        >
          Poster URL
        </label>
        <input
          id="posterUrl"
          name="posterUrl"
          type="url"
          required
          defaultValue={movie.posterUrl}
          className="mt-2 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-red-500"
        />
      </div>

      <div>
        <label
          htmlFor="videoUrl"
          className="block text-sm font-medium text-zinc-200"
        >
          Video URL
        </label>
        <input
          id="videoUrl"
          name="videoUrl"
          type="url"
          required
          defaultValue={movie.videoUrl}
          className="mt-2 w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none focus:border-red-500"
        />
      </div>

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
