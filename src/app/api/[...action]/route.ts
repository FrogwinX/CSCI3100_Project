import { getSession } from "@/utils/sessions";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ action: string[] }>;

export async function POST(request: NextRequest, props: { params: Params }) {
  const params = await props.params;
  const actionPath = params.action.join("/");
  const body = await request.json();

  const response = await fetch(`https://flowchatbackend.azurewebsites.net/api/${actionPath}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: request.headers.get("Authorization") || "",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  console.log(data);
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, props: { params: Params }) {
  const params = await props.params;
  const actionPath = params.action.join("/");
  const body = await request.json();

  const response = await fetch(`https://flowchatbackend.azurewebsites.net/api/${actionPath}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: request.headers.get("Authorization") || "",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data);
}

// For image api calls
export async function GET(request: NextRequest) {
  const session = await getSession();
  const url = new URL(request.url);

  const response = await fetch(`https://flowchatbackend.azurewebsites.net${url.pathname}${url.search}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("image")) {
    const imageData = await response.arrayBuffer();
    return new NextResponse(imageData, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }
}
