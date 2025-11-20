import type { APIRoute } from "astro";

// Dependency Injection Resolvers
import { resolvers } from "../../../../dependency-injection/resolvers";

// Application layer
import { saveVideoScreenShot } from "../../../../features/videos/application/saveVideoScreenShot";
import { getAllVideoScreenshots } from "../../../../features/videos/application/getAllVideoScreenshots";
import type { GetAllVideoScreenshotsResponse } from "../dtos/GetAllVideoScreenshotsResponse";

export const GET: APIRoute = async ({ params }) => {
  const { videoId } = params;

  if (!videoId) {
    throw Error(
      "Cannot Get the screenshots of a video with no Video Id"
    );
  }

  // Get the Dependencies from the Dependency Injection Container
  // These are the repo necessary to get data to the page
  const videoRepo = resolvers.videoRepoResolver();
  const videoScreenshotMetadataRepo =
    resolvers.videoScreenshotMetadataRepoResolver();

  // Get the video screenshot
  const videoScreenShotData = await getAllVideoScreenshots({
    infrastructure: { videoRepo, videoScreenshotMetadataRepo },
    args: { videoId },
  });

  console.log(
    "API Layer: getAllVideoScreenshots: ",
    videoScreenShotData
  );

  // Get all the video screenshot
  const body: GetAllVideoScreenshotsResponse = {
    data: videoScreenShotData,
    error: null,
    message:
      "Successfully retrieved screenshot data from Application layer",
  };
  return new Response(JSON.stringify(body));
};

export const POST: APIRoute = async ({ params, request }) => {
  // Get FormData
  const formData = await request.formData();

  // 2️⃣ Convert FormData to JS object
  const formDataObject: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    formDataObject[key] = value;
  }
  console.log("This is form data");
  console.log(formDataObject);

  // 3️⃣ Normalize numeric fields
  const videoScreenShotData = {
    screenshotWidth: Number(formDataObject.outputWidth),
    screenshotHeight: Number(formDataObject.outputHeight),

    videoId: formDataObject.videoId,
    timestampSeconds: Number(formDataObject.timestampSeconds),
    sourceFrameWidth: Number(formDataObject.sourceFrameWidth),
    sourceFrameHeight: Number(formDataObject.sourceFrameHeight),

    captureFrameX: Number(formDataObject.selectionBoxCordX),
    captureFrameY: Number(formDataObject.selectionBoxCordY),
    captureFrameWidth: Number(formDataObject.selectionBoxWidth),
    captureFrameHeight: Number(formDataObject.selectionBoxHeight),

    // Keep Blob/File as-is
    imageBlob: formDataObject.imageBlob,
  };
  console.log("This is screenshot data below");
  console.log(videoScreenShotData);

  // todo : Server side form validation needed with zod

  // Get the Dependecnies from the Dependency Injection Container
  const videoRepo = resolvers.videoRepoResolver();
  const videoScreenshotMetadataRepo =
    resolvers.videoScreenshotMetadataRepoResolver();

  // Call the Application layer use case code to actually save the screenshot to the database
  const data = await saveVideoScreenShot({
    infrastructure: {
      videoRepo,
      videoScreenshotMetadataRepo,
    },
    args: videoScreenShotData,
  });

  return new Response(
    JSON.stringify({
      data,
      error: null,
      message: `Video successfully fetched`,
    })
  );
};
