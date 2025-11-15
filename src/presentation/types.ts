// Schemas
import { VideoSchema } from '../features/videos/entities/Video';
import { z } from 'astro:schema';



export const VideoAnnotationCanvasSchema = z.object({
    selectedVideo:  VideoSchema.extend({
        width: z.number(),
        height: z.number(),
        controls: z.boolean()
    })
})
export type VideoAnnotationCanvasProps = z.infer<typeof VideoAnnotationCanvasSchema>;
