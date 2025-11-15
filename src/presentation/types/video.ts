import { VideoSchema } from '../../features/videos/entities/Video';
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

const VideoScreenShotSchema = z.object({
  // Ensures the property is an instance of the native JavaScript Blob object.
  blob: z.instanceof(Blob, { message: "The 'blob' property must be a Blob object." }),
  
  // Ensures the property is a standard string.
  objectURL: z.string({ 
    required_error: "The 'objectURL' property is required.",
    invalid_type_error: "The 'objectURL' property must be a string."
  })
});
export type VideoScreenShot = z.infer<typeof VideoScreenShotSchema>;