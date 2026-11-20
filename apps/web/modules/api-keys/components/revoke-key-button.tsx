"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRevokeApiKey } from "@/hooks/use-api-keys";
import { cn } from "@/lib/utils";
import { AlertTriangle, Ban, Loader2 } from "lucide-react";

type Props = { projectId: string; keyId: string };

export function RevokeKeyButton({ projectId, keyId }: Props) {
  const revoke = useRevokeApiKey(projectId);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={revoke.isPending}
          className="gap-1.5 hover:border-destructive/40 hover:text-destructive"
        >
          {revoke.isPending ? (
            <Loader2
              className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          ) : (
            <Ban className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          {revoke.isPending ? "Revoking…" : "Revoke"}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            <div
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-destructive/30 bg-destructive/10 text-destructive"
            >
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="min-w-0 space-y-1 text-left">
              <AlertDialogTitle className="text-base font-semibold">
                Revoke this API key?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm">
                Apps using this key will stop sending traces. Make sure nothing
                in production still depends on it.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            onClick={() => revoke.mutate(keyId)}
          >
            Revoke key
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}