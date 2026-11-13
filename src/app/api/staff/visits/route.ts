import { requireStaff } from "@/server/auth";
import { api, json } from "@/server/http";
import { staffVisits } from "@/server/visits";

export const dynamic = "force-dynamic";
export async function GET() {
  return api(async () => {
    await requireStaff();
    return json(await staffVisits());
  });
}
