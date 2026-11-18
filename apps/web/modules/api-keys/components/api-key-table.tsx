
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { useApiKeys } from "@/hooks/use-api-keys";
import { RevokeKeyButton } from "./revoke-key-button";
import { EmptyState } from "@/modules/dashboard/components/empty-state";

type ApiKeyRow = NonNullable<ReturnType<typeof useApiKeys>["data"]>[number];
type Props = { projectId: string; keys: ApiKeyRow[] };

export function ApiKeysTable({ projectId, keys }: Props) {
  if (keys.length === 0) return <EmptyState title="No API keys yet" />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Key</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Status</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {keys.map((key) => (
          <TableRow key={key.id}>
            <TableCell className="font-medium">{key.name}</TableCell>
            <TableCell>
              <code>{key.keyPrefix}…</code>
            </TableCell>
            <TableCell>{new Date(key.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>
              <Badge variant={key.revokedAt ? "outline" : "secondary"}>{key.revokedAt ? "Revoked" : "Active"}</Badge>
            </TableCell>
            <TableCell className="text-right">
              {!key.revokedAt && <RevokeKeyButton projectId={projectId} keyId={key.id} />}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}