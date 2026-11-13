"use client";

import { useEffect, useState } from "react";
import { requestJson } from "@/client/api";
import { usePolling } from "@/client/use-polling";
import { GateStatus, gateSnapshot } from "@/components/gate-status";
import { StaffSignIn } from "@/components/staff-sign-in";
import type { DeviceSnapshot } from "@/domain/device";

async function load(signal: AbortSignal) {
  const started = performance.now();
  return gateSnapshot(await requestJson<DeviceSnapshot>("/api/device", { signal }), started);
}

export function GateDisplay() {
  const { data, error, refresh } = usePolling(load);
  const [mode, setMode] = useState<"gate" | "elevator">("gate");
  useEffect(() => {
    setMode(
      new URLSearchParams(window.location.search).get("mode") === "elevator" ? "elevator" : "gate",
    );
  }, []);
  if (error?.status === 401) return <StaffSignIn onSignedIn={refresh} />;
  if (!data) return <p role="status">{error?.message ?? "Connecting to the simulated device…"}</p>;
  return (
    <div className="stack">
      <fieldset className="actions view-switch" aria-label="Device visualization">
        <button type="button" aria-pressed={mode === "gate"} onClick={() => setMode("gate")}>
          Gate
        </button>
        <button
          type="button"
          aria-pressed={mode === "elevator"}
          onClick={() => setMode("elevator")}
        >
          Elevator
        </button>
      </fieldset>
      <GateStatus snapshot={data} connectionError={error?.message} mode={mode} />
    </div>
  );
}
