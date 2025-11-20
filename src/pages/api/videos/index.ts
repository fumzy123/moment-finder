// Astro utility
import type { APIRoute } from "astro";

// Dependency Injection Resolvers
import { resolvers } from "../../../dependency-injection/resolvers";

// Application layer
import { getUploadedVideos } from "../../../features/videos/application/getUploadedVideos";
import { uploadVideo } from "../../../features/videos/application/uploadVideo";

// DTOs
import type { GetUploadedVideosResponse } from "./dtos/GetUploadedVideosResponse";

// Get the Videos to be listed on the page
export const GET: APIRoute = async ({}) => {
  // Get the Dependencies from the Dependency Injection Container
  const videoRepo = resolvers.videoRepoResolver();

  // Get all the videos from the storage bucket using the application layer
  const videos = await getUploadedVideos({
    infrastructure: { videoRepo },
  });

  // Wrap it in the Response pattern
  const body: GetUploadedVideosResponse = {
    data: videos,
    error: null,
    message: "Successfully uploaded the video!",
  };

  return new Response(JSON.stringify(body));
};

export const POST: APIRoute = async ({ request }) => {
  // Parse incoming form Data
  const formData = await request.formData();
  const selectedVideo = formData.get("selectedVideo") as File;

  // Get the Dependencies from the dependency Injection Container
  const videoRepo = resolvers.videoRepoResolver();

  // Upload the video using the application layer
  const result = await uploadVideo({
    infrastructure: { videoRepo },
    args: { selectedVideo },
  });

  // Response back to client
  return new Response(
    JSON.stringify({
      data: result,
      error: null,
      message: `Uploaded ${result.uploadedVideoUrl} successfully`,
    })
  );
};

export const DELETE: APIRoute = ({ request }) => {
  return new Response(
    JSON.stringify({
      message: "This was a DELETE!",
    })
  );
};

export const ALL: APIRoute = ({ request }) => {
  return new Response(
    JSON.stringify({
      message: `This was a ${request.method}!`,
    })
  );
};
