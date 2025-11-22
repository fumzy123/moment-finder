import type { APIRoute } from "astro";

// Dependency Injection Resolvers
import { resolvers } from "../../../../dependency-injection/resolvers";

// Application layer
import { getVideo } from "../../../../features/videos/application/getVideo";
import type { GetUploadedVideoResponse } from "../dtos/GetUploadedVideoResponse";

export const GET : APIRoute = async ({ params } ) => {
    console.log('API params:', params);
    const { videoId } = params;

    // Get the Dependecnies from the Dependency Injection Container
    const videoRepo = resolvers.videoRepoResolver();
    

    console.log("At Endpoint: Getting video with name: ", videoId)

    // Call the Application layer to get the video
    const video = await getVideo({
        infrastructure: {
            videoRepo
        },
        args: {
            videoId: videoId!,
        }
    });

    const body: GetUploadedVideoResponse = {
        data: video,
        error: null,
        message: `Video successfully fetched ${videoId}`
    }
    
    console.log("Found Video", video)
    return new Response(JSON.stringify(body));
}