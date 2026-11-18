import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { title: string; content?: string | null; emptyText?: string };

export function TraceContentBlock({ title, content, emptyText = "Not captured" }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap text-sm">
          {content ?? <span className="text-muted-foreground">{emptyText}</span>}
        </pre>
      </CardContent>
    </Card>
  );
}