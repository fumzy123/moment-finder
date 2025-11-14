// Entities
import type { Video } from "../entities/Video";

// Ports / Infrastructure
import type { IVideoRepo } from "../ports/IVideoRepo"

interface GetUploadedVideosInfrastructure {
    videoRepo: IVideoRepo
}

export async function getUploadedVideos ({ infrastructure }: {infrastructure: GetUploadedVideosInfrastructure}): Promise<Video[]> {
    const { videoRepo } = infrastructure;
    const videos = await videoRepo.getVideos();
    return Promise.all(
        videos.map(async (video) => ({
            name: video.name,
            url: await videoRepo.generateSignedUrlforVideoFile(video.name)
        }))
    );
}