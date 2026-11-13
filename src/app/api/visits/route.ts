import { api, json, readJson, sameOrigin } from "@/server/http";
import { createVisit } from "@/server/visits";

export async function POST(request: Request) {
  return api(async () => {
    sameOrigin(request);
    const input = await readJson(request, [
      "visitorName",
      "destinationId",
      "scheduledLocal",
      "privacyAcknowledged",
      "noticeVersion",
    ]);
    return json(await createVisit(input), 201);
  });
}
