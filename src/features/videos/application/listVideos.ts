// Entities
import type { Video } from "../entities/Video";

// Ports / Infrastructure
import type { IVideoRepo } from "../ports/IVideoRepo"

interface ListVideosInfrastructure {
    videoRepo: IVideoRepo
}

export async function listVideos ({ infrastructure }: {infrastructure: ListVideosInfrastructure}): Promise<Video[]> {
    const { videoRepo } = infrastructure;
    const videos = await videoRepo.getVidoes();
    return Promise.all(
        videos.map(async (video) => ({
            name: video.name,
            url: await videoRepo.generateSignedUrlforVideoFile(video.name)
        }))
    );
}