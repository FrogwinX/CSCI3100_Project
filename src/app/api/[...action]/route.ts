import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest, { params }: { params: { action: string[] } }) {
  const { action } = await params;
  const actionPath = action.join("/");
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

export async function DELETE(request: NextRequest, { params }: { params: { action: string[] } }) {
  const { action } = await params;
  const actionPath = action.join("/");
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
