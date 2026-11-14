"use client";

import { useState } from "react";
import { ClientError, requestJson, sendJson } from "@/client/api";
import { usePolling } from "@/client/use-polling";
import type { Device } from "@/domain/device";
import { PRIVACY_NOTICE_VERSION, PRIVACY_SUMMARY } from "@/domain/privacy";

const load = (signal: AbortSignal) =>
  requestJson<{ destinations: Device["destination"][] }>("/api/destinations", { signal });

export function RegistrationForm() {
  const { data, error, refresh } = usePolling(load);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [uncertain, setUncertain] = useState(false);
  return (
    <form
      className="panel stack"
      onSubmit={async (event) => {
        event.preventDefault();
        if (busy || uncertain) return;
        const form = new FormData(event.currentTarget);
        setBusy(true);
        setMessage("");
        try {
          const made = await sendJson<{ visitorPath: string }>("/api/visits", {
            visitorName: form.get("visitorName"),
            destinationId: Number(form.get("destinationId")),
            scheduledLocal: form.get("scheduledLocal"),
            privacyAcknowledged: form.get("privacyAcknowledged") === "on",
            noticeVersion: PRIVACY_NOTICE_VERSION,
          });
          window.location.assign(made.visitorPath);
        } catch (failure) {
          if (!(failure instanceof ClientError) || failure.status >= 500) {
            setUncertain(true);
            setMessage(
              "We could not confirm your submission. A request may already exist. Please contact reception before trying again.",
            );
          } else setMessage(failure.message);
          setBusy(false);
        }
      }}
    >
      <p className="demo-note">Demonstration only. Use fictional visitor details.</p>
      <label>
        Your name
        <input
          name="visitorName"
          autoComplete="off"
          required
          maxLength={100}
          disabled={busy || uncertain}
        />
      </label>
      <label>
        Company / room
        <select
          name="destinationId"
          defaultValue=""
          required
          disabled={busy || uncertain || !data || !!error}
        >
          <option value="">Select your destination</option>
          {data?.destinations.map((destination) => (
            <option key={destination.id} value={destination.id}>
              {destination.companyLabel} · {destination.roomLabel} · Floor{" "}
              {destination.floorLabel ?? "—"}
            </option>
          ))}
        </select>
      </label>
      {error && (
        <div role="alert">
          Destinations could not be loaded.{" "}
          <button type="button" onClick={refresh}>
            Try loading destinations again
          </button>
        </div>
      )}
      <label>
        Visit date and time (Europe/Dublin)
        <input name="scheduledLocal" type="datetime-local" required disabled={busy || uncertain} />
      </label>
      <small>
        An approved pass is valid from 30 minutes before to 30 minutes after this time. All visit
        times use Europe/Dublin.
      </small>
      <div className="stack">
        <h2>Your information</h2>
        <p>{PRIVACY_SUMMARY}</p>
        <a href="/privacy" target="_blank" rel="noreferrer">
          Read privacy notice
        </a>
        <label className="check">
          <input name="privacyAcknowledged" type="checkbox" required disabled={busy || uncertain} />
          I have read the privacy notice.
        </label>
      </div>
      {message && <p role="alert">{message}</p>}
      <button type="submit" disabled={busy || uncertain || !data || !!error}>
        {busy ? "Submitting request…" : "Request visit"}
      </button>
      <p>
        Do not wish to submit, have no smartphone or need help? Ask reception for assisted access.
      </p>
    </form>
  );
}
