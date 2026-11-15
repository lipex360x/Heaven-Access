"use client";

import { useEffect, useState } from "react";
import { ClientError, newRequestId, requestJson, sendJson } from "@/client/api";
import { usePolling } from "@/client/use-polling";
import { type GateSnapshot, GateStatus, gateSnapshot } from "@/components/gate-status";
import { QrCamera } from "@/components/qr-camera";
import { StaffSignIn } from "@/components/staff-sign-in";
import {
  ACCESS_MESSAGES,
  type AccessResult,
  type Device,
  type DeviceSnapshot,
} from "@/domain/device";

type Visit = {
  id: string;
  visitorName: string;
  state: string;
  qrAccessCount: number;
  manualReleaseCount: number;
  destination: Device["destination"];
};
type Snapshot = GateSnapshot & {
  visits: Visit[];
  destinations: Device["destination"][];
};
type Action = { path: string; body: Record<string, unknown> };

async function load(signal: AbortSignal): Promise<Snapshot> {
  const started = performance.now();
  const snapshot = gateSnapshot(
    await requestJson<DeviceSnapshot>("/api/device", { signal }),
    started,
  );
  const { visits } = await requestJson<{ visits: Visit[] }>("/api/staff/visits", { signal });
  const { destinations } = await requestJson<{ destinations: Device["destination"][] }>(
    "/api/destinations",
    { signal },
  );
  return { ...snapshot, visits, destinations };
}

export function DeviceSimulator() {
  const { data, error, refresh } = usePolling(load);
  const [now, setNow] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [retry, setRetry] = useState<Action | null>(null);
  const [selectedId, setSelectedId] = useState("");
  useEffect(() => {
    const timer = setInterval(() => setNow(performance.now()), 100);
    return () => clearInterval(timer);
  }, []);
  const remaining = data && now ? Math.max(0, data.deadline - now) : 0;
  const selected = data?.visits.find((visit) => visit.id === selectedId);

  async function act(action: Action) {
    setBusy(true);
    setMessage("");
    try {
      const result = await sendJson<AccessResult>(action.path, action.body);
      setMessage(ACCESS_MESSAGES[result.code]);
      setRetry(null);
    } catch (failure) {
      setMessage(failure instanceof Error ? failure.message : "Action unavailable.");
      if (!(failure instanceof ClientError) || failure.status >= 500) setRetry(action);
      else setRetry(null);
    } finally {
      setBusy(false);
      refresh();
    }
  }
  if (error?.status === 401) return <StaffSignIn onSignedIn={refresh} />;
  if (!data) return <p role="status">{error?.message ?? "Loading the authenticated simulator…"}</p>;
  const disabled = busy || !!error || !!retry;
  return (
    <div className="stack">
      {error && (
        <p role="alert">{error.message} New access is paused until the connection recovers.</p>
      )}
      <GateStatus snapshot={data} />
      <a href="/device/reader">Open the dedicated QR reader on a camera phone</a>
      <a href="/device/display" target="_blank" rel="noreferrer">
        Open gate display on another screen
      </a>
      {message && (
        <p className="action-feedback" role="status">
          {message}
        </p>
      )}
      {retry && (
        <div className="panel stack">
          <p>
            The action outcome is uncertain. Retry the same request to recover its result without
            recording another opening.
          </p>
          <button type="button" disabled={busy} onClick={() => void act(retry)}>
            Retry previous action
          </button>
        </div>
      )}
      <QrCamera
        locked={remaining === 0}
        revision={data.device.revision}
        disabled={disabled}
        onCode={async (qrPayload) => {
          await act({
            path: "/api/device/scan",
            body: {
              qrPayload,
              expectedRevision: data.device.revision,
              requestId: newRequestId(),
            },
          });
        }}
      />
      <section className="panel stack">
        <h2>Demonstration controls</h2>
        <p>
          Changing destination or clock relocks the gate and invalidates in-flight scans. Clock
          rewind replays a scenario; it does not renew a visit.
        </p>
        <form
          className="stack"
          key={data.device.revision}
          onSubmit={async (event) => {
            event.preventDefault();
            const values = new FormData(event.currentTarget);
            const time = values.get("effectiveLocal");
            setBusy(true);
            setMessage("");
            try {
              await sendJson(
                "/api/demo/settings",
                {
                  expectedRevision: data.device.revision,
                  destinationId: Number(values.get("destinationId")),
                  ...(time ? { effectiveLocal: time } : {}),
                },
                "PATCH",
              );
              setMessage("Scenario changed. Remove the QR before scanning again.");
            } catch (failure) {
              setMessage(
                failure instanceof Error
                  ? failure.message
                  : "Settings unavailable. Refresh before trying again.",
              );
            } finally {
              setBusy(false);
              refresh();
            }
          }}
        >
          <label>
            Device destination
            <select
              name="destinationId"
              defaultValue={data.device.destination.id}
              disabled={disabled}
            >
              {data.destinations.map((destination) => (
                <option key={destination.id} value={destination.id}>
                  {destination.companyLabel} · {destination.roomLabel}
                </option>
              ))}
            </select>
          </label>
          <label>
            Demo date and time (Europe/Dublin)
            <input name="effectiveLocal" type="datetime-local" disabled={disabled} />
          </label>
          <small>Leave the time blank to keep the current clock.</small>
          <div className="actions">
            <button type="submit" disabled={disabled}>
              Apply scenario
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={async () => {
                setBusy(true);
                try {
                  await sendJson(
                    "/api/demo/settings",
                    { expectedRevision: data.device.revision, resetClock: true },
                    "PATCH",
                  );
                  setMessage("Real clock restored; gate relocked.");
                } catch (failure) {
                  setMessage(failure instanceof Error ? failure.message : "Reset unavailable.");
                } finally {
                  setBusy(false);
                  refresh();
                }
              }}
            >
              Reset to real time
            </button>
          </div>
        </form>
      </section>
      <section className="panel stack">
        <h2>Assisted manual release</h2>
        <p>
          An explicit staff override. This records a manual authorization and reason; it does not
          approve a visit or increase its QR count.
        </p>
        <form
          className="stack"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const values = new FormData(form);
            await act({
              path: "/api/device/manual-release",
              body: {
                visitId: selectedId,
                reason: values.get("reason"),
                expectedRevision: data.device.revision,
                requestId: newRequestId(),
              },
            });
            form.reset();
            setSelectedId("");
          }}
        >
          <label>
            Visitor
            <select
              name="visitId"
              required
              value={selectedId}
              disabled={disabled}
              onChange={(event) => setSelectedId(event.target.value)}
            >
              <option value="">Select a visit</option>
              {data.visits.map((visit) => (
                <option key={visit.id} value={visit.id}>
                  {visit.visitorName} · {visit.destination.roomLabel} · {visit.state}
                </option>
              ))}
            </select>
          </label>
          {selected && (
            <p>
              Warning: {selected.state}. Visit destination: {selected.destination.companyLabel} /{" "}
              {selected.destination.roomLabel}. Override opens the selected device destination shown
              above. QR authorizations: {selected.qrAccessCount}; manual authorizations:{" "}
              {selected.manualReleaseCount}.
            </p>
          )}
          <label>
            Reason
            <input name="reason" required maxLength={200} disabled={disabled} />
          </label>
          <label className="check">
            <input type="checkbox" name="confirm" required disabled={disabled} />I confirm this
            manual override after checking the visitor and destination.
          </label>
          <button type="submit" disabled={disabled || !selected || remaining > 0}>
            Confirm manual release
          </button>
        </form>
      </section>
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
