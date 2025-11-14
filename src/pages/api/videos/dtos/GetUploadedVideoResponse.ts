
import { z } from 'astro:schema';
import { VideoSchema } from '../../../../features/videos/entities/Video';

export const GetUploadedVideoResponseSchema = z.object({
    data: z.array(VideoSchema),
    error: z.string().nullable(),
    message: z.string(),
})

export type GetUploadedVideoResponse = z.infer<typeof GetUploadedVideoResponseSchema>;