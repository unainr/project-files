"use client";

import { useId } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CopyButton } from "@/modules/dashboard/components/copy-button";
import { AlertTriangle, ArrowRight, Check, KeyRound, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

type Props = { apiKey: string; onDismiss: () => void; projectHref?: string };

export function ApiKeyReveal({ apiKey, onDismiss, projectHref }: Props) {
  const reduceMotion = useReducedMotion();
  const titleId = useId();

  return (
    <motion.div
      role="region"
      aria-labelledby={titleId}
      initial={reduceMotion ? false : { opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card className="gap-0 overflow-hidden border-amber-500/40 bg-amber-500/5 py-0 shadow-sm">
        {/* Top accent stripe */}
        <div
          aria-hidden="true"
          className="h-0.5 w-full bg-linear-to-r from-transparent via-amber-500 to-transparent"
        />

        <CardContent className="space-y-4 p-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 ring-1 ring-amber-500/25"
              >
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p id={titleId} className="text-sm font-semibold leading-tight">
                  Save your API key now
                </p>
                <p className="text-xs text-muted-foreground">
                  It won&apos;t be shown again — store it in a server-side env
                  variable only.
                </p>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Dismiss"
              className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={onDismiss}
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </div>

          {/* Key display */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <KeyRound className="h-3 w-3" aria-hidden="true" />
              Secret API key
            </div>
            <div className="max-h-24 overflow-y-auto rounded-lg border border-amber-500/25 bg-background/70 p-3">
              <code className="block select-all break-all font-mono text-sm leading-relaxed">
                {apiKey}
              </code>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <CopyButton value={apiKey} label="Copy key" />
            {projectHref && (
              <Button asChild size="sm" variant="outline">
                <Link href={projectHref} className="gap-1.5">
                  Open integration
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>
            )}
            <Button
              size="sm"
              className="gap-1.5 sm:ml-auto"
              onClick={onDismiss}
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              I&apos;ve saved it
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}