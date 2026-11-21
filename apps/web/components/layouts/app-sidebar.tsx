"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Plug,
  Key,
  Settings,
  FolderKanban,
  ChevronRight,
  Layers,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/theme/mode-toggle";
import { useProjects } from "@/hooks/use-projects";
import Logo from "./logo";

const PROJECT_NAV = [
  { label: "Overview", path: "", icon: LayoutDashboard },
  { label: "Traces", path: "/traces", icon: Activity },
  { label: "Integration", path: "/integration", icon: Plug },
  { label: "API Keys", path: "/keys", icon: Key },
  { label: "Settings", path: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const params = useParams();
  const projectId = typeof params?.projectId === "string" ? params.projectId : null;
  const { data: projects } = useProjects();
  const activeProject = projects?.find((p) => p.id === projectId);

  return (
    <Sidebar>
      <SidebarHeader className="p-4 pb-3">
        <Logo/>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={
                    pathname === "/projects" ||
                    (pathname.startsWith("/projects") && !projectId)
                  }
                >
                  <Link href="/projects">
                    <FolderKanban className="h-4 w-4" />
                    <span>Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {projectId && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-1 truncate">
                <ChevronRight className="h-3 w-3 shrink-0" />
                <span className="truncate">{activeProject?.name ?? "Project"}</span>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {PROJECT_NAV.map((item) => {
                    const href = `/projects/${projectId}${item.path}`;
                    const isActive =
                      item.path === ""
                        ? pathname === `/projects/${projectId}`
                        : pathname.startsWith(href);
                    return (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={href}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarSeparator className="mb-3" />
        <div className="flex items-center justify-between px-1">
          <UserButton />
          <ThemeSwitcher />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
