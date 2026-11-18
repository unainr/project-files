import { customAlphabet } from "nanoid";

export const API_KEY_PREFIX = "tl_live_";
const KEY_SECRET_LENGTH = 40;

// 62 chars ^ 40 ≈ 238 bits of entropy
const secret = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  KEY_SECRET_LENGTH,
);

/** SHA-256 is right for high-entropy random keys (no salt/bcrypt needed). Web Crypto = Node + Workers. */
export async function hashApiKey(key: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(key));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function isApiKeyFormat(key: string): boolean {
  return key.startsWith(API_KEY_PREFIX) && key.length === API_KEY_PREFIX.length + KEY_SECRET_LENGTH;
}

export async function generateApiKey() {
  const key = `${API_KEY_PREFIX}${secret()}`;
  return {
    key, // return to the user ONCE, never store
    keyHash: await hashApiKey(key),
    keyPrefix: key.slice(0, API_KEY_PREFIX.length + 4), // safe to display
  };
}