import type { Video, VideoScreenshot } from "../entities/Video";


export abstract class IVideoRepo {
    abstract getVideos(): Promise<Video[]>;
    abstract getVideo(videoId: Video['id']): Promise<Video>
    abstract uploadVideo(videoFile: File): Promise<Video>;
    abstract uploadVideoScreenshot(videoId: Video['id'] ,screenshot: File): Promise<VideoScreenshot>;
    abstract getVideoScreenshots(videoId: Video['id']): Promise<VideoScreenshot[]>;
    abstract getVideoScreenshot(videoId: Video['id'], screenshot: VideoScreenshot['id']): Promise<VideoScreenshot>;
    abstract generateSignedUrlforMediaFile(videoName: Video['id'] | VideoScreenshot['id']): Promise<string>;
}