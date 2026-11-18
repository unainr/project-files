"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = { value: string; label?: string };

export function CopyButton({ value, label = "Copy" }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Button type="button" size="sm" variant="outline" onClick={handleCopy}>
      {copied ? "Copied" : label}
    </Button>
  );
}