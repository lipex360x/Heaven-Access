import { login } from "@/server/auth";
import { ApiError, api, json, readJson, sameOrigin } from "@/server/http";

export async function POST(request: Request) {
  return api(async () => {
    sameOrigin(request);
    const { username, password } = await readJson(request, ["username", "password"]);
    if (
      typeof username !== "string" ||
      username.length < 1 ||
      username.length > 100 ||
      typeof password !== "string" ||
      password.length < 1 ||
      password.length > 256
    ) {
      throw new ApiError("invalid_input", 400, "Enter a username and password.");
    }
    return json({
      staff: await login(username, password, new URL(request.url).protocol === "https:"),
    });
  });
}
