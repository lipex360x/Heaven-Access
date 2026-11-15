import { requireStaff } from "@/server/auth";
import { api, json, readJson, sameOrigin } from "@/server/http";
import { revokeVisit } from "@/server/visits";

export async function POST(
  request: Request,
  context: RouteContext<"/api/staff/visits/[id]/revoke">,
) {
  return api(async () => {
    sameOrigin(request);
    const staff = await requireStaff();
    await readJson(request, []);
    const { id } = await context.params;
    return json(await revokeVisit(id, staff.id));
  });
}
