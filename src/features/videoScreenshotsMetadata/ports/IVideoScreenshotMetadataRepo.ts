import type { VideoScreenShotMetadata } from "../entities/VideoScreenshotsMetadata";


export abstract class IVideoScreenshotMetadataRepo {
    abstract createVideoScreenshotMetadata(videoScreenshotMetadata: VideoScreenShotMetadata): Promise<void>;
    abstract getAllVideoScreenshotMetadata(): Promise<VideoScreenShotMetadata[]>;
    abstract getVideoScreenshotMetadataById(screenshotId: string ): Promise<VideoScreenShotMetadata | null>;
}