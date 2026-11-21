import Link from "next/link";
import Logo from "@/components/layouts/logo";
import { FooterWordmark } from "./footer-wordmark";

const LINKS = [
  { name: "Home", href: "/" },
  { name: "Pricing", href: "/pricing" },
] as const;

export function LandingFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t">
      {/* Decorative background: top hairline, bottom glow, interactive wordmark */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-violet-500/50 to-transparent" />
        <div className="absolute -bottom-24 left-1/2 size-80 -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl" />
        <FooterWordmark />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-28 pt-12 sm:px-6 sm:pb-36 lg:px-8 lg:pb-48">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div className="min-w-0 space-y-3">
            <div className="flex justify-center md:justify-start">
              <Logo />
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              AI observability for developers. See what your AI app is really
              doing.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex items-center gap-1">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex h-9 items-center rounded-full px-4 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} TraceLayer. All rights reserved.</p>
          <p>You decide whether prompts and outputs are captured.</p>
        </div>
      </div>
    </footer>
  );
}