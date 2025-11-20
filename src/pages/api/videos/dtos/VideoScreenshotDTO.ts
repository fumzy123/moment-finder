import { z } from "astro:schema";

export const VideoScreenshotDTO = z.object({
  id: z.string().uuid(),
  filename: z.string(),
  url: z.string().url(),
  videoId: z.string(),
  bucket: z.string(),
});
export type VideoScreenshotDTO = z.infer<typeof VideoScreenshotDTO>;
