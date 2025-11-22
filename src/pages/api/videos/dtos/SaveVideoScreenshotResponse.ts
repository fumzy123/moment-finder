import { z } from "astro:schema";
import { VideoScreenshotDTO } from "./VideoScreenshotDTO";

export const SaveVideoScreenshotResponseSchema = z.object({
  data: VideoScreenshotDTO,
  error: z.string().nullable(),
  message: z.string(),
});
export type SaveVideoScreenshotResponse = z.infer<
  typeof SaveVideoScreenshotResponseSchema
>;
