// Import Query Hooks for Data Fetching from API Endpoint
import { useVideoScreenshots } from "../../hooks/video/useVideoScreenshots";

// Import View Model Types for Presentation
import type { VideoScreenshotVM } from "../types/video";

// Primitive Component
import Screenshot from "../primitive/Screenshot";

// Props
export interface ScreenshotDisplayProps {
  videoId: string;
}

export default function ScreenshotDisplay({
  videoId,
}: ScreenshotDisplayProps) {
  // Use Tanstack Query hook to Fetch Data from API Endpoint
  const { data, isLoading } = useVideoScreenshots(videoId);

  console.log(
    "Feature Presentation layer: Video Screenshot Data on Screenshot Display",
    data
  );

  const allVideoScreenshotsInVideo: VideoScreenshotVM[] = data ?? [];

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
