import { PageHeader } from "@/modules/dashboard/components/page-header";
import { CreateProjectForm } from "@/modules/project/components/create-project";
import { ProjectsList } from "@/modules/project/components/project-list";


export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Projects" description="Each project has its own API keys and traces." />
      <CreateProjectForm />
      <ProjectsList />
    </div>
  );
}