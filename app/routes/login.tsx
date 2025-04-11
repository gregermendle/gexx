import { redirect } from "react-router";
import { LoginForm } from "~/components/login-form";
import Logo from "~/components/ui/logo";
import { authenticator } from "~/services/auth.server";
import * as sessionStorage from "~/services/session.server";
import type { Route } from "./+types/login";

export async function action({ request }: Route.ActionArgs) {
  let user = await authenticator.authenticate("user-pass", request);
  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  session.set("user", user);
  let url = new URL(request.url);
  let redirectTo = url.searchParams.get("redirect") ?? "/dashboard";

  throw redirect(redirectTo, {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
}

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-3 self-center font-medium">
          <Logo size={32} />
          gexx
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
