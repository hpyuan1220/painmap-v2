declare module "nitro/vite" {
  import type { Plugin } from "vite";

  export function nitro(): Plugin;
}
