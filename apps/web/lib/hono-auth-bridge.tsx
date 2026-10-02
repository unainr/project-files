"use client";

import { useAuth } from "@clerk/nextjs";
import { setAuthTokenGetter } from "@/lib/hono";

// Renders nothing. Syncs Clerk's getToken into the module-level client
// during render (not useEffect) so no child's first request fires
// unauthenticated. The window check keeps the server render from writing
// to shared module state.
export function HonoAuthBridge() {
	const { getToken } = useAuth();

	if (typeof window !== "undefined") {
		setAuthTokenGetter(getToken);
	}

	return null;
}