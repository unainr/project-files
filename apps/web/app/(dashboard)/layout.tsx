import { TypeLayout } from "@/types";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { Separator } from "@/components/ui/separator";

const Layout = ({ children }: TypeLayout) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur supports-backdrop-filter:bg-background/60 sm:px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="truncate text-sm font-medium text-muted-foreground">
            TraceLayer
          </span>
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          className="min-w-0 flex-1 overflow-x-hidden px-4 py-5 outline-none sm:px-6 sm:py-6"
        >
          <div className="mx-auto w-full min-w-0 max-w-screen-2xl">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;