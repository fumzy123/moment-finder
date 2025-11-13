import type { Video } from "../entities/Video";
import type { IVideoRepo } from "../ports/IVideoRepo";
import { Bucket, Storage, type GetFilesResponse } from '@google-cloud/storage';

export class GoogleCloudStorageVideoRepo implements IVideoRepo {
    private storage: Storage;
    private uploadedVideosBucket: Bucket;

    constructor(storage: Storage, bucketName = "video-moments-upload") {
        this.storage = storage;
        this.uploadedVideosBucket = this.storage.bucket(bucketName);
    }

    async getVideos(): Promise<Video[]> {
        // Get list of files from GCS bucket
        const [files] = await this.uploadedVideosBucket.getFiles();

        // Map files to Video entities with signed URLs
        const videos = await Promise.all(
            files.map(async (file) => ({
                name: file.name,
                url: await this.generateSignedUrlforVideoFile(file.name),
            }))
        );
        return videos;
    }

    async getVideo(videoName: Video['name']): Promise<Video>{
        const gcsFile = this.uploadedVideosBucket.file(videoName);
        const [exists] = await gcsFile.exists();
        if (!exists) {
            throw new Error(`Video with name ${videoName} does not exist.`);
        }
        const video: Video = {
            name: gcsFile.name,
            url: await this.generateSignedUrlforVideoFile(gcsFile.name),
        };
        return video;
    }


    async uploadVideo(selectedVideo: File): Promise<Video> {

        console.log("Uploading file to GCS:", selectedVideo.name);

        // Convert the File to its binary representation for upload
        const arrayBuffer = await selectedVideo.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Create a file object in the bucket and then upload the binary data to that file object
        const gcsFile = this.uploadedVideosBucket.file(selectedVideo.name);
        await gcsFile.save(buffer, {
            contentType: selectedVideo.type
        })

        // Convert uploaded file to Video entity
        const video = {
            name: gcsFile.name,
            url: await this.generateSignedUrlforVideoFile(gcsFile.name),
        }

        return video;
    }



    async deleteVideo(): Promise<void> {

    }

    async generateSignedUrlforVideoFile(fileName: string): Promise<string> {
        if (!fileName) {
            console.warn("⚠️ No file name provided to generateSignedUrlforVideoFile");
            return "";
        }
        const gcsFile = this.uploadedVideosBucket.file(fileName);
        const [url] = await gcsFile.getSignedUrl({
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60 // 1 hour
        });
        return url;
    }
}