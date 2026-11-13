import { api, json } from "@/server/http";
import { ownVisit } from "@/server/visits";

export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  return api(async () => json(await ownVisit(request.headers.get("authorization"))));
}
