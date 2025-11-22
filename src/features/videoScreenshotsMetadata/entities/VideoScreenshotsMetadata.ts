import { z } from "astro:content";

export const VideoScreenshotMetadataSchema = z.object({
    
    screenshotId: z.string().uuid(),
    screenshotFileName: z.string(),
    screenshotWidth: z.number(),
    screenshotHeight: z.number(),
    createdAt: z.coerce.date().optional(),
    screenshotBucket: z.string(),

    videoId: z.string(),
    timestampSeconds: z.number(),
    sourceFrameWidth: z.number(),
    sourceFrameHeight: z.number(),

    captureFrameX: z.number(),
    captureFrameY: z.number(),
    captureFrameWidth: z.number(),
    captureFrameHeight: z.number(),
})
export type VideoScreenShotMetadata = z.infer<typeof VideoScreenshotMetadataSchema>;