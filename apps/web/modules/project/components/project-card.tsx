import Link from "next/link";
import { Card } from "@/components/ui/card";
import { FolderKanban, ArrowRight, Clock } from "lucide-react";

type Props = { id: string; name: string; createdAt: string };

function formatCreatedDate(createdAt: string): string | null {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatRelative(createdAt: string): string | null {
  const then = new Date(createdAt).getTime();
  if (Number.isNaN(then)) return null;
  const diffMs = Date.now() - then;
  if (diffMs < 0) return null;
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function ProjectCard({ id, name, createdAt }: Props) {
  const absolute = formatCreatedDate(createdAt);
  const relative = formatRelative(createdAt);
  const shortId = id.length > 8 ? `${id.slice(0, 8)}…` : id;

  return (
    <Link
      href={`/projects/${id}`}
      aria-label={`Open project ${name}`}
      className="group block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <Card className="relative h-full gap-0 overflow-hidden py-0 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-md motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
        {/* Dot pattern, fades out diagonally */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 text-foreground opacity-[0.07] bg-[radial-gradient(currentColor_1px,transparent_1px)] bg-size-[16px_16px] mask-[linear-gradient(to_bottom_left,black,transparent_65%)]"
        />

        {/* Background watermark icon */}
        <FolderKanban
          aria-hidden="true"
          strokeWidth={1.25}
          className="pointer-events-none absolute -bottom-8 -right-6 h-36 w-36 -rotate-12 text-primary/[0.07] transition-all duration-500 group-hover:-rotate-6 group-hover:scale-105 group-hover:text-primary/12 motion-reduce:transition-none motion-reduce:group-hover:-rotate-12 motion-reduce:group-hover:scale-100"
        />

        {/* Content */}
        <div className="relative flex items-start gap-4 p-5">
          <div
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
          >
            <FolderKanban className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1 space-y-1.5">
            <h3
              className="truncate text-base font-semibold leading-tight tracking-tight"
              title={name}
            >
              {name}
            </h3>
            <p className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
              <span>Created</span>
              {absolute ? (
                <time dateTime={createdAt} className="tabular-nums">
                  {absolute}
                </time>
              ) : (
                <span>—</span>
              )}
            </p>
          </div>

          <span
            className="mt-0.5 hidden max-w-28 shrink-0 truncate rounded-md border bg-background/70 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground backdrop-blur-sm sm:inline-block"
            title={id}
          >
            {shortId}
          </span>
        </div>

        {/* Footer */}
        <div className="relative mt-auto flex items-center justify-between gap-3 border-t border-border/60 px-5 py-3 text-xs">
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3 w-3" aria-hidden="true" />
            <span className="tabular-nums" suppressHydrationWarning>
              {relative ?? "—"}
            </span>
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors duration-300 group-hover:text-primary">
            Open
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
              aria-hidden="true"
            />
          </span>
        </div>
      </Card>
    </Link>
  );
}