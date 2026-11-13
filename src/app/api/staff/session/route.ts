import { requireStaff } from "@/server/auth";
import { api, json } from "@/server/http";

export const dynamic = "force-dynamic";
export async function GET() {
  return api(async () => json({ staff: await requireStaff() }));
}
