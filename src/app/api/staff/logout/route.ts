import { logout } from "@/server/auth";
import { api, json, sameOrigin } from "@/server/http";

export async function POST(request: Request) {
  return api(async () => {
    sameOrigin(request);
    await logout(new URL(request.url).protocol === "https:");
    return json({ signedOut: true });
  });
}
