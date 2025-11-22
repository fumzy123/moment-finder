import type { Video } from "../../videos/entities/Video";
import type { VideoScreenShotMetadata } from "../entities/VideoScreenshotsMetadata";

export abstract class IVideoScreenshotMetadataRepo {
  abstract createVideoScreenshotMetadata(
    videoScreenshotMetadata: VideoScreenShotMetadata
  ): Promise<void>;
  abstract getAllVideoScreenshotMetadata(): Promise<
    VideoScreenShotMetadata[]
  >;
  abstract getVideoScreenshotsMetadataByVideoId(
    videoId: Video["id"]
  ): Promise<VideoScreenShotMetadata[]>;
}
