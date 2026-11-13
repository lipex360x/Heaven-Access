import "server-only";

export class ApiError extends Error {
  constructor(
    public code: string,
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function json(value: unknown, status = 200) {
  return Response.json(value, {
    status,
    headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" },
  });
}

export async function api(action: () => Promise<Response>): Promise<Response> {
  try {
    return await action();
  } catch (error) {
    if (error instanceof ApiError) {
      return json({ code: error.code, message: error.message }, error.status);
    }
    // Do not expose/log queries, form contents, credentials or connection strings.
    return json({ code: "unavailable", message: "Service unavailable. Please try again." }, 503);
  }
}

export function sameOrigin(request: Request) {
  // Next normalizes loopback URL hostnames; Host preserves the browser's actual origin.
  const expectedOrigin = `${new URL(request.url).protocol}//${request.headers.get("host")}`;
  if (
    request.headers.get("origin") !== expectedOrigin ||
    request.headers.get("sec-fetch-site") === "cross-site"
  ) {
    throw new ApiError("forbidden", 403, "Use this application's own page to submit the request.");
  }
}

export async function readJson(
  request: Request,
  allowedKeys: string[],
): Promise<Record<string, unknown>> {
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    throw new ApiError("invalid_input", 415, "Send a JSON request.");
  }
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError("invalid_input", 400, "Request body is required.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 8192) {
        await reader.cancel();
        throw new ApiError("invalid_input", 413, "Request is too large.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  let value: unknown;
  try {
    value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new ApiError("invalid_input", 400, "Invalid JSON.");
  }
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    Object.keys(value).some((key) => !allowedKeys.includes(key))
  ) {
    throw new ApiError("invalid_input", 400, "Unexpected request fields.");
  }
  return value as Record<string, unknown>;
}
