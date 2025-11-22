import type { VideoScreenshotDTO } from "../../pages/api/videos/dtos/VideoScreenshotDTO";

interface ScreenshotProps {
  url: string;
  name: string;
}

export default function Screenshot({ url, name }: ScreenshotProps) {
  return (
    <figure
      className="flex w-full items-center justify-center overflow-hidden rounded-lg bg-black/5 p-2 shadow-sm"
      style={{ aspectRatio: "16 / 9" }}
    >
      <img
        src={url}
        alt={name}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-contain"
      />
    </figure>
  );
}
