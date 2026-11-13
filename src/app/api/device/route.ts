import { requireStaff } from "@/server/auth";
import { readDevice } from "@/server/device";
import { api, json } from "@/server/http";

export async function GET() {
  return api(async () => {
    await requireStaff();
    return json({ device: await readDevice() });
  });
}
