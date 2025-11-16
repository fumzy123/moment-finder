import type { APIRoute } from "astro";

// Dependency Injection Resolvers
import { resolvers } from "../../../../dependency-injection/resolvers";

// Application layer
import { getVideo } from "../../../../features/videos/application/getVideo";

export const GET : APIRoute = async ({ params } ) => {
    console.log('API params:', params);
    const { videoName } = params;

    // Get the Dependecnies from the Dependency Injection Container
    const videoRepo = resolvers.videoRepoResolver();
    
    // Call the Application layer to get the video
    const video = await getVideo({
        infrastructure: {
            videoRepo
        },
        args: {
            videoName: videoName!,
        }
    });
    console.log("Found Video", video)
    return new Response(JSON.stringify({ data: video, error: null, message: `Video successfully fetched ${videoName}` }));
}