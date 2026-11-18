import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: "success" | "error" }) {
  return <Badge variant={status === "error" ? "destructive" : "secondary"}>{status}</Badge>;
}