import type { Video } from "../entities/Video";


export abstract class IVideoRepo {
    abstract generateSignedUrlforVideoFile(fileName: string): Promise<string>;
    abstract getVidoes(): Promise<Video[]>;
    abstract uploadVideo(file: File): Promise<Video>;
}