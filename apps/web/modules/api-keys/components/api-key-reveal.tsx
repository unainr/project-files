"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "@/modules/dashboard/components/copy-button";

type Props = { apiKey: string; onDismiss: () => void; projectHref?: string };

export function ApiKeyReveal({ apiKey, onDismiss, projectHref }: Props) {
  return (
    <Card className="border-amber-500">
      <CardHeader>
        <CardTitle className="text-base">Copy your API key now</CardTitle>
        <p className="text-sm text-muted-foreground">It won't be shown again. Keep it in server-side env only.</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <code className="block break-all rounded-md bg-muted p-3 text-sm">{apiKey}</code>
        <div className="flex gap-2">
          <CopyButton value={apiKey} label="Copy key" />
          {projectHref && (
            <Button asChild size="sm">
              <Link href={projectHref}>Open integration</Link>
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onDismiss}>
            I've saved it
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}