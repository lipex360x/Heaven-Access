import { requireStaff } from "@/server/auth";
import { api, json, readJson, sameOrigin } from "@/server/http";
import { decideVisit } from "@/server/visits";

export async function POST(
  request: Request,
  context: RouteContext<"/api/staff/visits/[id]/decision">,
) {
  return api(async () => {
    sameOrigin(request);
    const staff = await requireStaff();
    const { decision } = await readJson(request, ["decision"]);
    const { id } = await context.params;
    return json(await decideVisit(id, decision, staff.id));
  });
}
