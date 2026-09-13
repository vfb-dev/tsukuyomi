"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { deleteMovie } from "../lib/api";

type DeleteMovieButtonProps = {
  movieId: number;
  onDeleted?: () => void;
};

export function DeleteMovieButton({ movieId, onDeleted }: DeleteMovieButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this movie?");

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      setHasError(false);

      await deleteMovie(movieId);

      onDeleted?.();
      router.refresh();
    } catch {
      setHasError(true);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="rounded border border-red-900 px-3 py-1 text-sm text-red-400 hover:border-red-600 hover:text-red-300 disabled:cursor-not-allowed disabled:border-gray-800 disabled:text-gray-500"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>

      {hasError && <span className="text-xs text-red-400">Failed</span>}
    </div>
  );
}
