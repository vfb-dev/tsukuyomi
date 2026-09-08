"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteMovie } from "../lib/api";

type DeleteMovieButtonProps = {
  movieId: number;
};

export function DeleteMovieButton({ movieId }: DeleteMovieButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this movie?");

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteMovie(movieId);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="rounded border border-red-900 px-3 py-1 text-sm text-red-400 hover:border-red-600 hover:text-red-300 disabled:cursor-not-allowed disabled:border-gray-800 disabled:text-gray-500"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
