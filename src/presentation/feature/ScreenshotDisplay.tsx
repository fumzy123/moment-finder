import { useVideoScreenshots } from "../../hooks/video/useVideoScreenshots";
import type { VideoScreenshotDTO } from "../../pages/api/videos/dtos/VideoScreenshotDTO";
import Screenshot from "../primitive/Screenshot";

export interface ScreenshotDisplayProps {
  videoId: string;
}

export default function ScreenshotDisplay({
  videoId,
}: ScreenshotDisplayProps) {
  // Hook to Extract Data
  const { data, isLoading } = useVideoScreenshots(videoId);

  console.log(
    "Feature Presentation layer: Video Screenshot Data on Screenshot Display",
    data
  );

  const allVideoScreenshotsInVideo: VideoScreenshotDTO[] = data ?? [];
  // console.log("Video Screenshot Data on Screenshot Display", allVideoScreenshotsInVideo)

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!allVideoScreenshotsInVideo.length) {
    return <p>No Data was gotten</p>;
  }

  // Render
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {allVideoScreenshotsInVideo.map((videoScreenshot) => (
        <Screenshot
          key={videoScreenshot.id}
          videoScreenshotData={videoScreenshot}
        />
      ))}
    </div>
  );
}
