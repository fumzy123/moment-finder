import type { VideoScreenShotMetadata } from "../entities/VideoScreenshotsMetadata";


export abstract class IVideoScreenshotMetadataRepo {
    abstract createVideoScreenshotMetadata(videoScreenshotMetadata: VideoScreenShotMetadata): Promise<void>;
    abstract getVideoScreenshotMetadata(): Promise<VideoScreenShotMetadata>;
}