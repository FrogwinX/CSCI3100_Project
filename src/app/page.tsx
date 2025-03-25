import { redirect } from "next/navigation";
import { getSession } from "@/utils/sessions";

export default async function Home() {
  // Check session on the server
  const session = await getSession();

  // Redirect based on authentication status
  if (session.isLoggedIn) {
    redirect("/forum/latest");
  } else {
    redirect("/login");
  }
}
