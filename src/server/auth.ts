import "server-only";
import { cookies } from "next/headers";
import { getDatabase, transaction } from "./database";
import { ApiError } from "./http";
import { hashSecret, newSecret, verifyPassword } from "./secrets";

const SESSION_COOKIE = "heaven_staff";
const SESSION_SECONDS = 8 * 60 * 60;
// Run the same password derivation for an unknown account; return the same error.
const DUMMY_HASH = `scrypt:demo-dummy:${"0".repeat(128)}`;
export type Staff = { id: number; username: string };

export async function requireStaff(): Promise<Staff> {
  const secret = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!secret || !/^s_[A-Za-z0-9_-]{43}$/.test(secret)) {
    throw new ApiError("unauthenticated", 401, "Please sign in.");
  }
  const result = await getDatabase().query<Staff>(
    `SELECT a.id, a.username FROM staff_sessions s
     JOIN staff_accounts a ON a.id = s.staff_id
     WHERE s.secret_hash = $1 AND s.expires_at > clock_timestamp()`,
    [hashSecret(secret)],
  );
  if (!result.rows[0]) throw new ApiError("unauthenticated", 401, "Please sign in.");
  return result.rows[0];
}

export async function login(username: string, password: string, secure: boolean): Promise<Staff> {
  const result = await getDatabase().query<Staff & { password_hash: string }>(
    "SELECT id, username, password_hash FROM staff_accounts WHERE username = $1",
    [username],
  );
  const account = result.rows[0];
  const matches = await verifyPassword(password, account?.password_hash ?? DUMMY_HASH);
  if (!account || !matches)
    throw new ApiError("unauthenticated", 401, "Invalid username or password.");
  const cookieStore = await cookies();
  const previous = cookieStore.get(SESSION_COOKIE)?.value;
  const secret = newSecret("s_");
  await transaction(async (client) => {
    await client.query("DELETE FROM staff_sessions WHERE expires_at <= clock_timestamp()");
    if (previous)
      await client.query("DELETE FROM staff_sessions WHERE secret_hash = $1", [
        hashSecret(previous),
      ]);
    await client.query(
      `INSERT INTO staff_sessions (secret_hash, staff_id, expires_at)
       VALUES ($1, $2, clock_timestamp() + interval '8 hours')`,
      [hashSecret(secret), account.id],
    );
  });
  cookieStore.set(SESSION_COOKIE, secret, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: SESSION_SECONDS,
  });
  return { id: account.id, username: account.username };
}

export async function logout(secure: boolean) {
  const cookieStore = await cookies();
  const secret = cookieStore.get(SESSION_COOKIE)?.value;
  if (secret)
    await getDatabase().query("DELETE FROM staff_sessions WHERE secret_hash = $1", [
      hashSecret(secret),
    ]);
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 0,
  });
}
