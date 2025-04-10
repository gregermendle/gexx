import type { Config } from "@react-router/dev/config";

declare module "react-router" {
  interface Future {
    unstable_middleware: true; // 👈 Enable middleware types
  }
}

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  future: {
    unstable_middleware: true, // 👈 Enable middleware
  },
  ssr: true,
} satisfies Config;
