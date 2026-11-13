import { requireStaff } from "@/server/auth";
import { changeSettings } from "@/server/device";
import { api, json, readJson, sameOrigin } from "@/server/http";

export async function PATCH(request: Request) {
  return api(async () => {
    sameOrigin(request);
    await requireStaff();
    return json(
      await changeSettings(
        await readJson(request, [
          "expectedRevision",
          "destinationId",
          "effectiveLocal",
          "resetClock",
        ]),
      ),
    );
  });
}
