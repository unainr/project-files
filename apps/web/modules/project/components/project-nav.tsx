"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Overview", path: "" },
  { label: "Traces", path: "/traces" },
  { label: "Integration", path: "/integration" },
  { label: "API Keys", path: "/keys" },
  { label: "Settings", path: "/settings" },
];

export function ProjectNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const base = `/projects/${projectId}`;

  return (
    <nav className="mt-4 flex gap-1 border-b">
      {TABS.map((tab) => {
        const href = base + tab.path;
        const active = tab.path === "" ? pathname === base : pathname.startsWith(href);
        return (
          <Link
            key={tab.label}
            href={href}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-sm",
              active ? "border-foreground font-medium" : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}