// Entities
import type { Video } from "../entities/Video";

// Ports / Infrastructure
import type { IVideoRepo } from "../ports/IVideoRepo"

export interface GetUploadedVideosInfrastructure {
    videoRepo: IVideoRepo
}

export interface UploadedVideo {
    id: string;                // from domain entity
    name: string;              // from domain entity
    bucketPath: string;        // from domain entity / repo
    displayName?: string;       // extra info from domain or repo
    url: string;               // computed in application layer
}

export async function getUploadedVideos ({ infrastructure }: {infrastructure: GetUploadedVideosInfrastructure}): Promise<UploadedVideo[]> {
    const { videoRepo } = infrastructure;
    const videos = await videoRepo.getVideos();
    console.log("Vidoes in Bucket")
    console.log(videos)
    console.log("=========================")


    return Promise.all(
        videos.map(async (video) => {
            const url = await videoRepo.generateSignedUrlforMediaFile(video.bucketPath)

            return {
                id: video.id,
                name: video.name,
                bucketPath: video.bucketPath,
                displayName: video.displayName,
                url
            }
            
        })
    );
}