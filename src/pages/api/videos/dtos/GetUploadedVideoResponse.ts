
import { z } from 'astro:schema';

export const GetUploadedVideoResponseSchema = z.object({
    message: z.string(),
    videos: z.array(z.object({
        name: z.string(),
        url: z.string(),
    })),
})

export type GetUploadedVideoResponse = z.infer<typeof GetUploadedVideoResponseSchema>;