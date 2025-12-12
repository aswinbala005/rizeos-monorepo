import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Debugging
console.log("✅ UploadThing Route Handler Initialized");
if (!process.env.UPLOADTHING_SECRET) console.error("❌ MISSING UPLOADTHING_SECRET");
if (!process.env.UPLOADTHING_APP_ID) console.error("❌ MISSING UPLOADTHING_APP_ID");

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});