"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  createEpisode,
  deleteEpisode,
  getEpisodes,
  updateEpisode,
} from "@/lib/api";
import { getEpisodeInputFromFormData } from "@/lib/episodeForm";
import { Episode } from "@/types/episode";

type EpisodeManagerProps = {
  movieId: number;
};

type FormStatus = "idle" | "saving" | "success" | "error";

export function EpisodeManager({ movieId }: EpisodeManagerProps) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [editStatus, setEditStatus] = useState<FormStatus>("idle");
  const [editingEpisodeId, setEditingEpisodeId] = useState<number | null>(
    null,
  );
  const [deletingEpisodeId, setDeletingEpisodeId] = useState<number | null>(
    null,
  );

  async function loadEpisodes() {
    try {
      setHasLoadError(false);
      const loadedEpisodes = await getEpisodes(movieId);
      setEpisodes(loadedEpisodes);
    } catch {
      setHasLoadError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function loadInitialEpisodes() {
      try {
        const loadedEpisodes = await getEpisodes(movieId);
        setEpisodes(loadedEpisodes);
      } catch {
        setHasLoadError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialEpisodes();
  }, [movieId]);

  async function handleCreateEpisode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const episodeInput = getEpisodeInputFromFormData(formData);

    try {
      setFormStatus("saving");

      await createEpisode(movieId, episodeInput);
      await loadEpisodes();

      form.reset();
      setFormStatus("success");
    } catch {
      setFormStatus("error");
    }
  }

  async function handleUpdateEpisode(
    event: FormEvent<HTMLFormElement>,
    episodeId: number,
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const episodeInput = getEpisodeInputFromFormData(formData);

    try {
      setEditStatus("saving");

      await updateEpisode(movieId, episodeId, episodeInput);
      await loadEpisodes();

      setEditingEpisodeId(null);
      setEditStatus("success");
    } catch {
      setEditStatus("error");
    }
  }

  function handleStartEdit(episodeId: number) {
    setEditingEpisodeId(episodeId);
    setEditStatus("idle");
  }

  function handleCancelEdit() {
    setEditingEpisodeId(null);
    setEditStatus("idle");
  }

  async function handleDeleteEpisode(episodeId: number) {
    const confirmed = window.confirm("Delete this episode?");

    if (!confirmed) {
      return;
    }

    try {
      setDeletingEpisodeId(episodeId);
      await deleteEpisode(movieId, episodeId);
      await loadEpisodes();
    } finally {
      setDeletingEpisodeId(null);
    }
  }

  return (
    <section className="mt-8 rounded border border-zinc-800 bg-zinc-950 p-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Episodes</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Add individual videos for anime or series entries.
        </p>
      </div>

      <form onSubmit={handleCreateEpisode} className="mt-6 grid gap-4">
        <div className="grid gap-2">
          <label htmlFor="episode-title" className="text-sm text-zinc-300">
            Title
          </label>
          <input
            id="episode-title"
            name="title"
            type="text"
            required
            placeholder="Episode 1"
            className="rounded border border-zinc-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <label
              htmlFor="episode-number"
              className="text-sm text-zinc-300"
            >
              Episode
            </label>
            <input
              id="episode-number"
              name="episodeNumber"
              type="number"
              min={1}
              required
              defaultValue={1}
              className="rounded border border-zinc-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="season-number" className="text-sm text-zinc-300">
              Season
            </label>
            <input
              id="season-number"
              name="seasonNumber"
              type="number"
              min={1}
              required
              defaultValue={1}
              className="rounded border border-zinc-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
            />
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="episode-duration"
              className="text-sm text-zinc-300"
            >
              Duration
            </label>
            <input
              id="episode-duration"
              name="durationMinutes"
              type="number"
              min={1}
              required
              placeholder="24"
              className="rounded border border-zinc-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label htmlFor="episode-video-url" className="text-sm text-zinc-300">
            Video URL
          </label>
          <input
            id="episode-video-url"
            name="videoUrl"
            type="text"
            required
            placeholder="/media/videos/episode-1.mp4"
            className="rounded border border-zinc-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-red-600"
          />
          <p className="text-xs text-zinc-500">
            Local videos can use /media/videos/example.mp4
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={formStatus === "saving"}
            className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-zinc-700"
          >
            {formStatus === "saving" ? "Adding..." : "Add episode"}
          </button>

          {formStatus === "success" && (
            <span className="text-sm text-green-400">Episode added.</span>
          )}

          {formStatus === "error" && (
            <span className="text-sm text-red-400">
              Could not add episode.
            </span>
          )}
        </div>
      </form>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-zinc-300">
          Existing episodes
        </h3>

        {isLoading && (
          <p className="mt-3 text-sm text-zinc-500">Loading episodes...</p>
        )}

        {hasLoadError && (
          <p className="mt-3 text-sm text-red-400">
            Could not load episodes.
          </p>
        )}

        {!isLoading && !hasLoadError && episodes.length === 0 && (
          <p className="mt-3 text-sm text-zinc-500">No episodes yet.</p>
        )}

        {!isLoading && !hasLoadError && episodes.length > 0 && (
          <div className="mt-3 overflow-hidden rounded border border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-black text-zinc-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Episode</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Duration</th>
                  <th className="px-4 py-3 font-medium">Video</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800">
                {episodes.map((episode) =>
                  editingEpisodeId === episode.id ? (
                    <tr key={episode.id}>
                      <td colSpan={5} className="px-4 py-4">
                        <form
                          onSubmit={(event) =>
                            handleUpdateEpisode(event, episode.id)
                          }
                          className="grid gap-4 rounded border border-zinc-800 bg-black p-4"
                        >
                          <div className="grid gap-2">
                            <label
                              htmlFor={`edit-episode-title-${episode.id}`}
                              className="text-sm text-zinc-300"
                            >
                              Title
                            </label>
                            <input
                              id={`edit-episode-title-${episode.id}`}
                              name="title"
                              type="text"
                              required
                              defaultValue={episode.title}
                              className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-red-600"
                            />
                          </div>

                          <div className="grid gap-4 sm:grid-cols-3">
                            <div className="grid gap-2">
                              <label
                                htmlFor={`edit-episode-number-${episode.id}`}
                                className="text-sm text-zinc-300"
                              >
                                Episode
                              </label>
                              <input
                                id={`edit-episode-number-${episode.id}`}
                                name="episodeNumber"
                                type="number"
                                min={1}
                                required
                                defaultValue={episode.episodeNumber}
                                className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-red-600"
                              />
                            </div>

                            <div className="grid gap-2">
                              <label
                                htmlFor={`edit-season-number-${episode.id}`}
                                className="text-sm text-zinc-300"
                              >
                                Season
                              </label>
                              <input
                                id={`edit-season-number-${episode.id}`}
                                name="seasonNumber"
                                type="number"
                                min={1}
                                required
                                defaultValue={episode.seasonNumber}
                                className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-red-600"
                              />
                            </div>

                            <div className="grid gap-2">
                              <label
                                htmlFor={`edit-episode-duration-${episode.id}`}
                                className="text-sm text-zinc-300"
                              >
                                Duration
                              </label>
                              <input
                                id={`edit-episode-duration-${episode.id}`}
                                name="durationMinutes"
                                type="number"
                                min={1}
                                required
                                defaultValue={episode.durationMinutes}
                                className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-red-600"
                              />
                            </div>
                          </div>

                          <div className="grid gap-2">
                            <label
                              htmlFor={`edit-episode-video-url-${episode.id}`}
                              className="text-sm text-zinc-300"
                            >
                              Video URL
                            </label>
                            <input
                              id={`edit-episode-video-url-${episode.id}`}
                              name="videoUrl"
                              type="text"
                              required
                              defaultValue={episode.videoUrl}
                              className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-red-600"
                            />
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              type="submit"
                              disabled={editStatus === "saving"}
                              className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-zinc-700"
                            >
                              {editStatus === "saving"
                                ? "Saving..."
                                : "Save episode"}
                            </button>

                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="rounded border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 hover:border-zinc-500 hover:text-white"
                            >
                              Cancel
                            </button>

                            {editStatus === "error" && (
                              <span className="text-sm text-red-400">
                                Could not update episode.
                              </span>
                            )}
                          </div>
                        </form>
                      </td>
                    </tr>
                  ) : (
                    <tr key={episode.id}>
                      <td className="px-4 py-3 text-zinc-300">
                        S{episode.seasonNumber} E{episode.episodeNumber}
                      </td>
                      <td className="px-4 py-3 font-medium text-white">
                        {episode.title}
                      </td>
                      <td className="px-4 py-3 text-zinc-300">
                        {episode.durationMinutes} min
                      </td>
                      <td className="max-w-72 truncate px-4 py-3 text-zinc-400">
                        {episode.videoUrl}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(episode.id)}
                            className="rounded border border-zinc-700 px-3 py-1 text-sm text-zinc-300 hover:border-zinc-500 hover:text-white"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteEpisode(episode.id)}
                            disabled={deletingEpisodeId === episode.id}
                            className="rounded border border-red-900 px-3 py-1 text-sm text-red-400 hover:border-red-600 hover:text-red-300 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-500"
                          >
                            {deletingEpisodeId === episode.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
