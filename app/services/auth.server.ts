import { redirect } from "react-router";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import type { User } from "~/db/schema";
import { loginSchema } from "~/schemas/auth";
import * as sessionStorage from "~/services/session.server";
import type { Route } from "../+types/root";
import { verifyLogin } from "./user.server";

export let authenticator = new Authenticator<User>();

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const { email, password } = loginSchema.parse(Object.fromEntries(form));
    return verifyLogin(email, password);
  }),
  "user-pass"
);

export async function requireUser(request: Request): Promise<User> {
  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  let user = session.get("user");
  let url = new URL(request.url);
  let returnTo =
    url.hostname === "localhost" ||
    url.hostname === "gexx.ai" ||
    url.hostname === "www.gexx.ai"
      ? `?redirect=${url.pathname}`
      : "";
  if (!user) throw redirect("/login" + returnTo);
  return user;
}

export async function optionalUser(request: Request): Promise<User | null> {
  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  let user = session.get("user");
  return user ?? null;
}

export const authMiddleware: Route.unstable_MiddlewareFunction = async (
  { request, params, context },
  next
) => {
  await requireUser(request);
  await next();
};
