// Astro utility
import type { APIRoute } from "astro";

// Dependency Injection Resolvers
import { resolvers } from "../../dependency-injection/resolvers";

// Application layer
import { listVideos } from "../../features/videos/application/listVideos";
import { uploadVideo } from "../../features/videos/application/uploadVideo";

// Get the Videos to be listed on the page
export const GET: APIRoute = async ({ params, request }) => {

    // Get the Dependencies from the Dependency Injection Container
    const videoRepo = resolvers.videoRepoResolver();

    // Get all the videos from the storage bucket using the application layer
    const videos = await listVideos({infrastructure: { videoRepo } });


    return new Response(
        JSON.stringify({
            message: "Successfully fetched videos!",
            videos: videos,
        }),
    );
};

export const POST: APIRoute = async ({ request }) => {

    // Parse incoming form Data
    const formData = await request.formData();
    const selectedVideo = formData.get("selectedVideo") as File;

    // Get the Dependencies from the dependency Injection Container
    const videoRepo = resolvers.videoRepoResolver();

    // Upload the video using the application layer
    const uploadResult = await uploadVideo({ infrastructure: { videoRepo }, args: { selectedVideo } });

    // Respone back to client
    return new Response(
        JSON.stringify({
            message: "Successfully uploaded the video!",
            uploadResult: uploadResult,
        }),
    );
};

export const DELETE: APIRoute = ({ request }) => {
  return new Response(
    JSON.stringify({
      message: "This was a DELETE!",
    }),
  );
};

export const ALL: APIRoute = ({ request }) => {
  return new Response(
    JSON.stringify({
      message: `This was a ${request.method}!`,
    }),
  );
};