import { requireStaff } from "@/server/auth";
import { readDeviceSnapshot } from "@/server/device";
import { api, json } from "@/server/http";

export async function GET() {
  return api(async () => {
    await requireStaff();
    return json(await readDeviceSnapshot());
  });
}
