"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Loader2, Search, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TraceFilters } from "@/hooks/use-traces";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 350;

const STATUS_OPTIONS: { value: TraceFilters["status"]; label: string; dot?: string }[] = [
  { value: undefined, label: "All" },
  { value: "success", label: "Success", dot: "bg-emerald-500" },
  { value: "error", label: "Failed", dot: "bg-rose-500" },
];

type Props = {
  value: TraceFilters;
  onChange: (filters: TraceFilters) => void;
  /** Shows a spinner in the search box while results load. */
  loading?: boolean;
  /** Shows "N traces" on the right. */
  resultCount?: number;
};

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Badge variant="secondary" className="gap-1 pr-1 font-normal">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove filter: ${label}`}
        className="rounded-sm p-0.5 transition-colors hover:bg-foreground/10"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}

export function TraceFilterBar({ value, onChange, loading, resultCount }: Props) {
  const pillId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState(value.q ?? "");

  // Pull the box back in sync when the filter changes from outside (chips, "Clear all").
  // Skipped when it only differs by whitespace, so typing "hello " isn't clobbered.
  useEffect(() => {
    setSearch((current) => (current.trim() === (value.q ?? "") ? current : (value.q ?? "")));
  }, [value.q]);

  // Live search: apply the text shortly after the user stops typing
  useEffect(() => {
    const next = search.trim() || undefined;
    if (next === value.q) return;
    const id = setTimeout(() => onChange({ ...value, q: next }), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [search, value, onChange]);

  // "/" focuses the search box, unless you're already typing somewhere
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
      e.preventDefault();
      inputRef.current?.focus();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const hasFilters = Boolean(value.q || value.status);

  function clearSearch(focus = false) {
    setSearch("");
    onChange({ ...value, q: undefined });
    if (focus) inputRef.current?.focus();
  }

  function setStatus(status: TraceFilters["status"]) {
    onChange({ ...value, status });
  }

  function clearAll() {
    setSearch("");
    onChange({});
  }

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative w-full max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onChange({ ...value, q: search.trim() || undefined }); // apply immediately
              if (e.key === "Escape") (search ? clearSearch() : e.currentTarget.blur());
            }}
            placeholder="Search by name…"
            aria-label="Search traces by name"
            className="h-9 pl-9 pr-16"
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5">
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-label="Loading" />}
            {search ? (
              <button
                type="button"
                onClick={() => clearSearch(true)}
                aria-label="Clear search"
                className="rounded p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="hidden rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground sm:inline">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Status segmented control */}
        <div role="group" aria-label="Filter by status" className="inline-flex rounded-lg border bg-muted/40 p-0.5">
          {STATUS_OPTIONS.map((option) => {
            const active = value.status === option.value;
            return (
              <button
                key={option.label}
                type="button"
                aria-pressed={active}
                onClick={() => setStatus(option.value)}
                className={cn(
                  "relative inline-flex h-8 items-center rounded-md px-3 text-sm font-medium transition-colors",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId={pillId}
                    className="absolute inset-0 rounded-md border bg-background shadow-sm"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  {option.dot && <span className={cn("h-1.5 w-1.5 rounded-full", option.dot)} />}
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>

        {resultCount !== undefined && (
          <span className="ml-auto text-xs tabular-nums text-muted-foreground" aria-live="polite">
            {resultCount.toLocaleString()} {resultCount === 1 ? "trace" : "traces"}
          </span>
        )}
      </div>

      {/* Active filters */}
      <AnimatePresence initial={false}>
        {hasFilters && (
          <motion.div
            key="chips"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Filters:</span>
              {value.q && <FilterChip label={`Name: “${value.q}”`} onRemove={() => clearSearch()} />}
              {value.status && (
                <FilterChip
                  label={`Status: ${value.status === "error" ? "Failed" : "Success"}`}
                  onRemove={() => setStatus(undefined)}
                />
              )}
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={clearAll}>
                Clear all
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}