
/**
 * This file defines the Video related schema and types 
 * needed by the Presentation layer
 * 
 * The schema defined here is how the astro pages and client side components
 * understand video data for the purpose of UI Presentation.
 * 
 * 
 */

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


const VideoScreenShotDataSchema = z.object({
  // Video Info
  videoId: VideoSchema.shape.name,
  timestamp: z.number(),
  sourceFrameWidth: z.number(),
  sourceFrameHeight: z.number(),

  // Video Screenshot info
  imageBlob: VideoScreenShotSchema.shape.blob,
  imageSelectionBox: VideoSelectionBoxSchema,
  outputWidth: z.number(),
  outputHeight: z.number(),
})
export type VideoScreenShotData = z.infer<typeof VideoScreenShotDataSchema>;
