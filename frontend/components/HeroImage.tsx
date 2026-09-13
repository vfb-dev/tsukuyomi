"use client";

import Image from "next/image";
import { useState } from "react";

const PLACEHOLDER_IMAGE = "/media/posters/placeholder.svg";

type HeroImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function HeroImage({ src, alt, className }: HeroImageProps) {
  const [imageSrc, setImageSrc] = useState(src || PLACEHOLDER_IMAGE);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill
      sizes="100vw"
      unoptimized
      onError={() => setImageSrc(PLACEHOLDER_IMAGE)}
      className={className}
    />
  );
}
