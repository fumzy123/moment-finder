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
    const screenshotData = {
      videoId: formDataObject.videoId,  
      timestampSeconds: Number(formDataObject.timestampSeconds),
      sourceFrameWidth: Number(formDataObject.sourceFrameWidth),
      sourceFrameHeight: Number(formDataObject.sourceFrameHeight),

      rectX: Number(formDataObject.selectionBoxCordX),
      rectY: Number(formDataObject.selectoinBoxCordY),
      rectWidth: Number(formDataObject.selectionBoxWidth),
      rectHeight: Number(formDataObject.selectionBoxHeight),

      // Keep Blob/File as-is
      imageBlob: formDataObject.imageBlob,
      outputWidth: Number(formDataObject.outputWidth),
      outputHeight: Number(formDataObject.outputHeight),

    };
    console.log("This is screenshot data below");
    console.log(screenshotData);


    // todo : Server side form validation needed with zod

    // Get the Dependecnies from the Dependency Injection Container
    const videoRepo = resolvers.videoRepoResolver();
    
    // Call the Application layer use case code to actually save the screenshot to the database
    const data = await saveVideoScreenShot({
        infrastructure: {
            videoRepo
        },
        args: screenshotData
    })

     
    return new Response(JSON.stringify({ data, error: null, message: `Video successfully fetched` }));
}