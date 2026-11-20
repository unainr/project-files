"use client";

import { useMemo, useState } from "react";
import { ChevronDown, EyeOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/modules/dashboard/components/copy-button";

type Props = {
  title: string;
  content?: string | null;
  emptyText?: string;
  /** Extra explanation shown under the empty text. */
  emptyHint?: string;
  className?: string;
};

const COLLAPSE_CHARS = 800;
const COLLAPSE_LINES = 14;

/** Pretty-prints JSON content, otherwise leaves the text untouched. */
function formatContent(raw: string) {
  const trimmed = raw.trim();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return { text: JSON.stringify(JSON.parse(trimmed), null, 2), isJson: true };
    } catch {
      /* not valid JSON, show as-is */
    }
  }
  return { text: raw, isJson: false };
}

export function TraceContentBlock({
  title,
  content,
  emptyText = "Not captured",
  emptyHint,
  className,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const formatted = useMemo(() => (content ? formatContent(content) : null), [content]);

  const lineCount = formatted ? formatted.text.split("\n").length : 0;
  const collapsible = formatted ? formatted.text.length > COLLAPSE_CHARS || lineCount > COLLAPSE_LINES : false;

  return (
    <Card className={cn("flex h-full flex-col overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0 border-b bg-muted/30 px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          {formatted?.isJson && (
            <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
              JSON
            </Badge>
          )}
          {formatted && (
            <span className="truncate text-xs tabular-nums text-muted-foreground">
              {formatted.text.length.toLocaleString()} chars
            </span>
          )}
        </div>
        {formatted && <CopyButton value={formatted.text} />}
      </CardHeader>

      <CardContent className="relative flex-1 p-0">
        {formatted ? (
          <>
            <pre
              className={cn(
                "whitespace-pre-wrap wrap-break-word px-4 py-3 font-mono text-[13px] leading-relaxed",
                collapsible && !expanded && "max-h-56 overflow-hidden",
                collapsible && expanded && "max-h-128 overflow-auto",
              )}
            >
              {formatted.text}
            </pre>

            {collapsible && !expanded && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-10 h-14 bg-linear-to-t from-card to-transparent"
              />
            )}

            {collapsible && (
              <div className="border-t px-2 py-1.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-full justify-center gap-1.5 text-xs text-muted-foreground"
                  aria-expanded={expanded}
                  onClick={() => setExpanded((value) => !value)}
                >
                  {expanded ? "Show less" : `Show all ${lineCount} lines`}
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 px-4 py-8 text-center">
            <EyeOff className="h-5 w-5 text-muted-foreground/60" />
            <p className="text-sm font-medium text-muted-foreground">{emptyText}</p>
            {emptyHint && <p className="max-w-xs text-xs text-muted-foreground/80">{emptyHint}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}