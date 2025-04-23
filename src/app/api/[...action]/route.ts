import { getSession } from "@/utils/sessions";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ action: string[] }>;

// Backend API URL
const API_BASE_URL = "https://flowchatbackend.azurewebsites.net/api";

// Helper function to get token and user ID from session
async function getAuthInfo(): Promise<{ token: string; userId: number | null }> {
  const session = await getSession();
  const token = session.token ? `Bearer ${session.token}` : "";
  const userId = session.userId ?? null;
  return { token, userId };
}

// Helper function to handle API responses
async function handleApiResponse(response: Response) {
  if (!response.ok) {
    // Forward the error status and potentially the body from the backend
    const errorBody = await response.text();
    console.error(`Backend API Error (${response.status}): ${errorBody}`);
    return new NextResponse(errorBody || response.statusText, { status: response.status });
  }

  const contentType = response.headers.get("content-type");

  // Handle image responses
  if (contentType && contentType.includes("image")) {
    const imageData = await response.arrayBuffer();
    return new NextResponse(imageData, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable", // Example cache header
      },
    });
  }

  // Handle JSON responses (default)
  try {
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // Handle cases where response is not JSON but status is OK (e.g., empty body)
    console.error("Error parsing JSON response, but status was OK:", error);
    return new NextResponse(null, { status: response.status }); // Return OK with empty body
  }
}

// Handle POST requests
export async function POST(request: NextRequest, props: { params: Params }) {
  const params = await props.params;
  const actionPath = params.action.join("/");
  const body = await request.json();
  const { token } = await getAuthInfo();

  const response = await fetch(`${API_BASE_URL}/${actionPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(body),
  });

  return handleApiResponse(response);
}

export async function DELETE(request: NextRequest, props: { params: Params }) {
  const params = await props.params;
  const actionPath = params.action.join("/");
  const body = await request.json();
  const { token } = await getAuthInfo();

  const response = await fetch(`${API_BASE_URL}/${actionPath}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(body),
  });

  return handleApiResponse(response);
}

// Handle GET requests
export async function GET(request: NextRequest, props: { params: Params }) {
  const params = await props.params;
  const actionPath = params.action.join("/");
  const url = new URL(request.url);
  const searchParams = url.search;
  const { token, userId } = await getAuthInfo();

  console.log("GET request to:", `${API_BASE_URL}/${actionPath}${searchParams}`);

  const response = await fetch(`${API_BASE_URL}/${actionPath}${searchParams}&userId=${userId}`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  return handleApiResponse(response);
}
