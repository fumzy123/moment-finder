import type { VideoScreenshotDTO } from "../../pages/api/videos/dtos/VideoScreenshotDTO";

interface ScreenshotProps {
  videoScreenshotData: VideoScreenshotDTO;
}

export default function Screenshot({
  videoScreenshotData,
}: ScreenshotProps) {
  const { filename, url, id } = videoScreenshotData;

  return (
    <figure
      className="flex w-full items-center justify-center overflow-hidden rounded-lg bg-black/5 p-2 shadow-sm"
      style={{ aspectRatio: "16 / 9" }}
    >
      <img
        src={url}
        alt={filename || `Screenshot ${id}`}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-contain"
      />
    </figure>
  );
}
