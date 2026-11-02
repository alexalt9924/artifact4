import { redirect } from "next/navigation";

// Placeholder home: send people to the resume editor until auth (Person A) decides the landing page.
export default function Home() {
  redirect("/resume");
}
