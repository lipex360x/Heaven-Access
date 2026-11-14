"use client";

import { useEffect, useId, useState } from "react";
import { ACCESS_MESSAGES, type DeviceSnapshot } from "@/domain/device";

export type GateSnapshot = DeviceSnapshot & { deadline: number; feedbackDeadline: number };

export function gateSnapshot(snapshot: DeviceSnapshot, started: number): GateSnapshot {
  const serverNow = new Date(snapshot.device.serverNow).getTime();
  return {
    ...snapshot,
    deadline: started + new Date(snapshot.device.unlockedUntil).getTime() - serverNow,
    feedbackDeadline: snapshot.feedback
      ? started + new Date(snapshot.feedback.occurredAt).getTime() + 8000 - serverNow
      : 0,
  };
}

export function GateStatus({
  snapshot,
  connectionError,
  mode = "gate",
}: {
  snapshot: GateSnapshot;
  connectionError?: string;
  mode?: "gate" | "elevator";
}) {
  const clipId = useId();
  const [now, setNow] = useState(0);
  useEffect(() => {
    setNow(performance.now());
    const timer = setInterval(() => setNow(performance.now()), 100);
    return () => clearInterval(timer);
  }, []);
  const remaining = now ? Math.max(0, snapshot.deadline - now) : 0;
  const feedback = now && now < snapshot.feedbackDeadline ? snapshot.feedback : null;
  const denied = feedback && feedback.code !== "granted" && feedback.code !== "already_unlocked";
  const open = remaining > 0;
  const title = open
    ? "ACCESS GRANTED"
    : denied
      ? "ACCESS DENIED"
      : mode === "elevator"
        ? "ELEVATOR LOCKED"
        : "GATE LOCKED";
  const device = snapshot.device;
  return (
    <section
      className={`panel gate gate-display ${open ? "gate-open" : denied ? "gate-denied" : ""}`}
      aria-label="Simulated gate status"
    >
      <h2 className="gate-title" role="status" aria-live="polite" aria-atomic="true">
        {title}
      </h2>
      {mode === "gate" ? (
        <svg
          className="gate-illustration"
          viewBox="0 0 320 280"
          aria-hidden="true"
          focusable="false"
        >
          <rect x="30" y="207" width="40" height="65" rx="8" fill="currentColor" />
          <g className={`barrier-arm ${open ? "is-open" : ""}`}>
            <rect x="50" y="212" width="230" height="16" rx="8" fill="currentColor" />
          </g>
          <circle cx="50" cy="220" r="13" fill="currentColor" />
        </svg>
      ) : (
        <svg
          className="gate-illustration"
          viewBox="0 0 320 280"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <clipPath id={clipId}>
              <rect x="60" y="30" width="200" height="220" rx="4" />
            </clipPath>
          </defs>
          <rect
            x="52"
            y="22"
            width="216"
            height="236"
            rx="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
          />
          <g clipPath={`url(#${clipId})`}>
            <rect x="60" y="30" width="200" height="220" fill="currentColor" opacity="0.12" />
            <rect
              className={`elevator-door elevator-left ${open ? "is-open" : ""}`}
              x="60"
              y="30"
              width="100"
              height="220"
              fill="currentColor"
              opacity="0.8"
            />
            <rect
              className={`elevator-door elevator-right ${open ? "is-open" : ""}`}
              x="160"
              y="30"
              width="100"
              height="220"
              fill="currentColor"
              opacity="0.55"
            />
          </g>
        </svg>
      )}
      <p className="gate-detail">
        {open
          ? `Relocks in ${(remaining / 1000).toFixed(1)} real seconds`
          : denied
            ? ACCESS_MESSAGES[feedback.code]
            : "Waiting for an approved visitor QR."}
      </p>
      {connectionError && (
        <p role="alert">{connectionError} No new opening is confirmed. Waiting to reconnect.</p>
      )}
      <p>
        {device.destination.companyLabel} · {device.destination.roomLabel} · Floor{" "}
        {device.destination.floorLabel ?? "—"}
      </p>
      <small>
        Europe/Dublin:{" "}
        {new Intl.DateTimeFormat("en-IE", {
          timeZone: "Europe/Dublin",
          dateStyle: "medium",
          timeStyle: "medium",
        }).format(new Date(device.effectiveNow))}{" "}
        · {device.clockMode === "demo" ? "Advancing demo clock" : "Real clock"}
      </small>
      <small>
        Simulated {mode === "elevator" ? "elevator" : "gate"} · Access authorization, not measured
        physical passage
      </small>
    </section>
  );
}
