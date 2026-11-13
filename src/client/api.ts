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
