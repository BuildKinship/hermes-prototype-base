// /gallery redirects to / — the gallery is now the root internal page
import { redirect } from "next/navigation";

export default function GalleryRedirect() {
  redirect("/");
}
