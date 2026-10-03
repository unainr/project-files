"use client";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";



export const SignInButtonClerk = () => {
  return (
    <>
      <Show when="signed-out">
        <SignInButton>
          <Button
            className={cn(
              "h-9.5 rounded-full px-4 text-sm font-medium text-white shadow-none",
              "transition-colors hover:opacity-90",
            )}
           
          >
            Get Started
          </Button>
        </SignInButton>
      </Show>

      <Show when="signed-in">
        <div className="flex items-center gap-2">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "size-8",
              },
            }}
          />
          <Button
            variant="outline"
            asChild
            
          >
            <Link href="/stats">Dashboard</Link>
          </Button>
        </div>
      </Show>
    </>
  );
};