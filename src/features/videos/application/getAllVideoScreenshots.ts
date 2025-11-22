import type { IVideoScreenshotMetadataRepo } from "../../videoScreenshotsMetadata/ports/IVideoScreenshotMetadataRepo";
import type { Video } from "../entities/Video";
import type { IVideoRepo } from "../ports/IVideoRepo";
import type { VideoScreenShotMetadata } from "../../videoScreenshotsMetadata/entities/VideoScreenshotsMetadata"; // 👈 Required type for metadata

export interface GetVideoScreenshotInfrastructure {
  videoRepo: IVideoRepo;
  videoScreenshotMetadataRepo: IVideoScreenshotMetadataRepo;
}

export interface GetVideoScreenshotArgs {
  videoId: Video["id"];
}

export interface GetVideoScreenshotResult {
  // 1. Screenshot
  screenshotId: string;
  createdAt: string; // ISO date string

  // Video and Time
  videoId: string;
  timestampSeconds: number;

  // 2. Capture Frame Details (Nested Object)
  captureFrame: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  // 3. Storage Details (Nested Object)
  storage: {
    bucket: string;
    objectName: string; // Renamed from fileName
    publicUrl: string;
  };
}

export async function getAllVideoScreenshots({
  infrastructure,
  args,
}: {
  infrastructure: GetVideoScreenshotInfrastructure;
  args: GetVideoScreenshotArgs;
}): Promise<GetVideoScreenshotResult[]> {
  // 👈 Best return object: Array of results
  const { videoRepo, videoScreenshotMetadataRepo } = infrastructure;
  const { videoId } = args;

  // 1. Fetch both datasets in parallel (or sequentially, as shown)
  // Assume videoRepo.getVideoScreenshots returns UploadedScreenshotData[]
  const videoScreenshots = await videoRepo.getVideoScreenshots(
    videoId
  );
  console.log("Screenshots Found", videoScreenshots);

  // Assume videoScreenshotMetadataRepo.getVideoScreenshotsMetadataByVideoId returns VideoScreenShotMetadata[]
  const videoScreenshotMetadata =
    await videoScreenshotMetadataRepo.getVideoScreenshotsMetadataByVideoId(
      videoId
    );

  // 2. Create a Map for fast metadata lookup
  const metadataMap = new Map<string, VideoScreenShotMetadata>();
  for (const metadata of videoScreenshotMetadata) {
    metadataMap.set(metadata.screenshotId, metadata);
  }

  // 3. Combine the data and map to the final result structure
  const results: GetVideoScreenshotResult[] = videoScreenshots
    .map((screenshot) => {
      const metadata = metadataMap.get(screenshot.id);

      // Skip any screenshot file that doesn't have corresponding metadata
      if (!metadata) {
        return null;
      }

      // Map and combine the data into the final DTO structure
      return {
        // 1. Screenshot
        screenshotId: screenshot.id,
        // The database entity has a Date object, convert to string here
        createdAt: metadata.createdAt!.toISOString(),

        // Video and Time
        videoId: screenshot.videoId,
        timestampSeconds: metadata.timestampSeconds,

        // 2. Capture Frame Details (Nested Object)
        captureFrame: {
          x: metadata.captureFrameX,
          y: metadata.captureFrameY,
          width: metadata.captureFrameWidth,
          height: metadata.captureFrameHeight,
        },

        // 3. Storage Details (Nested Object)
        storage: {
          bucket: screenshot.bucket,
          objectName: screenshot.filename, // Using filename for objectName
          publicUrl: screenshot.url,
        },
      } as GetVideoScreenshotResult;
    })
    .filter(
      (item): item is GetVideoScreenshotResult => item !== null
    ); // Filter out any skipped items

  return results;
}
