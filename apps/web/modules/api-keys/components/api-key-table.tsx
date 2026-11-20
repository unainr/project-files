import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { useApiKeys } from "@/hooks/use-api-keys";
import { RevokeKeyButton } from "./revoke-key-button";
import { EmptyState } from "@/modules/dashboard/components/empty-state";
import { cn } from "@/lib/utils";
import { KeyRound } from "lucide-react";

type ApiKeyRow = NonNullable<ReturnType<typeof useApiKeys>["data"]>[number];
type Props = { projectId: string; keys: ApiKeyRow[] };

function formatDate(iso: string): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString();
}

export function ApiKeysTable({ projectId, keys }: Props) {
  if (keys.length === 0) return <EmptyState title="No API keys yet" />;

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <Table className="min-w-152">
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="h-10 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Name
            </TableHead>
            <TableHead className="h-10 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Key
            </TableHead>
            <TableHead className="h-10 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Created
            </TableHead>
            <TableHead className="h-10 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="h-10 w-px">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keys.map((key) => {
            const revoked = Boolean(key.revokedAt);
            const created = formatDate(key.createdAt);
            const revokedOn = key.revokedAt ? formatDate(key.revokedAt) : null;

            return (
              <TableRow key={key.id} className={cn(revoked && "bg-muted/20")}>
                <TableCell>
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div
                      aria-hidden="true"
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border bg-muted/50",
                        revoked ? "text-muted-foreground/60" : "text-muted-foreground"
                      )}
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                    </div>
                    <span
                      className={cn(
                        "max-w-56 truncate font-medium",
                        revoked && "text-muted-foreground"
                      )}
                      title={key.name}
                    >
                      {key.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <code
                    className={cn(
                      "rounded-md border bg-muted/50 px-1.5 py-0.5 font-mono text-xs",
                      revoked && "text-muted-foreground line-through"
                    )}
                  >
                    {key.keyPrefix}…
                  </code>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {created ? (
                    <time
                      dateTime={key.createdAt}
                      className="tabular-nums"
                      suppressHydrationWarning
                    >
                      {created}
                    </time>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={key.revokedAt ? "outline" : "secondary"}
                    title={revokedOn ? `Revoked on ${revokedOn}` : undefined}
                    className={cn(
                      "gap-1.5 font-medium",
                      revoked
                        ? "text-muted-foreground"
                        : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        revoked ? "bg-muted-foreground/50" : "bg-emerald-500"
                      )}
                    />
                    {key.revokedAt ? "Revoked" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {!key.revokedAt && (
                    <RevokeKeyButton projectId={projectId} keyId={key.id} />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}