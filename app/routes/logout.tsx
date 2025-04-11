import { redirect } from "react-router";
import * as sessionStorage from "~/services/session.server";
import type { Route } from "./+types/logout";

export async function action({ request }: Route.ActionArgs) {
  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  return redirect("/login", {
    headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
  });
}
