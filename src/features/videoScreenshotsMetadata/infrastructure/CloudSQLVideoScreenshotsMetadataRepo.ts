import type { IVideoScreenshotMetadataRepo } from "../ports/IVideoScreenshotMetadataRepo";
import type { VideoScreenShotMetadata } from "../entities/VideoScreenshotsMetadata";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PgTable } from "drizzle-orm/pg-core";
import { videoScreenshots } from "../../../db/schema";
export class CloudSQLVideoScreenshotMetadataRepo implements IVideoScreenshotMetadataRepo {
    private db;
    private videoScreenshotTable: PgTable;

    constructor(db: NodePgDatabase, videoScreenshotsTable: PgTable  ){
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

    async getVideoScreenshotMetadata(): Promise<VideoScreenShotMetadata> {
        throw new Error("Method not implemented.");
    }
}