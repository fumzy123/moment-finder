import type { IVideoRepo } from "../ports/IVideoRepo";
import { Storage } from '@google-cloud/storage';

export class GoogleCloudStorageVideoRepo implements IVideoRepo {
    private storage: Storage;
    private uploadedVideosBucket: any;

    constructor(storage: Storage, bucketName = "video-moments-upload") {
        this.storage = storage;
        this.uploadedVideosBucket = this.storage.bucket(bucketName);
    }

    async getVidoes(): Promise<File[]> {
        const [files] = await this.uploadedVideosBucket.getFiles();
        return files;
    }

    async generateSignedUrlforVideoFile(fileName: string): Promise<string> {
        const gcsFile = this.uploadedVideosBucket.file(fileName);
        const [url] = await gcsFile.getSignedUrl({
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60 // 1 hour
        });
        return url;
    }

    async uploadVideo(selectedVideo: File): Promise<{url: string, success: boolean, message: string}> {

        console.log("Uploading file to GCS:", selectedVideo.name);

        // Convert the File to its binary representation for upload
        const arrayBuffer = await selectedVideo.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Create a file object in the bucket and then upload the binary data
        const gcsFile = this.uploadedVideosBucket.file(selectedVideo.name);
        await gcsFile.save(buffer, {
            contentType: selectedVideo.type
        })

        // Get a signed URL for accessing the uploaded file
        const [url] = await gcsFile.getSignedUrl({
            action: 'read',
            expires: Date.now() + 1000 * 60 * 60 // 1 hour
        })
        console.log(`File uploaded to GCS: ${url}`);
        return {
                success: true,
                message: `Uploaded ${selectedVideo.name} successfully`,
                url,
        };
    }

    async deleteVideo(): Promise<void> {

    }
}