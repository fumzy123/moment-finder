import { z } from "astro:schema";
import { VideoScreenshotDTO } from "./VideoScreenshotDTO";

export const GetAllVideoScreenshotsResponseSchema = z.object({
  data: z.array(VideoScreenshotDTO),
  error: z.string().nullable(),
  message: z.string(),
});

export type GetAllVideoScreenshotsResponse = z.infer<
  typeof GetAllVideoScreenshotsResponseSchema
>;
