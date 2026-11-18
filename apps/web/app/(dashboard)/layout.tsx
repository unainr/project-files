
import { TypeLayout } from "@/types";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

const Layout = ({ children }: TypeLayout) => {
    return (
        <>
            <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/projects" className="font-semibold">
            TraceLayer
          </Link>
          <UserButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-6">{children}</main>
    </div>
        </>
    );
};

export default Layout;
