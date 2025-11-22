import { z } from 'astro:schema';

export const VideoSchema = z.object({
    /** The unique name of the video */
    id: z.string().uuid(),

    /** The name of the the video file with its extension */
    name: z.string(),

    /** The optional name to enter when naming the file */
    displayName: z.string().optional(),

    /** The location in the Bucket */
    bucketPath: z.string(),
});
export type Video = z.infer<typeof VideoSchema>;


export const VideoScreenshotSchema = z.object({
    id: z.string().uuid(),
    filename: z.string(),
    url: z.string(),
    videoId: z.string(),
    bucket: z.string(),
})
export type VideoScreenshot = z.infer<typeof VideoScreenshotSchema>;