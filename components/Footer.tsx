import * as React from "react";

import { cn } from "@/lib/utils";
import { siteConfig } from "../config/site";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{" "}
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              jarrod
            </a>
            . Powered by{" "}
            <a
              href="https://evmkit.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              EVM Kit
            </a>
            ,{" "}
            <a
              href="https://polygon.technology/"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Polygon
            </a>
            , and{" "}
            <a
              href="https://www.lens.xyz/   "
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Lens Protocol
            </a>
            . The source code is available on{" "}
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
