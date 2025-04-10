import { useRouteLoaderData } from "react-router";
import type { loader } from "~/root";

export function useUser() {
  const data = useRouteLoaderData<typeof loader>("root");
  return data?.user;
}

export function useRequireUser() {
  const data = useRouteLoaderData<typeof loader>("root");
  if (!data?.user) throw new Error("No user data in context.");
  return data?.user;
}
