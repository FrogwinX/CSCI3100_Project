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
