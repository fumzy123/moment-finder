
// Ports
import type { IVideoRepo } from "../ports/IVideoRepo"


// Interface types
interface UploadVideoInfrastructure {
    videoRepo: IVideoRepo
}

interface UploadVideoArgs {
    // Add any parameters needed for uploading videos, e.g., file data
    selectedVideo: File;
}

interface UploadVideoResponse {
    uploadedVideoUrl: string;
    success: boolean;
    message: string;
}

export async function uploadVideo ({ infrastructure, args }: {infrastructure: UploadVideoInfrastructure, args: UploadVideoArgs}): Promise<UploadVideoResponse> {

    // Extract Infrastructure and Arguments
    const { videoRepo } = infrastructure;
    const { selectedVideo } = args;

    // Upload the video using the Video Adapter
    const uploadedVideoFile = await videoRepo.uploadVideo(selectedVideo);

    // Return the upload result
    // Get a signed URL for accessing the uploaded file
        const signedVideoUrl = await videoRepo.generateSignedUrlforVideoFile(uploadedVideoFile.name);
        console.log(`File uploaded to GCS: ${signedVideoUrl}`);
        return {
            success: true,
            message: `Uploaded ${uploadedVideoFile.name} successfully`,
            uploadedVideoUrl: signedVideoUrl,
        };
}