export class ClientError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export async function requestJson<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    credentials: "same-origin",
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
    ...options,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    throw new ClientError(
      response.status,
      data?.code ?? "unavailable",
      data?.message ?? "Connection unavailable. Refresh to check the current state.",
    );
  }
  return data as T;
}

export function sendJson<T>(path: string, body: unknown, method = "POST") {
  return requestJson<T>(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// randomUUID requires a secure context; getRandomValues also supports a local LAN HTTP demo.
export function newRequestId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
