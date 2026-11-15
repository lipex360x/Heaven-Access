"use client";

import { useState } from "react";
import { ClientError, newRequestId, requestJson, sendJson } from "@/client/api";
import { usePolling } from "@/client/use-polling";
import { StaffSignIn } from "@/components/staff-sign-in";
import { ACCESS_MESSAGES, type AccessResult, type DeviceSnapshot } from "@/domain/device";
import type { Decision, VisitState } from "@/domain/visit-time";

type Visit = {
  id: string;
  visitorName: string;
  destination: DeviceSnapshot["device"]["destination"];
  scheduledAt: string;
  state: VisitState;
  decision: Decision;
  revokedAt: string | null;
  revokedBy: number | null;
  qrAccessCount: number;
  manualReleaseCount: number;
};
type ManualAction = {
  visitId: string;
  reason: string;
  expectedRevision: number;
  requestId: string;
};
const LABELS: Record<VisitState, string> = {
  pending: "Pending approval",
  rejected: "Rejected",
  revoked: "Access revoked",
  approved_early: "Approved · not valid yet",
  approved_valid: "Approved · valid now",
  expired: "Expired",
};
const time = (instant: string) =>
  new Intl.DateTimeFormat("en-IE", {
    timeZone: "Europe/Dublin",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(instant));

async function load(signal: AbortSignal) {
  const session = await requestJson<{ staff: { username: string } }>("/api/staff/session", {
    signal,
  });
  const { visits } = await requestJson<{ visits: Visit[] }>("/api/staff/visits", { signal });
  const { device } = await requestJson<DeviceSnapshot>("/api/device", { signal });
  return { visits, device, staff: session.staff };
}

export function Reception() {
  const { data, error, refresh } = usePolling(load);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [manualId, setManualId] = useState<string | null>(null);
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [retry, setRetry] = useState<ManualAction | null>(null);
  const [filter, setFilter] = useState("all");
  async function manual(action: ManualAction) {
    setBusy(true);
    setMessage("");
    try {
      const result = await sendJson<AccessResult>("/api/device/manual-release", action);
      setMessage(ACCESS_MESSAGES[result.code]);
      setRetry(null);
      setManualId(null);
    } catch (failure) {
      setMessage(failure instanceof Error ? failure.message : "Manual release unavailable.");
      if (!(failure instanceof ClientError) || failure.status >= 500) setRetry(action);
      else setRetry(null);
    } finally {
      setBusy(false);
      refresh();
    }
  }
  if (error?.status === 401) return <StaffSignIn onSignedIn={refresh} />;
  if (!data) return <p role="status">{error?.message ?? "Loading reception…"}</p>;
  const disabled = busy || !!error || !!retry;
  const visits = data.visits.filter(
    (visit) =>
      filter === "all" ||
      (filter === "pending" ? visit.state === "pending" : visit.decision === filter),
  );
  return (
    <div className="stack">
      <div className="actions">
        <a href="/register" target="_blank" rel="noreferrer">
          New visitor request
        </a>
        <a href="/device">Camera and demonstration controls</a>
        <a href="/device/reader">Dedicated QR reader</a>
        <a href="/device/display" target="_blank" rel="noreferrer">
          Open gate / elevator display
        </a>
      </div>
      <p>
        Signed in as {data.staff.username}. Current device: {data.device.destination.companyLabel} /{" "}
        {data.device.destination.roomLabel}.{" "}
        {data.device.clockMode === "demo" ? "Demo clock" : "Real clock"}:{" "}
        {time(data.device.effectiveNow)} (Europe/Dublin).
      </p>
      {error && (
        <p role="alert">{error.message} Actions are paused until the connection recovers.</p>
      )}
      {message && (
        <p className="action-feedback" role="status">
          {message}
        </p>
      )}
      {retry && (
        <div className="panel stack">
          <p>
            The manual release outcome is uncertain. Retry the same action to recover its result
            without recording another opening.
          </p>
          <button type="button" disabled={busy} onClick={() => void manual(retry)}>
            Retry previous manual release
          </button>
        </div>
      )}
      <label>
        Show visits
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">All recent visits</option>
          <option value="pending">Pending approval</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="revoked">Revoked</option>
        </select>
      </label>
      <p>
        Latest {data.visits.length} visits (up to 200). Counts are successful authorizations, not a
        count of people inside.
      </p>
      {visits.length === 0 && <p role="status">No visits to show.</p>}
      {visits.map((visit) => (
        <article
          className="panel stack"
          key={visit.id}
          aria-label={`Visit for ${visit.visitorName}`}
        >
          <div>
            <h2>{visit.visitorName}</h2>
            <p className={`visit-state ${visit.state === "pending" ? "state-pending" : ""}`}>
              {LABELS[visit.state]}
            </p>
          </div>
          <p>
            {visit.destination.companyLabel} · {visit.destination.roomLabel} · Floor{" "}
            {visit.destination.floorLabel ?? "—"}
          </p>
          <p>Scheduled: {time(visit.scheduledAt)} (Europe/Dublin)</p>
          <p>
            QR authorizations: <strong>{visit.qrAccessCount}</strong> · Manual authorizations:{" "}
            <strong>{visit.manualReleaseCount}</strong>
          </p>
          {visit.state === "pending" && (
            <div className="actions">
              {(["approve", "reject"] as const).map((decision) => (
                <button
                  key={decision}
                  type="button"
                  disabled={disabled}
                  onClick={async () => {
                    setBusy(true);
                    setMessage("");
                    try {
                      await sendJson(`/api/staff/visits/${visit.id}/decision`, { decision });
                      setMessage(
                        `Visit for ${visit.visitorName} ${decision === "approve" ? "approved" : "rejected"}.`,
                      );
                    } catch (failure) {
                      setMessage(
                        failure instanceof Error
                          ? failure.message
                          : "Could not confirm the decision. Check the refreshed visit state before trying again.",
                      );
                    } finally {
                      setBusy(false);
                      refresh();
                    }
                  }}
                >
                  {decision === "approve" ? "Approve" : "Reject"}
                </button>
              ))}
            </div>
          )}
          {visit.state === "expired" && (
            <p>A new request and approval are required; this visit cannot be renewed.</p>
          )}
          {visit.revokedAt && (
            <p>
              Revoked: {time(visit.revokedAt)} (Europe/Dublin) · Staff #{visit.revokedBy}.
            </p>
          )}
          {visit.decision === "approved" && (
            <button
              type="button"
              className="danger-button"
              disabled={disabled}
              aria-expanded={revokeId === visit.id}
              onClick={() => setRevokeId(revokeId === visit.id ? null : visit.id)}
            >
              Revoke access
            </button>
          )}
          {visit.decision === "approved" && revokeId === visit.id && (
            <form
              className="stack manual-warning"
              onSubmit={async (event) => {
                event.preventDefault();
                setBusy(true);
                setMessage("");
                try {
                  await sendJson(`/api/staff/visits/${visit.id}/revoke`, {});
                  setMessage(
                    `Access for ${visit.visitorName} revoked. Saved QR images no longer authorize entry.`,
                  );
                  setRevokeId(null);
                } catch (failure) {
                  setMessage(
                    failure instanceof Error
                      ? failure.message
                      : "Check the refreshed visit before trying again.",
                  );
                } finally {
                  setBusy(false);
                  refresh();
                }
              }}
            >
              <p>
                This blocks future QR access, including downloaded images. An opening already
                granted finishes normally. A new request is required for approval again.
              </p>
              <label className="check">
                <input type="checkbox" required disabled={disabled} />I confirm revocation for{" "}
                {visit.visitorName}.
              </label>
              <div className="actions">
                <button className="danger-button" type="submit" disabled={disabled}>
                  Confirm revocation
                </button>
                <button type="button" disabled={busy} onClick={() => setRevokeId(null)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
          <button
            type="button"
            disabled={disabled}
            aria-expanded={manualId === visit.id}
            onClick={() => setManualId(manualId === visit.id ? null : visit.id)}
          >
            Assisted manual release
          </button>
          {manualId === visit.id && (
            <form
              className="stack manual-warning"
              onSubmit={(event) => {
                event.preventDefault();
                const values = new FormData(event.currentTarget);
                void manual({
                  visitId: visit.id,
                  reason: String(values.get("reason")),
                  expectedRevision: data.device.revision,
                  requestId: newRequestId(),
                });
              }}
            >
              <p>
                <strong>Manual override:</strong> this visit is {LABELS[visit.state].toLowerCase()}.
                It opens {data.device.destination.companyLabel} /{" "}
                {data.device.destination.roomLabel}, even if normal QR access is unavailable. It
                does not approve or renew this visit.
              </p>
              <label>
                Reason
                <input name="reason" required maxLength={200} disabled={disabled} />
              </label>
              <label className="check">
                <input type="checkbox" required disabled={disabled} />I checked the visitor and
                device destination and confirm this override.
              </label>
              <button type="submit" disabled={disabled || data.device.state === "unlocked"}>
                Confirm manual release
              </button>
            </form>
          )}
        </article>
      ))}
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await sendJson("/api/staff/logout", {});
            setRetry(null);
            setManualId(null);
            setRevokeId(null);
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
