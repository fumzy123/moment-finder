import type { IVideoScreenshotMetadataRepo } from "../../videoScreenshotsMetadata/ports/IVideoScreenshotMetadataRepo";
import type { Video, VideoScreenshot } from "../entities/Video";
import type { IVideoRepo } from "../ports/IVideoRepo";

export interface GetVideoScreenshotInfrastructure {
    videoRepo: IVideoRepo,
    videoScreenshotMetadataRepo: IVideoScreenshotMetadataRepo,
}

export interface GetVideoScreenshotArgs {
    videoId: Video["id"],
    
}


export async function getAllVideoScreenshots({infrastructure, args}: { infrastructure: GetVideoScreenshotInfrastructure, args: GetVideoScreenshotArgs }) {
    const {videoRepo, videoScreenshotMetadataRepo} = infrastructure;
    const { videoId } = args;

    // Get all the Screenshots for this video
    const videoScreenshot = await videoRepo.getVideoScreenshots(videoId);
    // console.log(`Application Layer: GetAllVideoScreenshot with ${videoId}`, videoScreenshot)

    // Get all the Metadata for the screenshots
    // const videoScreenshotMetadata = await videoScreenshotMetadataRepo.getAllVideoScreenshotMetadata(videoId)

    return videoScreenshot
}