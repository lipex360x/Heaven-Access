import "server-only";
import { randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import type { AccessCode, AccessResult, Device } from "../domain/device";
import { type Decision, parseVisitTime, visitState } from "../domain/visit-time";
import { getDatabase, transaction } from "./database";
import { ApiError } from "./http";
import { hashSecret } from "./secrets";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const validRevision = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0;

export async function readDevice(
  client: PoolClient | ReturnType<typeof getDatabase> = getDatabase(),
): Promise<Device> {
  const result = await client.query<{
    id: number;
    destination_id: number;
    company_label: string;
    room_label: string;
    floor_label: string | null;
    revision: number;
    unlocked_until: Date;
    clock_offset_ms: string;
    now: Date;
  }>(`SELECT x.*, d.company_label, d.room_label, d.floor_label, clock_timestamp() AS now
      FROM demo_device x JOIN destinations d ON d.id = x.destination_id WHERE x.id = 1`);
  const row = result.rows[0];
  if (!row) throw new Error("Device is not initialized");
  return {
    id: row.id,
    destination: {
      id: row.destination_id,
      companyLabel: row.company_label,
      roomLabel: row.room_label,
      floorLabel: row.floor_label,
    },
    revision: row.revision,
    state: row.unlocked_until > row.now ? "unlocked" : "locked",
    unlockedUntil: row.unlocked_until.toISOString(),
    serverNow: row.now.toISOString(),
    effectiveNow: new Date(row.now.getTime() + Number(row.clock_offset_ms)).toISOString(),
    clockMode: Number(row.clock_offset_ms) === 0 ? "real" : "demo",
  };
}

export async function accessDevice(
  input: Record<string, unknown>,
  staffId: number,
  method: "qr" | "manual",
): Promise<AccessResult> {
  const { requestId, expectedRevision, qrPayload, visitId, reason } = input;
  if (typeof requestId !== "string" || !UUID.test(requestId) || !validRevision(expectedRevision)) {
    throw new ApiError("invalid_input", 400, "Send a request ID and the current device revision.");
  }
  if (method === "qr" && (typeof qrPayload !== "string" || qrPayload.length > 4096)) {
    throw new ApiError("invalid_input", 400, "Send the decoded QR data.");
  }
  if (
    method === "manual" &&
    (typeof visitId !== "string" ||
      !UUID.test(visitId) ||
      typeof reason !== "string" ||
      reason.trim().length < 1 ||
      reason.trim().length > 200 ||
      [...reason].some((character) => {
        const code = character.charCodeAt(0);
        return code < 32 || (code >= 127 && code <= 159);
      }))
  ) {
    throw new ApiError(
      "invalid_input",
      400,
      "Select a visit and enter a short manual-release reason.",
    );
  }
  const inputHash = hashSecret(
    JSON.stringify([
      method,
      staffId,
      expectedRevision,
      method === "qr" ? qrPayload : [visitId, (reason as string).trim()],
    ]),
  );
  return transaction(async (client) => {
    // All device/settings/decision operations take the device lock before a visit lock.
    await client.query("SELECT id FROM demo_device WHERE id = 1 FOR UPDATE");
    const previous = await client.query<{ input_hash: string; response: AccessResult }>(
      "SELECT input_hash, response FROM device_requests WHERE request_id = $1",
      [requestId],
    );
    if (previous.rows[0]) {
      if (previous.rows[0].input_hash !== inputHash)
        throw new ApiError("conflict", 409, "This request ID belongs to another action.");
      return previous.rows[0].response;
    }
    const device = await readDevice(client); // Sample time after acquiring the lock, including lock waits.
    const finish = async (code: AccessCode, state = device) => {
      const response = { code, device: state };
      await client.query(
        "INSERT INTO device_requests (request_id, staff_id, input_hash, response) VALUES ($1, $2, $3, $4)",
        [requestId, staffId, inputHash, JSON.stringify(response)],
      );
      return response;
    };
    if (expectedRevision !== device.revision) return finish("stale_device_state");
    if (device.state === "unlocked") return finish("already_unlocked");
    if (method === "qr" && !/^haqr_[A-Za-z0-9_-]{43}$/.test(qrPayload as string))
      return finish("invalid_qr");
    const found = await client.query<{
      id: string;
      decision: Decision;
      scheduled_at: Date;
      destination_id: number;
    }>(
      `SELECT id, decision, scheduled_at, destination_id FROM visits WHERE ${method === "qr" ? "qr_secret" : "id"} = $1 FOR UPDATE`,
      [method === "qr" ? qrPayload : visitId],
    );
    const visit = found.rows[0];
    if (!visit) {
      if (method === "qr") return finish("invalid_qr");
      throw new ApiError("invalid_input", 404, "Visit not found.");
    }
    // Re-sample after a possible visit-lock wait; use real time for the opening/audit.
    const current = await readDevice(client);
    if (method === "qr") {
      if (visit.decision !== "approved") return finish("not_approved", current);
      const state = visitState(visit.decision, visit.scheduled_at, new Date(current.effectiveNow));
      if (state === "expired") return finish("expired", current);
      if (state === "approved_early") return finish("too_early", current);
      if (visit.destination_id !== current.destination.id)
        return finish("wrong_destination", current);
    }
    const deadline = new Date(new Date(current.serverNow).getTime() + 5000);
    await client.query("UPDATE demo_device SET unlocked_until = $1 WHERE id = 1", [deadline]);
    await client.query(
      `INSERT INTO access_events
      (id, visit_id, device_id, method, occurred_at, effective_at, destination_id, staff_id, reason, request_id)
      VALUES ($1, $2, 1, $3, $4, $5, $6, $7, $8, $9)`,
      [
        randomUUID(),
        visit.id,
        method,
        current.serverNow,
        current.effectiveNow,
        current.destination.id,
        staffId,
        method === "manual" ? (reason as string).trim() : null,
        requestId,
      ],
    );
    return finish("granted", {
      ...current,
      state: "unlocked",
      unlockedUntil: deadline.toISOString(),
    });
  });
}

export async function changeSettings(input: Record<string, unknown>) {
  const { expectedRevision, destinationId, effectiveLocal, resetClock } = input;
  if (
    !validRevision(expectedRevision) ||
    (destinationId !== undefined &&
      (typeof destinationId !== "number" ||
        !Number.isInteger(destinationId) ||
        destinationId < 1 ||
        destinationId > 2147483647)) ||
    (resetClock !== undefined && resetClock !== true) ||
    (effectiveLocal !== undefined && (typeof effectiveLocal !== "string" || resetClock === true)) ||
    (destinationId === undefined && effectiveLocal === undefined && resetClock !== true)
  ) {
    throw new ApiError(
      "invalid_input",
      400,
      "Choose a destination, Dublin demo time or real-time reset with the current revision.",
    );
  }
  let instant: Date | undefined;
  if (typeof effectiveLocal === "string") {
    try {
      instant = parseVisitTime(effectiveLocal);
    } catch {
      throw new ApiError(
        "invalid_input",
        400,
        "Choose a valid, unambiguous Europe/Dublin date/time.",
      );
    }
  }
  return transaction(async (client) => {
    await client.query("SELECT id FROM demo_device WHERE id = 1 FOR UPDATE");
    const device = await readDevice(client);
    if (device.revision !== expectedRevision)
      throw new ApiError("stale_device_state", 409, "The scenario changed. Refresh first.");
    if (
      destinationId !== undefined &&
      !(await client.query("SELECT id FROM destinations WHERE id = $1", [destinationId])).rowCount
    ) {
      throw new ApiError("invalid_input", 400, "Choose an available destination.");
    }
    await client.query(
      `UPDATE demo_device SET destination_id = COALESCE($1, destination_id),
      clock_offset_ms = CASE WHEN $2 THEN 0 WHEN $3::timestamptz IS NOT NULL
        THEN round(extract(epoch FROM ($3::timestamptz - clock_timestamp())) * 1000)::bigint ELSE clock_offset_ms END,
      revision = revision + 1, unlocked_until = 'epoch' WHERE id = 1`,
      [destinationId ?? null, resetClock === true, instant ?? null],
    );
    return { device: await readDevice(client) };
  });
}
