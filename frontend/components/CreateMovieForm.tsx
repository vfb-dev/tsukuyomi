"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { MovieFormFields } from "@/components/MovieFormFields";
import { createMovie } from "@/lib/api";
import { getMovieInputFromFormData } from "@/lib/movieForm";
import { queryKeys } from "@/lib/queryKeys";

type CreateMovieFormProps = {
  onMovieCreated?: () => void;
};

export function CreateMovieForm({ onMovieCreated }: CreateMovieFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );
  const createMovieMutation = useMutation({
    mutationFn: createMovie,
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: queryKeys.movies.all,
        type: "all",
      });
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const movieInput = getMovieInputFromFormData(formData);

    try {
      setStatus("saving");

      await createMovieMutation.mutateAsync(movieInput);

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
      className="mt-5 grid gap-4 rounded border border-gray-800 bg-zinc-950 p-6"
    >
      <MovieFormFields />

      <button
        type="submit"
        disabled={status === "saving"}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-gray-700"
      >
        <Plus aria-hidden="true" className="h-4 w-4" />
        {status === "saving" ? "Creating..." : "Create item"}
      </button>

      {status === "success" && (
        <p className="text-sm text-green-400">Item created successfully.</p>
      )}

      {status === "error" && (
        <p className="text-sm text-red-400">Could not create item.</p>
      )}
    </form>
  );
}
