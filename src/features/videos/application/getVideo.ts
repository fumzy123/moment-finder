// Entities
import type { Video } from "../entities/Video";

// Ports / Infrastructure
import type { IVideoRepo } from "../ports/IVideoRepo"

interface GetVideoInfrastructure {
    videoRepo: IVideoRepo
}

interface GetVideoArgs {
    videoName: Video['name'];
}

export async function getVideo ({ infrastructure, args }: {infrastructure: GetVideoInfrastructure, args: GetVideoArgs}): Promise<Video> {
    
    // Extract the Infrastructure
    const { videoRepo } = infrastructure;

    // Extract the Arguments
    const { videoName } = args;

    // Use the Infrastructure to get the video
    const video = await videoRepo.getVideo(videoName);

    return video;
}