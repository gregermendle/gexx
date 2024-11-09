import type { MetaFunction } from "@remix-run/node";
import { Graphic } from "~/components/graphic";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return <Graphic />;
}
