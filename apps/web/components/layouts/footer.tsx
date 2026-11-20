import Link from "next/link";
import Logo from "@/components/layouts/logo";

const LINKS = [
  { name: "Agent", href: "/agent" },
  { name: "Pricing", href: "/pricing" },
  { name: "Dashboard", href: "/projects" },
] as const;

export function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
        <Logo />

        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} TraceLayer
        </p>
      </div>
    </footer>
  );
}