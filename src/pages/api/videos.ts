import type { APIRoute } from "astro";
import { listVideos } from "../../features/videos/application/listVideos";
import { resolvers } from "../../dependency-injection/resolvers";

// Get the Videos to be listed on the page
export const GET: APIRoute = async ({ params, request }) => {

    // Get the Video Adapter from the Dependency Injection Container
    const videoRepo = resolvers.videoRepoResolver();

    // Get all the videos from the storage bucket using the application layer
    const videos = await listVideos({infrastructure: { videoRepo } });


    return new Response(
        JSON.stringify({
            message: "This was a GET!",
            videos: videos,
        }),
    );
};

export const POST: APIRoute = ({ request }) => {
  return new Response(
    JSON.stringify({
      message: "This was a POST!",
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