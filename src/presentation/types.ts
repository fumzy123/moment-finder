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


export const VideoSelectionBoxSchema = z.object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number()
}).nullable();
export type VideoSelectionBox = z.infer<typeof VideoSelectionBoxSchema>;