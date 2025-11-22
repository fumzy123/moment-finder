
import { z } from 'astro:schema';
import { UploadedVideoDTO } from './UploadedVideoDTO';

export const GetUploadedVideosResponseSchema = z.object({
    data: z.array(UploadedVideoDTO),
    error: z.string().nullable(),
    message: z.string(),
})

export type GetUploadedVideosResponse = z.infer<typeof GetUploadedVideosResponseSchema>;