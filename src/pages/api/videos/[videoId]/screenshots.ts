import type { APIRoute } from "astro";

// Dependency Injection Resolvers
import { resolvers } from "../../../../dependency-injection/resolvers";

// Application layer
import { saveVideoScreenShot } from "../../../../features/videos/application/saveVideoScreenShot"


export const POST : APIRoute = async ({ params, request } ) => {

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
      captureFrameY: Number(formDataObject.selectoinBoxCordY),
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
    const videoScreenshotMetadataRepo = resolvers.videoScreenshotMetadataRepoResolver();
    
    // Call the Application layer use case code to actually save the screenshot to the database
    const data = await saveVideoScreenShot({
        infrastructure: {
            videoRepo,
            videoScreenshotMetadataRepo,
        },
        args: videoScreenShotData
    })

     
    return new Response(JSON.stringify({ data, error: null, message: `Video successfully fetched` }));
}