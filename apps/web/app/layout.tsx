import type { Metadata } from "next";
import { Geist, Geist_Mono, Raleway } from "next/font/google";
import "./globals.css";
import { HonoAuthBridge } from "@/lib/hono-auth-bridge";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import QueryProviders from "@/providers/query-provider";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const raleway = Raleway({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TraceLayer | AI observability for developers",
    template: "%s | TraceLayer",
  },
  description:
    "See what your AI app is really doing. TraceLayer captures every LLM call with status, duration, model, input and output, token usage and errors.",
  applicationName: "TraceLayer",
  keywords: [
    "AI observability",
    "LLM tracing",
    "LLM monitoring",
    "AI debugging",
    "token usage",
    "TraceLayer",
  ],
  openGraph: {
    type: "website",
    siteName: "TraceLayer",
    title: "TraceLayer | AI observability for developers",
    description:
      "Follow every LLM call your app makes, from the first step to the last, and see where it slowed down or failed.",
  },
  twitter: {
    card: "summary",
    title: "TraceLayer | AI observability for developers",
    description:
      "Follow every LLM call your app makes, from the first step to the last, and see where it slowed down or failed.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={cn(
				"h-full",
				"antialiased",
				geistSans.variable,
				geistMono.variable,
				"font-sans",
				raleway.variable,
			)}>
			<ClerkProvider>
				<body className="min-h-full flex flex-col">
					<QueryProviders>
						<ThemeProvider>
							{children}
							<Toaster />
							<HonoAuthBridge />
						</ThemeProvider>
					</QueryProviders>
				</body>
			</ClerkProvider>
		</html>
	);
}
