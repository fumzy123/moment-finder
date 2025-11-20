
import { z } from 'astro:schema';
import { UploadedVideoDTO } from './UploadedVideoDTO';

export const GetUploadedVideoResponseSchema = z.object({
    data: UploadedVideoDTO,
    error: z.string().nullable(),
    message: z.string(),
})

export type GetUploadedVideoResponse = z.infer<typeof GetUploadedVideoResponseSchema>;