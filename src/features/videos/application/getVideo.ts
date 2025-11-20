// Entities
import type { Video } from "../entities/Video";

// Ports / Infrastructure
import type { IVideoRepo } from "../ports/IVideoRepo";

interface GetVideoInfrastructure {
  videoRepo: IVideoRepo;
}

interface GetVideoArgs {
  videoId: Video["id"];
}

/**
 * Application layer result type for GetVideo use case.
 * This type combines domain entities with use case-specific computed fields.
 */
export interface GetVideoResult {
  id: string;
  name: string;
  bucketPath: string;
  displayName?: string;
  url: string; // computed in application layer
}

export async function getVideo({
  infrastructure,
  args,
}: {
  infrastructure: GetVideoInfrastructure;
  args: GetVideoArgs;
}): Promise<GetVideoResult> {
  // Extract the Infrastructure
  const { videoRepo } = infrastructure;

  // Extract the Arguments
  const { videoId } = args;

  console.log("Getting video with name: ", videoId);
  // Use the Infrastructure to get the video
  const video = await videoRepo.getVideo(videoId);
  const url = await videoRepo.generateSignedUrlforMediaFile(
    video.bucketPath
  );
  const result: GetVideoResult = {
    id: video.id,
    name: video.name,
    bucketPath: video.bucketPath,
    displayName: video.displayName,
    url,
  };
  return result;
}
