import "server-only";
import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const deriveKey = promisify(scrypt);
export const newSecret = (prefix: string) => `${prefix}${randomBytes(32).toString("base64url")}`;
export const hashSecret = (secret: string) => createHash("sha256").update(secret).digest("hex");

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [scheme, salt, hex] = storedHash.split(":");
  if (scheme !== "scrypt" || !salt || !/^[0-9a-f]{128}$/.test(hex ?? "")) return false;
  const actual = (await deriveKey(password, salt, 64)) as Buffer;
  return timingSafeEqual(Buffer.from(hex, "hex"), actual);
}
