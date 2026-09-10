"use client";

import { useState } from "react";

import { saveWatchProgress } from "@/lib/api";

type SaveStatus = "idle" | "saving" | "saved" | "error";

type VideoPlayerProps = {
  movieId: number;
  videoUrl: string;
  initialProgressSeconds: number;
};

export function VideoPlayer({
  movieId,
  videoUrl,
  initialProgressSeconds,
}: VideoPlayerProps) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  function handleLoadedMetadata(event: React.SyntheticEvent<HTMLVideoElement>) {
    if (initialProgressSeconds <= 0) {
      return;
    }

    event.currentTarget.currentTime = initialProgressSeconds;
  }

  async function handlePause(event: React.SyntheticEvent<HTMLVideoElement>) {
    const video = event.currentTarget;

    try {
      setSaveStatus("saving");

      await saveWatchProgress(movieId, {
        progressSeconds: Math.floor(video.currentTime),
        completed: video.ended,
      });

      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }

  return (
    <div className="mt-10">
      <video
        src={videoUrl}
        controls
        onLoadedMetadata={handleLoadedMetadata}
        onPause={handlePause}
        className="aspect-video w-full rounded bg-zinc-950"
      />

      <p className="mt-2 text-sm text-zinc-500">
        {saveStatus === "saving" && "Saving progress..."}
        {saveStatus === "saved" && "Progress saved."}
        {saveStatus === "error" && "Could not save progress."}
      </p>
    </div>
  );
}
