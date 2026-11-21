import { PageHeader } from "@/modules/dashboard/components/page-header";
import { CreateProjectForm } from "@/modules/project/components/create-project";
import { ProjectsList } from "@/modules/project/components/project-list";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
export default async function ProjectsPage() {
	const { userId } = await auth();
	if (!userId) redirect("/sign-in");
	return (
		<div className="space-y-6">
			<PageHeader
				title="Projects"
				description="Manage your AI tracing projects. Each project has its own API keys and traces."
			/>
			<Separator />
			<CreateProjectForm />
			<ProjectsList />
		</div>
	);
}
