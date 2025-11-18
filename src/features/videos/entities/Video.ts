import { z } from 'astro:schema';

export const VideoSchema = z.object({
    name: z.string(),
    url: z.string(),
});
export type Video = z.infer<typeof VideoSchema>;



