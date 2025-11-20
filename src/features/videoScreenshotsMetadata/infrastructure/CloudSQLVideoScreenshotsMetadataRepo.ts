import type { IVideoScreenshotMetadataRepo } from "../ports/IVideoScreenshotMetadataRepo";
import type { VideoScreenShotMetadata } from "../entities/VideoScreenshotsMetadata";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgTable } from "drizzle-orm/pg-core";
import { videoScreenshotsMetadata } from "../../../db/schema";
import { eq } from "drizzle-orm";

// Define the specific type based on your imported schema object
type VideoScreenshotsMetadataTable = typeof videoScreenshotsMetadata;

export class CloudSQLVideoScreenshotMetadataRepo implements IVideoScreenshotMetadataRepo {
    private db;
    private videoScreenshotTable: VideoScreenshotsMetadataTable;

    constructor(db: NodePgDatabase, videoScreenshotsTable: VideoScreenshotsMetadataTable  ){
        this.db = db;
        this.videoScreenshotTable = videoScreenshotsTable;
    }

    async createVideoScreenshotMetadata(metadata: VideoScreenShotMetadata): Promise<void> {
        await this.db.insert(this.videoScreenshotTable).values({

            screenshotId: metadata.screenshotId,
            screenshotFileName: metadata.screenshotFileName,
            screenshotWidth: metadata.screenshotWidth,
            screenshotHeight: metadata.screenshotHeight,
            createdAt: metadata.createdAt,
            screenshotBucket: metadata.screenshotBucket,


            videoId: metadata.videoId,
            timestampSeconds: metadata.timestampSeconds,
            sourceFrameWidth: metadata.sourceFrameWidth,
            sourceFrameHeight: metadata.sourceFrameHeight,

            captureFrameX: metadata.captureFrameX,
            captureFrameY: metadata.captureFrameY,
            captureFrameWidth: metadata.captureFrameWidth,
            captureFrameHeight: metadata.captureFrameHeight,

        });
    }

    async getAllVideoScreenshotMetadata(): Promise<VideoScreenShotMetadata[]> {
        const results = await this.db.select().from(this.videoScreenshotTable);
        return results as VideoScreenShotMetadata[];
    }

    /**
     * Fetches a single video screenshot metadata record by its ID.
     * @param screenshotId The unique ID of the screenshot.
     * @returns The VideoScreenShotMetadata object or null if not found.
     */
    async getVideoScreenshotMetadataById(screenshotId: string ): Promise<VideoScreenShotMetadata | null> {
        
        const result = await this.db
            .select()
            .from(this.videoScreenshotTable)
            // Use eq to filter by the primary key
            .where(eq(this.videoScreenshotTable.screenshotId, screenshotId))
            .limit(1);

        // Return the first item found, or null if the array is empty
        return (result[0] as VideoScreenShotMetadata) || null;
    }
}