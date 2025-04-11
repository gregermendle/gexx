import { useEffect, useState } from "react";
import type { Route } from "./+types/_index";

import { Link } from "react-router";

import { ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import Logo from "~/components/ui/logo";
import { useUser } from "~/hooks/use-user";
import { cn } from "~/lib/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [loaded, setIsLoaded] = useState(false);
  const user = useUser();

  useEffect(() => {
    if (loaded) return;

    let timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [loaded]);

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center p-6 transition-[opacity,filter,max-height] blur-xl opacity-0 duration-[800ms] ease-in-out h-dvh md:h-auto",
        loaded && "blur-[0] opacity-100"
      )}
    >
      <div className="bg-card w-full max-w-[500px] overflow-hidden rounded-lg border shadow-lg h-full grid grid-rows-[auto_1fr_auto]">
        <header className="flex items-center justify-between border-b px-3 py-3">
          <div className="flex items-center gap-3">
            <Logo size={32} onLoad={() => setIsLoaded(true)} />
            <span className="text-xl font-bold">gexx</span>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <Button variant="outline" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
            )}
          </div>
        </header>
        <section className="grid">
          <h1 className="text-3xl font-bold pr-40 pl-6 py-8 [grid-area:1/1]">
            Multi-channel selling for your business.
          </h1>
          <h1
            aria-hidden
            className="text-3xl font-bold pr-40 pl-6 py-8 [grid-area:1/1] blur-lg opacity-60"
          >
            Multi-channel selling for your business.
          </h1>
        </section>
        <section className="px-6 pb-12">
          <Button asChild>
            <Link to="/signup">
              Start now
              <ChevronRight size={16} />
            </Link>
          </Button>
        </section>
        <footer className="py-3 px-3.5 border-t">
          <div className="flex flex-row justify-between gap-3 text-sm text-muted-foreground">
            <div>© 2025 gexx. all rights reserved.</div>
            <div className="flex gap-3">
              <Link to="#" className="hover:underline">
                twitter
              </Link>
              <Link to="#" className="hover:underline">
                linkedin
              </Link>
              <Link to="#" className="hover:underline">
                github
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
