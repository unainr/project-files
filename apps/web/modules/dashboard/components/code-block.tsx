import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopyButton } from "./copy-button";

type Props = { title: string; code: string };

export function CodeBlock({ title, code }: Props) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        <CopyButton value={code} />
      </CardHeader>
      <CardContent>
        <pre className="overflow-auto rounded-md bg-muted p-3 text-sm">{code}</pre>
      </CardContent>
    </Card>
  );
}