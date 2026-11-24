import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function SiteBar({ children }: { children?: ReactNode }) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-border px-[5vw]">
      <Link to="/" className="flex items-center gap-2 text-[19px] font-bold tracking-tight text-foreground">
        <span className="grid size-7 place-items-center rounded-full bg-primary font-serif text-[17px] italic text-primary-foreground">D</span>
        <span>
          devfolio<span className="text-highlight">.</span>
        </span>
      </Link>
      <div className="flex items-center gap-4">{children}</div>
    </header>
  );
}
