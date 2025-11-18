import type { Video } from "../entities/Video";


export abstract class IVideoRepo {
    abstract getVideos(): Promise<Video[]>;
    abstract getVideo(videoName: Video['name']): Promise<Video>
    abstract uploadVideo(videoFile: File): Promise<Video>;
    // abstract uploadVideoScreenshot(screenshot: File): Promise<Video>;
    abstract generateSignedUrlforVideoFile(videoName: Video['name']): Promise<string>;
}