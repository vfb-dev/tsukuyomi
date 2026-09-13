"use client";

import Image from "next/image";
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
    <Image
      src={imageSrc}
      alt={alt}
      width={500}
      height={750}
      sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
      unoptimized
      onError={() => setImageSrc(PLACEHOLDER_POSTER)}
      className={className}
    />
  );
}
