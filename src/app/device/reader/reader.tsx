"use client";

import { useEffect, useState } from "react";
import { ClientError, newRequestId, requestJson, sendJson } from "@/client/api";
import { usePolling } from "@/client/use-polling";
import { gateSnapshot } from "@/components/gate-status";
import { QrCamera } from "@/components/qr-camera";
import { StaffSignIn } from "@/components/staff-sign-in";
import { ACCESS_MESSAGES, type DeviceSnapshot } from "@/domain/device";

type Scan = { qrPayload: string; expectedRevision: number; requestId: string };

async function load(signal: AbortSignal) {
  const started = performance.now();
  return gateSnapshot(await requestJson<DeviceSnapshot>("/api/device", { signal }), started);
}

export function QrReader() {
  const { data, error, refresh } = usePolling(load);
  const [now, setNow] = useState(0);
  const [busy, setBusy] = useState(false);
  const [retry, setRetry] = useState<Scan | null>(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const timer = setInterval(() => setNow(performance.now()), 100);
    return () => clearInterval(timer);
  }, []);

  async function scan(action: Scan) {
    setBusy(true);
    setMessage("");
    try {
      await sendJson("/api/device/scan", action);
      setRetry(null);
    } catch (failure) {
      setMessage(failure instanceof Error ? failure.message : "Reading unavailable.");
      setRetry(!(failure instanceof ClientError) || failure.status >= 500 ? action : null);
    } finally {
      setBusy(false);
      refresh();
    }
  }

  if (error?.status === 401) return <StaffSignIn onSignedIn={refresh} />;
  if (!data) return <p role="status">{error?.message ?? "Connecting to the access reader…"}</p>;
  const open = !!now && now < data.deadline;
  const feedback = now && now < data.feedbackDeadline ? data.feedback : null;
  const denied = feedback && feedback.code !== "granted" && feedback.code !== "already_unlocked";
  return (
    <div className="stack">
      <section
        className={`panel reader-status ${open ? "gate-open" : denied ? "gate-denied" : ""}`}
      >
        <h2 role="status" aria-live="polite">
          {error
            ? "RECONNECTING"
            : retry
              ? "CHECK READING"
              : open
                ? "ACCESS GRANTED"
                : denied
                  ? "ACCESS DENIED"
                  : "READY TO SCAN"}
        </h2>
        <p>
          {data.device.destination.companyLabel} · {data.device.destination.roomLabel}
        </p>
        {feedback && <p>{ACCESS_MESSAGES[feedback.code]}</p>}
      </section>
      {error && <p role="alert">{error.message} Scanning is paused until reconnection.</p>}
      {message && <p role="status">{message}</p>}
      {retry && (
        <button type="button" disabled={busy || !!error} onClick={() => void scan(retry)}>
          Recover previous reading
        </button>
      )}
      <QrCamera
        compact
        locked={!open}
        revision={data.device.revision}
        disabled={busy || !!error || !!retry}
        onCode={(qrPayload) =>
          scan({ qrPayload, expectedRevision: data.device.revision, requestId: newRequestId() })
        }
      />
      <small>
        The gate / elevator display updates on the other screen. This reader does not control real
        hardware.
      </small>
      <a href="/device">Demonstration controls</a>
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await sendJson("/api/staff/logout", {});
            setRetry(null);
            setMessage("");
          } catch (failure) {
            setMessage(failure instanceof Error ? failure.message : "Sign-out unavailable.");
          } finally {
            setBusy(false);
            refresh();
          }
        }}
      >
        Sign out
      </button>
    </div>
  );
}
