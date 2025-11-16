import type { APIRoute } from "astro";

// Dependency Injection Resolvers
import { resolvers } from "../../../../dependency-injection/resolvers";

// Application layer

export const POST : APIRoute = async ({ params, request } ) => {

    // Get FormData 
    const formData = await request.formData();
    const videoName = formData.get("videoName");
    const screenshot = formData.get("screenshot");

    // todo : Server side form validation needed with zod

    // Get the Dependecnies from the Dependency Injection Container
    const videoRepo = resolvers.videoRepoResolver();
    
    // Call the Application layer to get the video
    console.log(videoName, screenshot)  
    return new Response(JSON.stringify({ data: {
        videoName,
        screenshot
    }, error: null, message: `Video successfully fetched ${videoName}` }));
}