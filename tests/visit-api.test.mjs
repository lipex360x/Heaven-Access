import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import test from "node:test";
import pg from "pg";

const base = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";
const databaseUrl = new URL(process.env.DATABASE_URL);
if (
  !["127.0.0.1", "localhost"].includes(databaseUrl.hostname) ||
  !["127.0.0.1", "localhost"].includes(new URL(base).hostname) ||
  databaseUrl.pathname !== "/heaven_access"
) {
  throw new Error(
    "Run integration checks only against the disposable local Heaven Access database/server.",
  );
}

test("visit and authentication HTTP boundaries", async (t) => {
  const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();
  const fixture = `api-test-${randomUUID()}`;
  const staff = await db.query(
    `INSERT INTO staff_accounts (username, password_hash)
     SELECT $1, password_hash FROM staff_accounts WHERE username = 'reception' RETURNING id`,
    [fixture],
  );
  const staffId = staff.rows[0].id;
  const clock = (await db.query("SELECT clock_offset_ms FROM demo_device WHERE id = 1")).rows[0]
    .clock_offset_ms;
  let cookie;
  let created;
  let capability;
  let qr;
  const request = async (path, body, options = {}) => {
    const response = await fetch(`${base}${path}`, {
      method: body === undefined ? "GET" : "POST",
      headers: {
        ...(body === undefined ? {} : { "Content-Type": "application/json", Origin: base }),
        ...(cookie ? { Cookie: cookie } : {}),
        ...options,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    return { response, data: await response.json() };
  };
  const payload = {
    visitorName: fixture,
    destinationId: 1,
    scheduledLocal: "2026-11-13T12:00",
    privacyAcknowledged: true,
    noticeVersion: "demo-2026-11-13",
  };
  const setClock = async (iso) =>
    db.query(
      "UPDATE demo_device SET clock_offset_ms = round(extract(epoch FROM ($1::timestamptz - clock_timestamp())) * 1000) WHERE id = 1",
      [iso],
    );
  const count = async () =>
    Number(
      (await db.query("SELECT count(*) FROM visits WHERE visitor_name = $1", [fixture])).rows[0]
        .count,
    );
  try {
    await setClock("2026-11-13T12:00:00Z");
    await t.test("no acknowledgement, stale notice and invalid fields never persist", async () => {
      for (const patch of [
        { privacyAcknowledged: false },
        { privacyAcknowledged: undefined },
        { noticeVersion: "old" },
        { destinationId: 2147483647 },
        { scheduledLocal: "2026-10-25T01:30" },
        { decision: "approved" },
      ]) {
        const { response } = await request("/api/visits", { ...payload, ...patch });
        assert.equal(response.status, 400);
      }
      assert.equal(await count(), 0);
      assert.equal(
        (await request("/api/visits", payload, { Origin: "https://other.invalid" })).response
          .status,
        403,
      );
      assert.equal(
        (await request("/api/visits", { ...payload, visitorName: "x".repeat(9000) })).response
          .status,
        413,
      );
      assert.equal(await count(), 0);
    });
    await t.test(
      "creation is pending and the private link does not grant staff access",
      async () => {
        const result = await request("/api/visits", payload);
        assert.equal(result.response.status, 201);
        created = result.data.visitId;
        capability = result.data.visitorPath.split("#")[1];
        assert.equal(result.data.decision, "pending");
        const own = await request("/api/visitor/visit", undefined, {
          Authorization: `Bearer ${capability}`,
        });
        assert.equal(own.data.visit.state, "pending");
        assert.equal("qrPayload" in own.data.visit, false);
        assert.equal(
          (await request("/api/staff/visits", undefined, { Authorization: `Bearer ${capability}` }))
            .response.status,
          401,
        );
        assert.equal(
          (await request(`/api/staff/visits/${created}/decision`, { decision: "approve" })).response
            .status,
          401,
        );
        const row = (
          await db.query(
            "SELECT visitor_secret_hash, acknowledged_at, notice_version FROM visits WHERE id = $1",
            [created],
          )
        ).rows[0];
        assert.equal(
          row.visitor_secret_hash,
          createHash("sha256").update(capability).digest("hex"),
        );
        assert.equal(row.notice_version, payload.noticeVersion);
        assert.ok(Math.abs(Date.now() - row.acknowledged_at.getTime()) < 10000);
      },
    );
    await t.test("login rotates to an HttpOnly session stored only as a hash", async () => {
      assert.equal(
        (await request("/api/staff/login", { username: fixture, password: "wrong" })).response
          .status,
        401,
      );
      assert.equal(
        (await request("/api/staff/login", { username: "missing", password: "wrong" })).response
          .status,
        401,
      );
      assert.equal(
        (
          await request(
            "/api/staff/login",
            { username: fixture, password: "HeavenDemo-2026!" },
            { Origin: "https://other.invalid" },
          )
        ).response.status,
        403,
      );
      const result = await request("/api/staff/login", {
        username: fixture,
        password: "HeavenDemo-2026!",
      });
      assert.equal(result.response.status, 200);
      const header = result.response.headers.get("set-cookie");
      assert.match(header, /HttpOnly/i);
      assert.match(header, /SameSite=lax/i);
      cookie = header.split(";")[0];
      const secret = cookie.slice(cookie.indexOf("=") + 1);
      const stored = (
        await db.query("SELECT secret_hash FROM staff_sessions WHERE staff_id = $1", [staffId])
      ).rows[0].secret_hash;
      assert.equal(stored, createHash("sha256").update(secret).digest("hex"));
      assert.equal(Object.keys(result.data).join(","), "staff");
      assert.equal((await request("/api/staff/session")).response.status, 200);
      const previousCookie = cookie;
      const rotated = await request("/api/staff/login", {
        username: fixture,
        password: "HeavenDemo-2026!",
      });
      cookie = rotated.response.headers.get("set-cookie").split(";")[0];
      assert.ok(cookie !== previousCookie, "A new login must rotate the session");
      assert.equal(
        (await request("/api/staff/session", undefined, { Cookie: previousCookie })).response
          .status,
        401,
      );
      assert.equal((await request("/api/staff/session")).response.status, 200);
    });
    await t.test("visitor endpoints stay isolated even with a staff cookie", async () => {
      assert.equal((await request("/api/visitor/visit")).response.status, 404);
      const second = await request("/api/visits", { ...payload, visitorName: `${fixture}-second` });
      const own = await request("/api/visitor/visit", undefined, {
        Authorization: `Bearer ${second.data.visitorPath.split("#")[1]}`,
      });
      assert.equal(own.data.visit.visitorName, `${fixture}-second`);
      assert.equal("visits" in own.data, false);
      assert.equal("decisionBy" in own.data.visit, false);
    });
    await t.test("concurrent decisions permit exactly one transition", async () => {
      const attempts = await Promise.all([
        request(`/api/staff/visits/${created}/decision`, { decision: "approve" }),
        request(`/api/staff/visits/${created}/decision`, { decision: "reject" }),
      ]);
      assert.deepEqual(attempts.map((x) => x.response.status).sort(), [200, 409]);
      // Use another visit if rejection won the race, to exercise QR delivery as well.
      if (attempts.find((x) => x.response.status === 200).data.decision !== "approved") {
        const next = await request("/api/visits", payload);
        created = next.data.visitId;
        capability = next.data.visitorPath.split("#")[1];
        assert.equal(
          (await request(`/api/staff/visits/${created}/decision`, { decision: "approve" })).response
            .status,
          200,
        );
      }
      const own = await request("/api/visitor/visit", undefined, {
        Authorization: `Bearer ${capability}`,
      });
      assert.equal(own.data.visit.state, "approved_valid");
      qr = own.data.visit.qrPayload;
      assert.ok(qr.startsWith("haqr_"));
      assert.equal(
        (await request("/api/visitor/visit", undefined, { Authorization: `Bearer ${qr}` })).response
          .status,
        404,
      );
      assert.equal(
        (await request(`/api/staff/visits/${created}/decision`, { decision: "approve" })).response
          .status,
        409,
      );
      const refreshed = await request("/api/visitor/visit", undefined, {
        Authorization: `Bearer ${capability}`,
      });
      assert.ok(refreshed.data.visit.qrPayload === qr, "Refresh must preserve the existing QR");
      const listed = await request("/api/staff/visits");
      assert.equal(listed.response.headers.get("cache-control"), "no-store");
      const text = JSON.stringify(listed.data);
      assert.ok(
        !text.includes(qr) && !text.includes(capability),
        "Staff list must not expose capabilities",
      );
      const row = listed.data.visits.find((v) => v.id === created);
      assert.equal(row.qrAccessCount, 0);
      assert.equal(row.manualReleaseCount, 0);
    });
    await t.test("rejected visits never expose a QR and cannot be approved later", async () => {
      const rejected = await request("/api/visits", payload);
      const id = rejected.data.visitId;
      assert.equal(
        (await request(`/api/staff/visits/${id}/decision`, { decision: "reject" })).response.status,
        200,
      );
      const own = await request("/api/visitor/visit", undefined, {
        Authorization: `Bearer ${rejected.data.visitorPath.split("#")[1]}`,
      });
      assert.equal(own.data.visit.state, "rejected");
      assert.equal("qrPayload" in own.data.visit, false);
      assert.equal(
        (await request(`/api/staff/visits/${id}/decision`, { decision: "approve" })).response
          .status,
        409,
      );
    });
    await t.test("staff summaries separate QR and manual authorization counts", async () => {
      // Database fixtures verify summary semantics; no device unlock is claimed here.
      for (const method of ["qr", "qr", "manual"]) {
        await db.query(
          `INSERT INTO access_events (id, visit_id, device_id, method, effective_at, destination_id, staff_id, reason, request_id)
           VALUES ($1, $2, 1, $3, clock_timestamp(), 1, $4, $5, $6)`,
          [
            randomUUID(),
            created,
            method,
            method === "manual" ? staffId : null,
            method === "manual" ? "Synthetic summary fixture" : null,
            randomUUID(),
          ],
        );
      }
      const listed = await request("/api/staff/visits");
      const row = listed.data.visits.find((v) => v.id === created);
      assert.equal(row.qrAccessCount, 2);
      assert.equal(row.manualReleaseCount, 1);
    });
    await t.test(
      "expiry hides QR, blocks old decisions, and a new approval does not renew it",
      async () => {
        const pending = await request("/api/visits", payload);
        await setClock("2026-11-13T13:00:00Z");
        assert.equal(
          (
            await request(`/api/staff/visits/${pending.data.visitId}/decision`, {
              decision: "approve",
            })
          ).response.status,
          409,
        );
        const expired = await request("/api/visitor/visit", undefined, {
          Authorization: `Bearer ${capability}`,
        });
        assert.equal(expired.data.visit.state, "expired");
        assert.equal("qrPayload" in expired.data.visit, false);
        const next = await request("/api/visits", {
          ...payload,
          scheduledLocal: "2026-11-13T13:00",
        });
        assert.equal(
          (
            await request(`/api/staff/visits/${next.data.visitId}/decision`, {
              decision: "approve",
            })
          ).response.status,
          200,
        );
        assert.equal(
          (
            await request("/api/visitor/visit", undefined, {
              Authorization: `Bearer ${capability}`,
            })
          ).data.visit.state,
          "expired",
        );
        assert.equal((await request("/api/staff/session")).response.status, 200);
      },
    );
    await t.test(
      "logout invalidates a copied cookie and real expiry ignores the demo clock",
      async () => {
        assert.equal(
          (await request("/api/staff/logout", {}, { Origin: "https://other.invalid" })).response
            .status,
          403,
        );
        assert.equal((await request("/api/staff/session")).response.status, 200);
        assert.equal((await request("/api/staff/logout", {})).response.status, 200);
        assert.equal((await request("/api/staff/visits")).response.status, 401);
        const login = await request("/api/staff/login", {
          username: fixture,
          password: "HeavenDemo-2026!",
        });
        cookie = login.response.headers.get("set-cookie").split(";")[0];
        await db.query(
          "UPDATE staff_sessions SET expires_at = clock_timestamp() - interval '1 second' WHERE staff_id = $1",
          [staffId],
        );
        await setClock("2026-01-01T00:00:00Z");
        assert.equal((await request("/api/staff/visits")).response.status, 401);
      },
    );
  } finally {
    await db.query(
      `DELETE FROM access_events WHERE visit_id IN
       (SELECT id FROM visits WHERE visitor_name = $1 OR visitor_name = $2)`,
      [fixture, `${fixture}-second`],
    );
    await db.query("DELETE FROM visits WHERE visitor_name = $1 OR visitor_name = $2", [
      fixture,
      `${fixture}-second`,
    ]);
    await db.query("DELETE FROM staff_accounts WHERE id = $1", [staffId]);
    await db.query("UPDATE demo_device SET clock_offset_ms = $1 WHERE id = 1", [clock]);
    await db.end();
  }
});
