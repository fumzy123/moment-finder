import { randomUUID } from "crypto";
import type { Video, VideoScreenshot } from "../entities/Video";
import type { IVideoRepo } from "../ports/IVideoRepo";
import {
  Bucket,
  Storage,
  type GetFilesResponse,
} from "@google-cloud/storage";
import { file } from "astro/loaders";

export class GoogleCloudStorageVideoRepo implements IVideoRepo {
  private storage: Storage;
  private uploadedVideosBucket: Bucket;

  constructor(storage: Storage, bucketName = "video-moments-upload") {
    this.storage = storage;
    this.uploadedVideosBucket = this.storage.bucket(bucketName);
  }

  // Videos
  async getVideos(): Promise<Video[]> {
    // Get list of files from GCS bucket
    const [files] = await this.uploadedVideosBucket.getFiles({
      prefix: "videos/",
    });

    // Map files to Video entities with signed URLs
    const videos = await Promise.all(
      files.map(async (file) => {
        // Extract video Ids and video Name
        const videoPath = file.name;
        const videoName = videoPath.split("/").pop();
        const videoId = videoName?.split(".")[0];

        return {
          id: videoId!,
          name: videoName!,
          bucketPath: videoPath,
        };
      })
    );
    return videos;
  }

  async getVideo(videoId: Video["id"]): Promise<Video> {
    // Search by prefix
    const [files] = await this.uploadedVideosBucket.getFiles({
      prefix: `videos/${videoId}`,
    });

    if (files.length === 0) {
      throw new Error(`Video with id ${videoId} does not exist.`);
    }

    const file = files[0];
    const videoPath = file.name; // e.g. videos/123.mp4
    const videoName = videoPath.split("/").pop()!;

    return {
      id: videoId,
      name: videoName,
      bucketPath: videoPath,
    };
  }

  async uploadVideo(selectedVideo: File): Promise<Video> {
    console.log("Uploading file to GCS:", selectedVideo.name);

    // Convert the File to its binary representation for upload
    const arrayBuffer = await selectedVideo.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract file extension (e.g. "mp4", "mov")
    const originalName = selectedVideo.name;
    const ext = originalName.split(".").pop()?.toLowerCase() || "mp4";

    // Create unique video ID
    const videoId = randomUUID();

    // Storage path: videos/{videoId}.{ext}
    const videoStoragePath = `videos/${videoId}.${ext}`;

    // Create a file object in the bucket and then upload the binary data to that file object
    const gcsFile = this.uploadedVideosBucket.file(videoStoragePath);
    await gcsFile.save(buffer, {
      contentType: selectedVideo.type,
    });

    const videoPath = gcsFile.name;
    const videoName = videoPath.split("/").pop()!;

    // Convert uploaded file to Video entity
    const video = {
      id: videoId,
      name: videoName,
      bucketPath: videoPath,
    };

    return video;
  }

  async deleteVideo(): Promise<void> {}

  // Video Screenshot
  async uploadVideoScreenshot(
    videoId: string,
    screenshot: File
  ): Promise<VideoScreenshot> {
    console.log("Uploading Videoscreenshot to GCS:", screenshot.name);

    // Convert the file to its binary representation for upload
    // Browsers represent file uploads as ArrayBuffer (Web API binary format).
    // Node.js libraries (like Google Cloud Storage SDK) require Buffer, Node’s binary type
    const arrayBuffer = await screenshot.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract extension
    const originalName = screenshot.name;
    const ext = originalName.split(".").pop()?.toLowerCase() || "png";

    // Generate a unique screenshot ID
    const screenshotId = randomUUID();

    // Create Storage path: screenshots/{videoId}/{screenshots}.{ext}
    const videoScreenShotstoragePath = `screenshots/${videoId}/${screenshotId}.${ext}`;

    // Create a file object in the bucket and then write the binary buffer data to the file
    const gcsFile = this.uploadedVideosBucket.file(
      videoScreenShotstoragePath
    );
    await gcsFile.save(buffer, { contentType: screenshot.type });

    // Return the uploaded Screenshot
    const uploadedScreenshot: VideoScreenshot = {
      id: screenshotId,
      filename: `${screenshotId}.${ext}`,
      url: await this.generateSignedUrlforMediaFile(
        videoScreenShotstoragePath
      ),
      videoId,
      bucket: this.uploadedVideosBucket.name,
    };
    return uploadedScreenshot;
  }
  async getVideoScreenshot(
    videoId: Video["id"],
    screenshotId: VideoScreenshot["id"]
  ): Promise<VideoScreenshot> {
    if (!videoId || !screenshotId) {
      throw new Error("Both videoId and screenshotId are required.");
    }

    // screenshots/{videoId}/{screenshotId}.<ext>
    const prefix = `screenshots/${videoId}/${screenshotId}`;

    // Fetch the screenshot file (prefix matches screenshotId regardless of extension)
    const [files] = await this.uploadedVideosBucket.getFiles({
      prefix,
    });

    if (files.length === 0) {
      throw new Error(
        `Screenshot ${screenshotId} for video ${videoId} does not exist.`
      );
    }

    const file = files[0];

    // Extract filename (e.g. "abc123.png")
    const filename = file.name.split("/").pop()!;
    const ext = filename.split(".").pop()!;

    // Build VideoScreenshot object
    return {
      id: screenshotId,
      filename,
      url: await this.generateSignedUrlforMediaFile(file.name),
      videoId,
      bucket: this.uploadedVideosBucket.name,
    };
  }
  async getVideoScreenshots(
    videoId: string
  ): Promise<VideoScreenshot[]> {
    if (!videoId) {
      throw new Error("videoId is required to get screenshots");
    }

    // Fetch all files inside screenshots/{videoId}/
    const [files] = await this.uploadedVideosBucket.getFiles({
      prefix: `screenshots/${videoId}/`,
    });

    if (files.length === 0) {
      return []; // No screenshots yet
    }

    // Map GCS files → VideoScreenshot entity
    const screenshots = await Promise.all(
      files.map(async (file) => {
        const fileName = file.name.split("/").pop()!; // screenshot file name (e.g. abc123.png)
        const screenshotId = fileName.split(".")[0]; // "abc123"

        return {
          id: screenshotId,
          filename: fileName,
          url: await this.generateSignedUrlforMediaFile(file.name),
          videoId,
          bucket: this.uploadedVideosBucket.name,
        } as VideoScreenshot;
      })
    );

    return screenshots;
  }

  // Signed URL
  async generateSignedUrlforMediaFile(
    fileName: string
  ): Promise<string> {
    if (!fileName) {
      console.warn(
        "⚠️ No file name provided to generateSignedUrlforVideoFile"
      );
      return "";
    }
    const gcsFile = this.uploadedVideosBucket.file(fileName);
    const [url] = await gcsFile.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60, // 1 hour
    });
    return url;
  }
}
