

export abstract class IVideoRepo {
    abstract getVidoes(): Promise<File[]>;
    abstract generateSignedUrlforVideoFile(fileName: string): Promise<string>;
    abstract uploadVideo(file: File): Promise<{url: string, success: boolean, message: string}>;
}