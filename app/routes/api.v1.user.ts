import { data } from "react-router";
import { accountSchema } from "~/schemas/auth";
import { requireUser } from "~/services/auth.server";
import * as sessionStorage from "~/services/session.server";
import { updateUser } from "~/services/user.server";
import type { Route } from "./+types/api.v1.user";

export async function action({ request }: Route.ActionArgs) {
  const user = await requireUser(request);

  switch (request.method) {
    case "PUT": {
      const validated = accountSchema.parse(
        Object.fromEntries(await request.formData())
      );

      const updated = await updateUser(user.id, validated);
      let session = await sessionStorage.getSession(
        request.headers.get("cookie")
      );
      session.set("user", updated);
      return data(
        {
          ok: true,
        },
        {
          headers: {
            "Set-Cookie": await sessionStorage.commitSession(session),
          },
        }
      );
    }
  }

  return data(
    {
      ok: false,
      error: "Method not supported: " + request.method,
    },
    { status: 405 }
  );
}
