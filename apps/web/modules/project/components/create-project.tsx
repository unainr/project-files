"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateProject } from "@/hooks/use-projects";
import { ApiKeyReveal } from "@/modules/api-keys/components/api-key-reveal";
import { AlertCircle, FolderPlus, Loader2, Plus } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const MAX_NAME_LENGTH = 80;
const COUNTER_WARN_AT = 70;

export function CreateProjectForm() {
  const create = useCreateProject();
  const [name, setName] = useState("");
  const [created, setCreated] = useState<{ projectId: string; apiKey: string }>();
  const [open, setOpen] = useState(false);

  const reduceMotion = useReducedMotion();
  const uid = useId();
  const inputId = `${uid}-name`;
  const hintId = `${uid}-hint`;
  const errorId = `${uid}-error`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await create.mutateAsync(name.trim());
    setCreated({ projectId: result.project.id, apiKey: result.apiKey });
    setName("");
  }

  function handleOpenChange(next: boolean) {
    if (!next && create.isPending) return;
    setOpen(next);
  }

  const keyIsShowing = Boolean(created);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" aria-hidden="true" />
          New project
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => {
          if (keyIsShowing || create.isPending) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (keyIsShowing || create.isPending) e.preventDefault();
        }}
      >
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border bg-muted/50 text-muted-foreground"
              aria-hidden="true"
            >
              <FolderPlus className="h-4 w-4" />
            </div>
            <div className="min-w-0 space-y-1 text-left">
              <DialogTitle className="text-base font-semibold">
                {keyIsShowing ? "Project created" : "New project"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {keyIsShowing
                  ? "Copy your API key now. It won't be shown again."
                  : "Create a project to get your first API key and start tracing."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {created ? (
          <motion.div
            className="min-w-0"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <ApiKeyReveal
              apiKey={created.apiKey}
              projectHref={`/projects/${created.projectId}/integration`}
              onDismiss={() => {
                setCreated(undefined);
                setOpen(false);
              }}
            />
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            aria-busy={create.isPending}
          >
            <div className="space-y-2">
              <label htmlFor={inputId} className="text-sm font-medium">
                Project name
              </label>
              <div className="relative">
                <Input
                  id={inputId}
                  placeholder="e.g. production-chatbot"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={MAX_NAME_LENGTH}
                  required
                  autoComplete="off"
                  aria-invalid={create.isError || undefined}
                  aria-describedby={
                    create.isError ? `${hintId} ${errorId}` : hintId
                  }
                  className={cn("w-full", name.length > 0 && "pr-14")}
                />
                {name.length > 0 && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] tabular-nums transition-colors",
                      name.length >= COUNTER_WARN_AT
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-muted-foreground"
                    )}
                  >
                    {name.length}/{MAX_NAME_LENGTH}
                  </span>
                )}
              </div>
              <p id={hintId} className="text-xs text-muted-foreground">
                Use a name that tells environments apart. Your API key is shown
                only once, right after creation.
              </p>
            </div>

            {create.isError && (
              <div
                id={errorId}
                role="alert"
                className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
              >
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                <p>Could not create project. Check your connection and try again.</p>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={create.isPending}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={create.isPending} className="gap-2">
                {create.isPending ? (
                  <Loader2
                    className="h-4 w-4 animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                ) : (
                  <Plus className="h-4 w-4" aria-hidden="true" />
                )}
                {create.isPending ? "Creating…" : "Create project"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}