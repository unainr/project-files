import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

export function StatusBadge({ status }: { status: "success" | "error" }) {
  if (status === "error") {
    return (
      <Badge variant="destructive" className="gap-1 text-xs">
        <XCircle className="h-3 w-3" />
        Error
      </Badge>
    );
  }
  return (
    <Badge
      variant="secondary"
      className="gap-1 text-xs bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 border-0"
    >
      <CheckCircle2 className="h-3 w-3" />
      Success
    </Badge>
  );
}
