import QueryProvider from "../../provider/QueryProvider";
import VideoAnnotationCanvas from "../feature/VideoAnnotationCanvas";
import ScreenshotDisplay from "../feature/ScreenshotDisplay";
import type { VideoAnnotationCanvasProps } from "../types/video";

interface VideoAnnotationPageProps {
  video: VideoAnnotationCanvasProps["selectedVideo"];
}

export default function VideoAnnotationPage({
  video,
}: VideoAnnotationPageProps) {
  return (
    <QueryProvider>
      <VideoAnnotationCanvas selectedVideo={video} />
      <ScreenshotDisplay videoId={video.name} />
    </QueryProvider>
  );
}
