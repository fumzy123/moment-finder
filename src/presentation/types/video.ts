/**
 * This file defines the Video related schema and types
 * needed by the Presentation layer
 *
 * The schema defined here is how the astro pages and client side components
 * understand video data for the purpose of UI Presentation.
 *
 *
 */

import { z } from "astro:schema";

export const VideoAnnotationCanvasSchema = z.object({
  selectedVideo: z.object({
    url: z.string(),
    id: z.string(),
    name: z.string().min(1, "Name cannot be empty"),
    bucketPath: z.string().min(1, "Bucket path cannot be empty"),
    displayName: z.string().optional(), // Marks the field as optional, matching the '?' in the original type
    width: z.number().positive("Width must be a positive number"),
    controls: z.boolean(),
  }),
});
export type VideoAnnotationCanvasProps = z.infer<
  typeof VideoAnnotationCanvasSchema
>;

export const VideoSelectionBoxSchema = z
  .object({
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
  })
  .nullable();
export type VideoSelectionBox = z.infer<
  typeof VideoSelectionBoxSchema
>;

const VideoScreenShotSchema = z.object({
  // Ensures the property is an instance of the native JavaScript Blob object.
  blob: z.instanceof(Blob, {
    message: "The 'blob' property must be a Blob object.",
  }),

  // Ensures the property is a standard string.
  objectURL: z.string({
    required_error: "The 'objectURL' property is required.",
    invalid_type_error: "The 'objectURL' property must be a string.",
  }),
});
export type VideoScreenShot = z.infer<typeof VideoScreenShotSchema>;

const VideoScreenShotDataSchema = z.object({
  // Video Info
  videoId: z.string(),
  timestamp: z.number(),
  sourceFrameWidth: z.number(),
  sourceFrameHeight: z.number(),

  // Video Screenshot info
  imageBlob: VideoScreenShotSchema.shape.blob,
  imageSelectionBox: VideoSelectionBoxSchema,
  outputWidth: z.number(),
  outputHeight: z.number(),
});
export type VideoScreenShotData = z.infer<
  typeof VideoScreenShotDataSchema
>;

// Video Screenshot View Model
const VideoScreenshotVMSchema = z.object({
  url: z.string(),
  id: z.string(),
  videoId: z.string(),
  filename: z.string(),
  bucket: z.string(),
});
export type VideoScreenshotVM = z.infer<
  typeof VideoScreenshotVMSchema
>;

// Video View Model (for video lists and cards)
const VideoVMSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  url: z.string().url(),
  displayName: z.string().optional(),
  bucketPath: z.string(),
});
export type VideoVM = z.infer<typeof VideoVMSchema>;
