import { useQuery } from "@tanstack/react-query";
import type { GetAllVideoScreenshotsResponse } from "../../pages/api/videos/dtos/GetAllVideoScreenshotsResponse";
import type { VideoScreenshotDTO } from "../../pages/api/videos/dtos/VideoScreenshotDTO";

export function useVideoScreenshots(videoId: string) {
  return useQuery<VideoScreenshotDTO[]>({
    queryKey: ["screenshots", videoId],
    queryFn: async (): Promise<VideoScreenshotDTO[]> => {
      const res = await fetch(`/api/videos/${videoId}/screenshots`);
      if (!res.ok) throw new Error("Failed to fetch screenshots");
      const responseJSON: GetAllVideoScreenshotsResponse =
        await res.json();
      console.log("In the Data Fetching Layer:", responseJSON);
      return responseJSON.data ?? [];
    },
    staleTime: 1000 * 60, // data considered fresh for 1 minute
    enabled: Boolean(videoId),
  });
}
