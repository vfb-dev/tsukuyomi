"use client";

import { useState } from "react";

const PLACEHOLDER_POSTER = "/media/posters/placeholder.svg";

type PosterImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function PosterImage({ src, alt, className }: PosterImageProps) {
  const [imageSrc, setImageSrc] = useState(src || PLACEHOLDER_POSTER);

  return (
    <img
      src={imageSrc}
      alt={alt}
      onError={() => setImageSrc(PLACEHOLDER_POSTER)}
      className={className}
    />
  );
}
