import { AppType } from "@workspace/server";
import { hc } from "hono/client";


type GetToken = () => Promise<string | null>;

// Starts as a no-op so any request fired before Clerk mounts
// goes out unauthenticated instead of throwing.
let getTokenRef: GetToken = async () => null;

export function setAuthTokenGetter(fn: GetToken) {
	getTokenRef = fn;
}

export const client = hc<AppType>(process.env.NEXT_PUBLIC_API_URL!, {
	headers: async (): Promise<Record<string, string>> => {
		const token = await getTokenRef();
		return token ? { Authorization: `Bearer ${token}` } : {};
	},
});