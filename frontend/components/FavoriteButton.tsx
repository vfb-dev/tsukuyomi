"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toggleMovieFavorite } from "@/lib/api";

type FavoriteButtonProps = {
  movieId: number;
  initialFavorite: boolean | null;
};

export function FavoriteButton({
  movieId,
  initialFavorite,
}: FavoriteButtonProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(Boolean(initialFavorite));
  const [isSaving, setIsSaving] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleToggle() {
    try {
      setIsSaving(true);
      setHasError(false);

      const updatedMovie = await toggleMovieFavorite(movieId);

      setIsFavorite(Boolean(updatedMovie.favorite));
      router.refresh();
    } catch {
      setHasError(true);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isSaving}
        className="rounded border border-yellow-500/50 px-4 py-2 text-sm font-semibold text-yellow-300 hover:border-yellow-400 hover:text-yellow-200 disabled:cursor-not-allowed disabled:border-gray-800 disabled:text-gray-500"
      >
        {isSaving
          ? "Saving..."
          : isFavorite
            ? "Remove favorite"
            : "Add favorite"}
      </button>

      {hasError && (
        <span className="text-sm text-red-400">Could not update favorite.</span>
      )}
    </div>
  );
}
