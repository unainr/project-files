"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { usePathname } from "next/navigation";
import { SignInButtonClerk } from "../clerk-sign-button/Sign-in-button";

import { ThemeSwitcher } from "../theme/mode-toggle";
import { MenuIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import Logo from "./logo";

const menuItems = [
  { name: "Agent", href: "/agent" },
  { name: "Pricing", href: "/pricing" },
];

export function MainHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const drawerId = useId();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Floating dock: detached pill, centered, not full-width */}
      <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <div
          className={cn(
            "flex h-14 items-center gap-1 rounded-full border border-border/60",
            "bg-background/70 px-2.5 shadow-lg shadow-black/10 backdrop-blur-xl",
            "supports-backdrop-filter:bg-background/60",
          )}
        >
          {/* Logo */}
          <div className="ml-1 mr-1.5 flex items-center justify-center">
            <Logo />
          </div>

          <div className="mx-1 hidden h-6 w-px bg-border/70 lg:block" />

          {/* Desktop links */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {menuItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium outline-none transition-colors duration-150",
                        "focus-visible:ring-2 focus-visible:ring-ring",
                        active
                          ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      )}
                    >
                      {active && (
                        <span
                          aria-hidden="true"
                          className="size-1.5 rounded-full bg-violet-500"
                        />
                      )}
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mx-1 h-6 w-px bg-border/70" />

          {/* Theme switcher */}
          <div className="flex items-center justify-center">
            <ThemeSwitcher />
          </div>

          <div className="mx-1 hidden h-6 w-px bg-border/70 lg:block" />

          {/* Sign in */}
          <div className="hidden items-center justify-center lg:flex">
            <SignInButtonClerk />
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center justify-center lg:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className={cn(
                "flex h-9.5 w-9.5 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors",
                "hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
              )}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls={drawerId}
            >
              {menuOpen ? (
                <XIcon className="size-4.5" aria-hidden="true" />
              ) : (
                <MenuIcon className="size-4.5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer so page content isn't hidden under the floating dock */}
      <div className="h-20" />

      {/* Mobile drawer */}
      <div
        id={drawerId}
        className={cn(
          "fixed inset-x-4 top-20 z-40 overflow-hidden rounded-3xl border border-border/60 bg-background/95 shadow-lg shadow-black/10 backdrop-blur-xl",
          "transition-[max-height,opacity,visibility] duration-200 motion-reduce:transition-none lg:hidden",
          menuOpen
            ? "visible max-h-96 opacity-100"
            : "invisible max-h-0 opacity-0",
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col gap-1 p-3">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium outline-none transition-colors",
                  "focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.name}
                {active && (
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-violet-500"
                  />
                )}
              </Link>
            );
          })}

          <div className="mt-2 flex items-center gap-4 border-t border-border px-1 pt-3">
            <SignInButtonClerk />
          </div>
        </nav>
      </div>
    </>
  );
}