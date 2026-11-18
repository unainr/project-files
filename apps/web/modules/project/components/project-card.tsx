import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

type Props = { id: string; name: string; createdAt: string };

export function ProjectCard({ id, name, createdAt }: Props) {
  return (
    <Link href={`/projects/${id}`}>
      <Card className="transition hover:bg-muted/50">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <p className="text-sm text-muted-foreground">Created {new Date(createdAt).toLocaleDateString()}</p>
        </CardHeader>
      </Card>
    </Link>
  );
}