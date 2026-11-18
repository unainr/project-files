"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TraceFilters } from "@/hooks/use-traces";

const STATUSES = ["all", "success", "error"] as const;

type Props = { value: TraceFilters; onChange: (filters: TraceFilters) => void };

export function TraceFilterBar({ value, onChange }: Props) {
  const [search, setSearch] = useState(value.q ?? "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    onChange({ ...value, q: search.trim() || undefined });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name…" className="w-64" />
        <Button type="submit" variant="secondary">
          Search
        </Button>
      </form>
      {STATUSES.map((status) => {
        const active = (value.status ?? "all") === status;
        return (
          <Button
            key={status}
            type="button"
            variant={active ? "default" : "outline"}
            onClick={() => onChange({ ...value, status: status === "all" ? undefined : status })}
          >
            {status}
          </Button>
        );
      })}
    </div>
  );
}