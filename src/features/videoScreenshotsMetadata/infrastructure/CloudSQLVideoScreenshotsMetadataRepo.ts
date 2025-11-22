import type { IVideoScreenshotMetadataRepo } from "../ports/IVideoScreenshotMetadataRepo";
import type { VideoScreenShotMetadata } from "../entities/VideoScreenshotsMetadata";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgTable } from "drizzle-orm/pg-core";
import { videoScreenshotsMetadata } from "../../../db/schema";
import { eq } from "drizzle-orm";

// Define the specific type based on your imported schema object
type VideoScreenshotsMetadataTable = typeof videoScreenshotsMetadata;

export class CloudSQLVideoScreenshotMetadataRepo
  implements IVideoScreenshotMetadataRepo
{
  private db;
  private videoScreenshotTable: VideoScreenshotsMetadataTable;

  constructor(
    db: NodePgDatabase,
    videoScreenshotsTable: VideoScreenshotsMetadataTable
  ) {
    this.db = db;
    this.videoScreenshotTable = videoScreenshotsTable;
  }

  async createVideoScreenshotMetadata(
    metadata: VideoScreenShotMetadata
  ): Promise<void> {
    const baseValues = {
      screenshotId: metadata.screenshotId,
      screenshotFileName: metadata.screenshotFileName,
      screenshotWidth: metadata.screenshotWidth,
      screenshotHeight: metadata.screenshotHeight,
      screenshotBucket: metadata.screenshotBucket,

      videoId: metadata.videoId,
      timestampSeconds: metadata.timestampSeconds,
      sourceFrameWidth: metadata.sourceFrameWidth,
      sourceFrameHeight: metadata.sourceFrameHeight,

      captureFrameX: metadata.captureFrameX,
      captureFrameY: metadata.captureFrameY,
      captureFrameWidth: metadata.captureFrameWidth,
      captureFrameHeight: metadata.captureFrameHeight,
    };

    const values = metadata.createdAt
      ? { ...baseValues, createdAt: metadata.createdAt }
      : baseValues;

    await this.db.insert(this.videoScreenshotTable).values(values);
  }

  async getAllVideoScreenshotMetadata(): Promise<
    VideoScreenShotMetadata[]
  > {
    const results = await this.db
      .select()
      .from(this.videoScreenshotTable);
    return results as VideoScreenShotMetadata[];
  }

  /**
   * Get all Screenshots metadata that belong to a particular video
   * @param videoId The ID of the video whose screenshots you want to fetch.
   * @returns An array of VideoScreenShotMetadata objects (will be empty if no matches are found).
   */
  async getVideoScreenshotsMetadataByVideoId(
    videoId: string
  ): Promise<VideoScreenShotMetadata[]> {
    const results = await this.db
      .select()
      .from(this.videoScreenshotTable)
      // Use eq to filter by the videoId (the foreign key)
      .where(eq(this.videoScreenshotTable.videoId, videoId));

    // Return the array of results.
    // An empty array [] is returned naturally by Drizzle if no matches are found.
    return results as VideoScreenShotMetadata[];
  }
}
