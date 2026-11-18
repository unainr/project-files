import { ProjectHeader } from "@/modules/project/components/project-header";
import { ProjectNav } from "@/modules/project/components/project-nav";


type Props = {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
};

export default async function ProjectLayout({ children, params }: Props) {
  const { projectId } = await params;

  return (
    <div className="space-y-6">
      <div>
        <ProjectHeader projectId={projectId} />
        <ProjectNav projectId={projectId} />
      </div>
      {children}
    </div>
  );
}