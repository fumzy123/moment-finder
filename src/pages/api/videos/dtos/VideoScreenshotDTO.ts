import { z } from "zod";

export const VideoScreenshotDTO = z.object({
  // 1. Core Identifiers and Time
  screenshotId: z.string().uuid(), // Assuming IDs are UUIDs, use z.string() if they are not
  videoId: z.string().uuid(),
  timestampSeconds: z.number().nonnegative(),
  createdAt: z.string().datetime(), // Validates it is a valid ISO date string

  // 2. Capture Frame Details (Nested Object)
  captureFrame: z.object({
    x: z.number(),
    y: z.number(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),

  // 3. Storage Details (Nested Object)
  storage: z.object({
    bucket: z.string().min(1),
    objectName: z.string().min(1),
    publicUrl: z.string().url(),
  }),
});

// Example of the inferred TypeScript type from the schema:
export type VideoScreenshotDTO = z.infer<typeof VideoScreenshotDTO>;
