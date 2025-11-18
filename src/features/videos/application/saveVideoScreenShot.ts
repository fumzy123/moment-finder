import { z } from "astro:schema";
import { IVideoRepo } from "../ports/IVideoRepo";
import type { VideoScreenShotData } from "../../../presentation/types/video";

interface SaveVideoScreenshotInfrastructure { 
    videoRepo: IVideoRepo
}

// In application layer
interface SaveVideoScreenshotArgs {
  videoId: string;
  timestampSeconds: number;
  rectX: number;
  rectY: number;
  rectWidth: number;
  rectHeight: number;
  outputWidth: number;
  outputHeight: number;
  sourceFrameWidth: number;
  sourceFrameHeight: number;
  imageBlob: Blob | File; // raw file to upload
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
    // const { videoRepo } = infrastructure;

    // Extract the Arguments
    const { } = args;

    // todo : Call videoRepo Infrastructure to upload Screenshot to GCS Bucket
    // Come up with a folder structure for Videos and Screenshot in Google Cloud storage
    // const videoRepo.uploadVideo
    
    // todo : Call 
}