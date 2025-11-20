import { z } from "astro:schema";
import { IVideoRepo } from "../ports/IVideoRepo";
import { IVideoScreenshotMetadataRepo } from "../../videoScreenshotsMetadata/ports/IVideoScreenshotMetadataRepo";

interface SaveVideoScreenshotInfrastructure { 
    videoRepo: IVideoRepo;
    videoScreenshotMetadataRepo: IVideoScreenshotMetadataRepo;
}

// In application layer
interface SaveVideoScreenshotArgs {
  
  screenshotWidth: number,
  screenshotHeight: number,

  videoId: string;
  timestampSeconds: number;
  sourceFrameWidth: number;
  sourceFrameHeight: number;

  captureFrameX: number;
  captureFrameY: number;
  captureFrameWidth: number;
  captureFrameHeight: number;



  imageBlob: File; // raw file to upload
}

interface SaveVideoScreenshotResponse {
    screenshotId: string;
    videoId: string;
    timestampSeconds: number;
    rect: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    output: {
      width: number;
      height: number;
      format: string;
    };
    storage: {
      bucket: string;
      objectName: string;
      publicUrl: string;
    };
    createdAt: string; // ISO date string
}


export async function saveVideoScreenShot({infrastructure , args}: {infrastructure: SaveVideoScreenshotInfrastructure, args: SaveVideoScreenshotArgs}){
    // Extract the Infrastructure needed to save the screenshot
    const { videoRepo, videoScreenshotMetadataRepo } = infrastructure;
    const { videoId, timestampSeconds, sourceFrameWidth, sourceFrameHeight, captureFrameX, captureFrameY, captureFrameWidth, captureFrameHeight, screenshotWidth, screenshotHeight, imageBlob } = args;

    // Upload Video Screenshot to Google Cloud Storage Bucket
    const videoScreenshot = await videoRepo.uploadVideoScreenshot(videoId, imageBlob);

    // Upload Video Screenshot Metadata to Cloud SQL Postgres Database
    const videoScreenshotMetadata = await videoScreenshotMetadataRepo.createVideoScreenshotMetadata({
      screenshotId: videoScreenshot.id,
      screenshotFileName: videoScreenshot.filename,
      screenshotBucket: videoScreenshot.bucket,
      screenshotWidth,
      screenshotHeight,
      
      videoId,
      timestampSeconds,
      sourceFrameWidth,
      sourceFrameHeight,

      captureFrameX,
      captureFrameY,
      captureFrameWidth,
      captureFrameHeight,
    });
}