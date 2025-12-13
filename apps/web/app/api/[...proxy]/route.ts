import { NextRequest, NextResponse } from "next/server";

const INTERNAL_API_URL = process.env.INTERNAL_API_URL || "http://127.0.0.1:8080";

async function handler(req: NextRequest) {
  // 1. Construct the Destination URL
  let baseUrl = INTERNAL_API_URL;
  
  // Fix: If INTERNAL_API_URL ends with /api/v1, but pathname also starts with it, we get duplication.
  // We strip common API prefixes from the base URL to ensure clean appending.
  if (baseUrl.endsWith("/api/v1")) {
     baseUrl = baseUrl.slice(0, -7); // Remove /api/v1
  } else if (baseUrl.endsWith("/api")) {
     baseUrl = baseUrl.slice(0, -4); // Remove /api
  }
  
  // Remove trailing slash from base if present
  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }

  const targetUrl = `${baseUrl}${req.nextUrl.pathname}${req.nextUrl.search}`;

  console.log(`🔀 Proxying: ${req.method} ${req.nextUrl.pathname} -> ${targetUrl}`);

  try {
    // 2. Parse Body (if present)
    let body = undefined;
    const contentType = req.headers.get("content-type");

    if (req.method !== "GET" && req.method !== "HEAD") {
      if (contentType?.includes("application/json")) {
        // Safely parse JSON
        try {
          const jsonBody = await req.json();
          body = JSON.stringify(jsonBody);
        } catch (e) {
          console.warn("⚠️ Proxy: Failed to parse JSON body", e);
        }
      } else {
        // Pass raw text/blob for other types
        body = await req.text();
      }
    }

    // 3. Forward Request
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        // Add other headers if needed (e.g. Authorization)
      },
      body: body,
    });

    // 4. Handle Response
    const responseContentType = response.headers.get("content-type");
    
    // Check if response is JSON
    if (responseContentType?.includes("application/json")) {
      const data = await response.json();
      
      if (!response.ok) {
        console.error(`❌ Backend Error (${response.status}):`, data);
        return NextResponse.json(data, { status: response.status });
      }

      return NextResponse.json(data, { status: 200 });
    } else {
      // Non-JSON response (likely an error page or HTML)
      const text = await response.text();
      console.error(`❌ Backend returned non-JSON response (${response.status}):`, text.substring(0, 200));
      
      return NextResponse.json(
        { 
          error: "Backend error", 
          message: "The API returned an unexpected response",
          details: text.substring(0, 500)
        },
        { status: response.status || 500 }
      );
    }

  } catch (error) {
    console.error("🔥 Proxy Fatal Error:", error);
    return NextResponse.json(
      { error: "Proxy failed", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE };