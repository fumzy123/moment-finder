// Entities
import type { Video } from "../entities/Video";

// Ports / Infrastructure
import type { IVideoRepo } from "../ports/IVideoRepo"

interface GetVideoInfrastructure {
    videoRepo: IVideoRepo
}

interface GetVideoArgs {
    videoId: Video['id'];
}



export async function getVideo ({ infrastructure, args }: {infrastructure: GetVideoInfrastructure, args: GetVideoArgs}) {
    
    // Extract the Infrastructure
    const { videoRepo } = infrastructure;

    // Extract the Arguments
    const { videoId } = args;

    console.log("Getting video with name: ", videoId)
    // Use the Infrastructure to get the video
    const video = await videoRepo.getVideo(videoId);
    const url = await videoRepo.generateSignedUrlforMediaFile(video.bucketPath);
    const uploadedVideo = {
        url,
        ...video,
    }
    return uploadedVideo;
}