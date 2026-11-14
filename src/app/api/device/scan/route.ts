import { requireStaff } from "@/server/auth";
import { accessDevice } from "@/server/device";
import { api, json, readJson, sameOrigin } from "@/server/http";

export async function POST(request: Request) {
  return api(async () => {
    sameOrigin(request);
    const staff = await requireStaff();
    return json(
      await accessDevice(
        await readJson(request, ["requestId", "expectedRevision", "qrPayload"]),
        staff.id,
        "qr",
      ),
    );
  });
}
