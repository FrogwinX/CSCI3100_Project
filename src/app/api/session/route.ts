import { getSession } from "@/utils/sessions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getSession();

    // Return updated session data to the client
    return NextResponse.json({
      userId: session.userId,
      username: session.username,
      roles: session.roles,
      isLoggedIn: session.isLoggedIn,
    });
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      {
        isLoggedIn: false,
      },
      { status: 500 }
    );
  }
}
