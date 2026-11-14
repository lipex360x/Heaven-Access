"use client";

import QRCode from "qrcode";
import { useCallback, useEffect, useRef, useState } from "react";
import { requestJson } from "@/client/api";
import { usePolling } from "@/client/use-polling";
import type { Device } from "@/domain/device";
import type { VisitState } from "@/domain/visit-time";

type Visit = {
  visitorName: string;
  destination: Device["destination"];
  state: VisitState;
  validFrom: string;
  validUntil: string;
  qrPayload?: string;
};
const LABELS: Record<VisitState, string> = {
  pending: "Awaiting approval",
  rejected: "Visit not approved",
  approved_early: "Approved · not valid yet",
  approved_valid: "Approved · ready for access",
  expired: "Pass expired",
};

function PassQr({ payload }: { payload: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    let current = true;
    setReady(false);
    setError(false);
    if (canvas.current)
      void QRCode.toCanvas(canvas.current, payload, {
        width: 360,
        margin: 4,
        errorCorrectionLevel: "M",
      })
        .then(() => {
          if (current) setReady(true);
        })
        .catch(() => {
          if (current) setError(true);
        });
    return () => {
      current = false;
    };
  }, [payload]);
  return (
    <div className="stack pass-qr">
      <canvas ref={canvas} role="img" aria-label="Visitor access QR code" />
      {error && <p role="alert">QR could not be displayed. Please ask reception for assistance.</p>}
      <button
        type="button"
        disabled={!ready}
        onClick={() => {
          if (!canvas.current) return;
          const link = document.createElement("a");
          link.download = "Heaven-Access-Pass.png";
          link.href = canvas.current.toDataURL("image/png");
          document.body.append(link);
          link.click();
          link.remove();
        }}
      >
        Download QR image
      </button>
      <small>The downloaded image works only during this visit's approved window.</small>
    </div>
  );
}

function AuthorizedPass({ capability }: { capability: string }) {
  const load = useCallback(
    (signal: AbortSignal) =>
      requestJson<{ visit: Visit }>("/api/visitor/visit", {
        signal,
        headers: { Authorization: `Bearer ${capability}` },
      }),
    [capability],
  );
  const { data, error } = usePolling(load);
  if (error?.status === 404)
    return <p role="alert">This private visitor link is unavailable. Please contact reception.</p>;
  if (!data) return <p role="status">{error?.message ?? "Loading your visit…"}</p>;
  const visit = data.visit;
  const time = (instant: string) =>
    new Intl.DateTimeFormat("en-IE", {
      timeZone: "Europe/Dublin",
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(instant));
  return (
    <section className="panel stack">
      <h2 role="status">{LABELS[visit.state]}</h2>
      <p>{visit.visitorName}</p>
      <p>
        {visit.destination.companyLabel} · {visit.destination.roomLabel} · Floor{" "}
        {visit.destination.floorLabel ?? "—"}
      </p>
      <p>
        Access window: {time(visit.validFrom)} – {time(visit.validUntil)} (Europe/Dublin)
      </p>
      {error && <p role="alert">{error.message} Access still requires server validation.</p>}
      {visit.qrPayload && (
        <>
          <PassQr payload={visit.qrPayload} />
          <p>Show this QR to the access reader. Keep your private pass link and QR to yourself.</p>
        </>
      )}
      {visit.state === "pending" && (
        <p>Reception must approve your visit. This page updates automatically.</p>
      )}
      {visit.state === "approved_early" && (
        <p>Your pass becomes usable when the access window starts.</p>
      )}
      {(visit.state === "expired" || visit.state === "rejected") && (
        <p>
          A new request and approval are required. <a href="/register">Request a new visit</a> or
          contact reception.
        </p>
      )}
      <p>No smartphone or difficulty using the pass? Ask reception for assisted access.</p>
    </section>
  );
}

export function VisitorPass() {
  const [capability, setCapability] = useState<string | null>(null);
  useEffect(() => {
    const read = () => setCapability(window.location.hash.slice(1));
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);
  if (capability === null) return <p role="status">Opening your private pass…</p>;
  if (!/^v_[A-Za-z0-9_-]{43}$/.test(capability))
    return <p role="alert">This private visitor link is unavailable. Please contact reception.</p>;
  return <AuthorizedPass key={capability} capability={capability} />;
}
