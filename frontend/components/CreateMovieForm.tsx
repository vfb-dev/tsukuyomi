"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createMovie } from "../lib/api";

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
      <div className="grid gap-2">
        <label htmlFor="title" className="text-sm font-medium text-gray-300">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="rounded border border-gray-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
        />
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="description"
          className="text-sm font-medium text-gray-300"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          className="rounded border border-gray-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <label
            htmlFor="releaseYear"
            className="text-sm font-medium text-gray-300"
          >
            Release Year
          </label>
          <input
            id="releaseYear"
            name="releaseYear"
            type="number"
            min={1888}
            required
            className="rounded border border-gray-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
          />
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="durationMinutes"
            className="text-sm font-medium text-gray-300"
          >
            Duration Minutes
          </label>
          <input
            id="durationMinutes"
            name="durationMinutes"
            type="number"
            min={1}
            required
            className="rounded border border-gray-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
          />
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="category"
            className="text-sm font-medium text-gray-300"
          >
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            required
            className="rounded border border-gray-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label
          htmlFor="posterUrl"
          className="text-sm font-medium text-gray-300"
        >
          Poster URL
        </label>
        <input
          id="posterUrl"
          name="posterUrl"
          type="url"
          required
          className="rounded border border-gray-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="videoUrl" className="text-sm font-medium text-gray-300">
          Video URL
        </label>
        <input
          id="videoUrl"
          name="videoUrl"
          type="url"
          required
          className="rounded border border-gray-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
        />
      </div>

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
