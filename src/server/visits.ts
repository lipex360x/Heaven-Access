import "server-only";
import { randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import { PRIVACY_NOTICE_VERSION } from "../domain/privacy";
import { type Decision, parseVisitTime, visitState, visitWindow } from "../domain/visit-time";
import { getDatabase, transaction } from "./database";
import { ApiError } from "./http";
import { hashSecret, newSecret } from "./secrets";

type VisitRow = {
  id: string;
  visitor_name: string;
  destination_id: number;
  scheduled_at: Date;
  decision: Decision;
  company_label: string;
  room_label: string;
  floor_label: string | null;
  created_at: Date;
  decided_at: Date | null;
  decision_by: number | null;
  revoked_at: Date | null;
  revoked_by: number | null;
  qr_secret: string | null;
  qr_count?: number;
  manual_count?: number;
};
const VISIT_COLUMNS = `v.id, v.visitor_name, v.destination_id, v.scheduled_at,
  CASE WHEN v.revoked_at IS NOT NULL THEN 'revoked' ELSE v.decision END AS decision,
  v.revoked_at, v.revoked_by,
  v.created_at, v.decided_at, v.decision_by, d.company_label, d.room_label, d.floor_label`;

export async function effectiveNow(
  client: PoolClient | ReturnType<typeof getDatabase> = getDatabase(),
) {
  const result = await client.query<{ now: Date }>(
    `SELECT clock_timestamp() + clock_offset_ms * interval '1 millisecond' AS now
     FROM demo_device WHERE id = 1`,
  );
  if (!result.rows[0]) throw new Error("Demo settings are not initialized");
  return result.rows[0].now;
}

function publicVisit(row: VisitRow, now: Date) {
  const { validFrom, validUntil } = visitWindow(row.scheduled_at);
  return {
    id: row.id,
    visitorName: row.visitor_name,
    destination: {
      id: row.destination_id,
      companyLabel: row.company_label,
      roomLabel: row.room_label,
      floorLabel: row.floor_label,
    },
    scheduledAt: row.scheduled_at.toISOString(),
    validFrom: validFrom.toISOString(),
    validUntil: validUntil.toISOString(),
    state: visitState(row.decision, row.scheduled_at, now),
    effectiveNow: now.toISOString(),
  };
}

export async function createVisit(input: Record<string, unknown>) {
  const { visitorName, destinationId, scheduledLocal, privacyAcknowledged, noticeVersion } = input;
  if (
    typeof visitorName !== "string" ||
    visitorName.trim().length < 1 ||
    visitorName.trim().length > 100 ||
    [...visitorName].some((character) => {
      const code = character.charCodeAt(0);
      return code < 32 || (code >= 127 && code <= 159);
    }) ||
    typeof destinationId !== "number" ||
    !Number.isInteger(destinationId) ||
    destinationId < 1 ||
    destinationId > 2147483647 ||
    typeof scheduledLocal !== "string" ||
    privacyAcknowledged !== true ||
    noticeVersion !== PRIVACY_NOTICE_VERSION
  ) {
    throw new ApiError(
      "invalid_input",
      400,
      "Check the name, destination, date/time and privacy acknowledgement.",
    );
  }
  let scheduledAt: Date;
  try {
    scheduledAt = parseVisitTime(scheduledLocal);
  } catch {
    throw new ApiError(
      "invalid_input",
      400,
      "Choose an unambiguous, valid local date/time in Europe/Dublin.",
    );
  }
  const token = newSecret("v_");
  const id = randomUUID();
  const result = await getDatabase().query(
    `INSERT INTO visits (id, visitor_name, destination_id, scheduled_at, notice_version, visitor_secret_hash)
     SELECT $1, $2, id, $4, $5, $6 FROM destinations WHERE id = $3 RETURNING id`,
    [id, visitorName.trim(), destinationId, scheduledAt, noticeVersion, hashSecret(token)],
  );
  if (result.rowCount !== 1)
    throw new ApiError("invalid_input", 400, "Choose an available destination.");
  return { visitId: id, visitorPath: `/pass#${token}`, decision: "pending" };
}

export async function ownVisit(authorization: string | null) {
  const token = authorization?.match(/^Bearer (v_[A-Za-z0-9_-]{43})$/)?.[1];
  if (!token) throw new ApiError("invalid_link", 404, "Visitor link is unavailable.");
  const result = await getDatabase().query<VisitRow>(
    `SELECT ${VISIT_COLUMNS}, v.qr_secret FROM visits v
     JOIN destinations d ON d.id = v.destination_id WHERE v.visitor_secret_hash = $1`,
    [hashSecret(token)],
  );
  const row = result.rows[0];
  if (!row) throw new ApiError("invalid_link", 404, "Visitor link is unavailable.");
  const visit = publicVisit(row, await effectiveNow());
  const canShowQr = visit.state === "approved_valid" || visit.state === "approved_early";
  return { visit: { ...visit, ...(canShowQr ? { qrPayload: row.qr_secret } : {}) } };
}

export async function staffVisits() {
  const result = await getDatabase().query<VisitRow>(
    `SELECT ${VISIT_COLUMNS},
       (SELECT count(*)::int FROM access_events e WHERE e.visit_id = v.id AND e.method = 'qr') AS qr_count,
       (SELECT count(*)::int FROM access_events e WHERE e.visit_id = v.id AND e.method = 'manual') AS manual_count
     FROM visits v JOIN destinations d ON d.id = v.destination_id ORDER BY v.created_at DESC LIMIT 200`,
  );
  const now = await effectiveNow();
  return {
    visits: result.rows.map((row) => ({
      ...publicVisit(row, now),
      decision: row.decision,
      createdAt: row.created_at.toISOString(),
      decidedAt: row.decided_at?.toISOString() ?? null,
      decisionBy: row.decision_by,
      revokedAt: row.revoked_at?.toISOString() ?? null,
      revokedBy: row.revoked_by,
      qrAccessCount: row.qr_count,
      manualReleaseCount: row.manual_count,
    })),
  };
}

export async function decideVisit(id: string, decision: unknown, staffId: number) {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) ||
    (decision !== "approve" && decision !== "reject")
  ) {
    throw new ApiError("invalid_input", 400, "Choose a visit and approve or reject.");
  }
  return transaction(async (client) => {
    // Shared lock order: device/settings first, then visit. #9 must use the same order.
    await client.query("SELECT id FROM demo_device WHERE id = 1 FOR SHARE");
    const result = await client.query<{ decision: Decision; scheduled_at: Date }>(
      "SELECT decision, scheduled_at FROM visits WHERE id = $1 FOR UPDATE",
      [id],
    );
    const row = result.rows[0];
    if (!row) throw new ApiError("invalid_input", 404, "Visit not found.");
    if (row.decision !== "pending")
      throw new ApiError("conflict", 409, "This visit has already been reviewed.");
    const now = await effectiveNow(client);
    if (now > visitWindow(row.scheduled_at).validUntil) {
      throw new ApiError("expired", 409, "This visit has expired. A new request is required.");
    }
    const state = decision === "approve" ? "approved" : "rejected";
    await client.query(
      `UPDATE visits SET decision = $2, decision_by = $3, decided_at = clock_timestamp(), qr_secret = $4
       WHERE id = $1`,
      [id, state, staffId, state === "approved" ? newSecret("haqr_") : null],
    );
    return { visitId: id, decision: state };
  });
}

export async function revokeVisit(id: string, staffId: number) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))
    throw new ApiError("invalid_input", 400, "Choose an approved visit to revoke.");
  return transaction(async (client) => {
    // Serialize against scans using the same device → visit lock order.
    // An already granted opening keeps its original real-time deadline.
    await client.query("SELECT id FROM demo_device WHERE id = 1 FOR UPDATE");
    const result = await client.query<{ decision: Decision }>(
      "SELECT decision FROM visits WHERE id = $1 FOR UPDATE",
      [id],
    );
    const visit = result.rows[0];
    if (!visit) throw new ApiError("invalid_input", 404, "Visit not found.");
    if (visit.decision !== "approved")
      throw new ApiError("conflict", 409, "Only an approved visit can be revoked.");
    // Repeating an uncertain request must preserve the first revocation actor/time.
    await client.query(
      `UPDATE visits SET revoked_at = clock_timestamp(), revoked_by = $2
       WHERE id = $1 AND revoked_at IS NULL`,
      [id, staffId],
    );
    return { visitId: id, decision: "revoked" };
  });
}
