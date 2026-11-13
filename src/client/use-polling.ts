"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ClientError } from "./api";

// One sequential loader per screen; hidden pages pause and focus/reconnect refreshes immediately.
export function usePolling<T>(load: (signal: AbortSignal) => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ClientError | null>(null);
  const refreshHandler = useRef<() => void>(() => {});
  const refresh = useCallback(() => refreshHandler.current(), []);
  useEffect(() => {
    const controller = new AbortController();
    let busy = false;
    let timer: ReturnType<typeof setTimeout>;
    async function read() {
      if (busy || controller.signal.aborted || document.hidden) return;
      clearTimeout(timer);
      busy = true;
      try {
        const next = await load(AbortSignal.any([controller.signal, AbortSignal.timeout(5000)]));
        if (!controller.signal.aborted) {
          setData(next);
          setError(null);
        }
      } catch (failure) {
        if (!controller.signal.aborted) {
          const problem =
            failure instanceof ClientError
              ? failure
              : new ClientError(0, "unavailable", "Connection lost. Waiting to reconnect.");
          setError(problem);
          if (problem.status === 401) setData(null);
        }
      } finally {
        busy = false;
        if (!controller.signal.aborted) timer = setTimeout(read, 1000);
      }
    }
    refreshHandler.current = () => {
      void read();
    };
    void read();
    window.addEventListener("focus", read);
    window.addEventListener("online", read);
    document.addEventListener("visibilitychange", read);
    return () => {
      controller.abort();
      refreshHandler.current = () => {};
      clearTimeout(timer);
      window.removeEventListener("focus", read);
      window.removeEventListener("online", read);
      document.removeEventListener("visibilitychange", read);
    };
  }, [load]);
  return { data, error, refresh };
}
