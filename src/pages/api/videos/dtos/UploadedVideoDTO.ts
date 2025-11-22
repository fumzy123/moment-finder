import { z } from "astro:schema";

export const UploadedVideoDTO = z.object({
    /** The unique name of the video */
    id: z.string().uuid(),

    /** The name of the the video file with its extension */
    name: z.string(),

    /** The optional name to enter when naming the file */
    displayName: z.string().optional(),

    /** The location in the Bucket */
    bucketPath: z.string(),

    /** The URL path to show the video */
    url: z.string()
})