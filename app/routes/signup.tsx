import Logo from "~/components/ui/logo";
import type { Route } from "./+types/login";
import { redirect } from "react-router";
import * as sessionStorage from "~/services/session.server";
import { createUser } from "~/services/user.server";
import { signupSchema } from "~/schemas/auth";
import { SignupForm } from "~/components/signup-form";

export async function action({ request }: Route.ActionArgs) {
  const { email, name, password } = signupSchema.parse(
    Object.fromEntries(await request.formData())
  );
  console.log(email);
  let user = await createUser({ email, name }, password);
  let session = await sessionStorage.getSession(request.headers.get("cookie"));
  session.set("user", user);

  throw redirect("/dashboard", {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
}

export default function SignUpPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-3 self-center font-medium">
          <Logo size={32} />
          gexx
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
