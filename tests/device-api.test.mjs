import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import pg from "pg";
import { PRIVACY_NOTICE_VERSION } from "../src/domain/privacy.ts";

const base = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";
const databaseUrl = new URL(process.env.DATABASE_URL);
if (
  !["127.0.0.1", "localhost"].includes(databaseUrl.hostname) ||
  !["127.0.0.1", "localhost"].includes(new URL(base).hostname) ||
  databaseUrl.pathname !== "/heaven_access"
) {
  throw new Error(
    "Device integration checks require the disposable local Heaven Access database/server.",
  );
}

test("atomic device access, manual override and advancing demo scenarios", async (t) => {
  const db = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await db.connect();
  const original = (await db.query("SELECT * FROM demo_device WHERE id=1")).rows[0];
  const fixture = `device-test-${randomUUID()}`;
  const staffId = (
    await db.query(
      "INSERT INTO staff_accounts (username,password_hash) SELECT $1,password_hash FROM staff_accounts WHERE username='reception' RETURNING id",
      [fixture],
    )
  ).rows[0].id;
  let cookie;
  const req = async (path, body, method = "POST", headers = {}) => {
    const response = await fetch(`${base}${path}`, {
      method: body === undefined ? "GET" : method,
      headers: {
        ...(cookie ? { Cookie: cookie } : {}),
        ...(body === undefined ? {} : { "Content-Type": "application/json", Origin: base }),
        ...headers,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    return { response, data: await response.json() };
  };
  const device = async () => (await req("/api/device")).data.device;
  const settings = async (body) =>
    req("/api/demo/settings", { expectedRevision: (await device()).revision, ...body }, "PATCH");
  const scan = async (qrPayload, extras = {}) =>
    req("/api/device/scan", {
      qrPayload,
      expectedRevision: (await device()).revision,
      requestId: randomUUID(),
      ...extras,
    });
  const total = async (method) =>
    Number(
      (
        await db.query("SELECT count(*) FROM access_events WHERE staff_id=$1 AND method=$2", [
          staffId,
          method,
        ])
      ).rows[0].count,
    );
  const create = async (name, time = "2026-11-13T12:00", destinationId = 1) => {
    const made = await req("/api/visits", {
      visitorName: `${fixture}-${name}`,
      destinationId,
      scheduledLocal: time,
      privacyAcknowledged: true,
      noticeVersion: PRIVACY_NOTICE_VERSION,
    });
    assert.equal(made.response.status, 201);
    return { id: made.data.visitId, capability: made.data.visitorPath.split("#")[1] };
  };
  const own = async (visit) =>
    (
      await req("/api/visitor/visit", undefined, "GET", {
        Authorization: `Bearer ${visit.capability}`,
      })
    ).data.visit;
  const approve = (visit) => req(`/api/staff/visits/${visit.id}/decision`, { decision: "approve" });
  let approved;
  let qr;
  try {
    await t.test("all device mutations and reads require a same-origin staff session", async () => {
      assert.equal((await req("/api/device")).response.status, 401);
      assert.equal((await req("/api/device/scan", {})).response.status, 401);
      assert.equal((await req("/api/device/manual-release", {})).response.status, 401);
      assert.equal((await req("/api/demo/settings", {}, "PATCH")).response.status, 401);
      const login = await req("/api/staff/login", {
        username: fixture,
        password: "HeavenDemo-2026!",
      });
      assert.equal(login.response.status, 200);
      cookie = login.response.headers.get("set-cookie").split(";")[0];
      assert.equal(
        (await req("/api/device/scan", {}, "POST", { Origin: "https://other.invalid" })).response
          .status,
        403,
      );
      assert.equal(
        (await req("/api/device/manual-release", {}, "POST", { Origin: "https://other.invalid" }))
          .response.status,
        403,
      );
      assert.equal(
        (await req("/api/demo/settings", {}, "PATCH", { Origin: "https://other.invalid" })).response
          .status,
        403,
      );
      assert.equal(
        (await settings({ effectiveLocal: "2026-11-13T12:00", destinationId: 1 })).response.status,
        200,
      );
    });
    await t.test(
      "invalid QR, visitor capabilities, pending and rejected visits never authorize",
      async () => {
        const pending = await create("pending");
        assert.equal((await scan(pending.capability)).data.code, "invalid_qr");
        assert.equal((await scan("https://outside.invalid/redirect")).data.code, "invalid_qr");
        assert.equal((await scan(`haqr_${"x".repeat(43)}`)).data.code, "invalid_qr");
        const rejected = await create("rejected");
        await req(`/api/staff/visits/${rejected.id}/decision`, { decision: "reject" });
        assert.equal((await own(pending)).qrPayload, undefined);
        assert.equal((await own(rejected)).qrPayload, undefined);
        assert.equal(await total("qr"), 0);
      },
    );
    await t.test("early, expired and wrong-destination QR reads do not count", async () => {
      approved = await create("approved");
      assert.equal((await approve(approved)).response.status, 200);
      qr = (await own(approved)).qrPayload;
      await settings({ effectiveLocal: "2026-11-13T11:29:59" });
      assert.equal((await scan(qr)).data.code, "too_early");
      await settings({ effectiveLocal: "2026-11-13T12:30:01" });
      assert.equal((await scan(qr)).data.code, "expired");
      const deniedSnapshot = (await req("/api/device")).data;
      assert.equal(deniedSnapshot.feedback.code, "expired");
      assert.deepEqual(Object.keys(deniedSnapshot.feedback).sort(), ["code", "occurredAt"]);
      assert.ok(!JSON.stringify(deniedSnapshot).includes(qr));
      await settings({ effectiveLocal: "2026-11-13T12:00", destinationId: 2 });
      assert.equal((await scan(qr)).data.code, "wrong_destination");
      assert.equal(await total("qr"), 0);
    });
    await t.test(
      "concurrent scans yield one real five-second opening with retry deduplication",
      async () => {
        await settings({ destinationId: 1 });
        const revision = (await device()).revision;
        const firstId = randomUUID();
        const body = { qrPayload: qr, expectedRevision: revision, requestId: firstId };
        const outcomes = await Promise.all([
          req("/api/device/scan", body),
          req("/api/device/scan", { ...body, requestId: randomUUID() }),
          req("/api/device/scan", body),
        ]);
        assert.deepEqual([outcomes[0].data.code, outcomes[1].data.code].sort(), [
          "already_unlocked",
          "granted",
        ]);
        assert.deepEqual(outcomes[2].data, outcomes[0].data);
        assert.equal(await total("qr"), 1);
        const opened = outcomes.find((outcome) => outcome.data.code === "granted").data.device;
        assert.equal((await req("/api/device")).data.feedback.code, "granted");
        assert.equal(new Date(opened.unlockedUntil) - new Date(opened.serverNow), 5000);
        assert.equal((await scan(qr)).data.device.unlockedUntil, opened.unlockedUntil);
        assert.equal(
          (await req("/api/device/scan", { ...body, qrPayload: "different" })).response.status,
          409,
        );
        // Observe a real deadline rather than simulating its passage with a database edit.
        while (Date.now() <= new Date(opened.unlockedUntil).getTime() + 30) await delay(100);
        assert.equal((await device()).state, "locked");
        assert.deepEqual((await req("/api/device/scan", body)).data, outcomes[0].data);
        assert.equal((await device()).state, "locked", "An old success retry must not reopen");
        assert.equal(await total("qr"), 1);
        assert.equal((await scan(qr)).data.code, "granted");
        assert.equal(await total("qr"), 2);
      },
    );
    await t.test(
      "scenario changes serialize against scans, relock and reject stale revisions",
      async () => {
        const before = await device();
        const after = (await settings({ destinationId: 2 })).data.device;
        assert.equal(after.state, "locked");
        assert.equal(after.revision, before.revision + 1);
        assert.equal((await req("/api/device")).data.feedback, null);
        assert.equal(
          (await scan(qr, { expectedRevision: before.revision })).data.code,
          "stale_device_state",
        );
        assert.equal(
          (
            await req(
              "/api/demo/settings",
              { expectedRevision: before.revision, resetClock: true },
              "PATCH",
            )
          ).response.status,
          409,
        );
        await settings({ destinationId: 1 });
        const current = await device();
        const race = await Promise.all([
          req("/api/device/scan", {
            qrPayload: qr,
            expectedRevision: current.revision,
            requestId: randomUUID(),
          }),
          req(
            "/api/demo/settings",
            { expectedRevision: current.revision, destinationId: 2 },
            "PATCH",
          ),
        ]);
        assert.ok(["granted", "stale_device_state"].includes(race[0].data.code));
        assert.equal(race[1].response.status, 200);
        assert.equal((await device()).state, "locked");
        assert.equal((await device()).destination.id, 2);
      },
    );
    await t.test(
      "explicit manual override records its actor/reason separately without approval",
      async () => {
        const pending = await create("manual", "2026-11-12T12:00");
        const revision = (await device()).revision;
        const action = {
          visitId: pending.id,
          reason: "Assisted synthetic visitor",
          expectedRevision: revision,
          requestId: randomUUID(),
        };
        assert.equal(
          (await req("/api/device/manual-release", { ...action, reason: " " })).response.status,
          400,
        );
        assert.equal(
          (await req("/api/device/manual-release", { ...action, visitId: randomUUID() })).response
            .status,
          404,
        );
        const manual = await req("/api/device/manual-release", action);
        assert.equal(manual.data.code, "granted");
        assert.deepEqual((await req("/api/device/manual-release", action)).data, manual.data);
        assert.equal(await total("manual"), 1);
        const visit = (
          await db.query("SELECT decision, qr_secret FROM visits WHERE id=$1", [pending.id])
        ).rows[0];
        assert.equal(visit.decision, "pending");
        assert.equal(visit.qr_secret, null);
        const summary = (await req("/api/staff/visits")).data.visits.find(
          (x) => x.id === pending.id,
        );
        assert.equal(summary.manualReleaseCount, 1);
        assert.equal(summary.qrAccessCount, 0);
        const event = (
          await db.query("SELECT * FROM access_events WHERE request_id=$1", [action.requestId])
        ).rows[0];
        assert.equal(event.staff_id, staffId);
        assert.equal(event.reason, action.reason);
        assert.equal(event.destination_id, 2);
        assert.ok(Math.abs(Date.now() - event.occurred_at.getTime()) < 10000);
      },
    );
    await t.test(
      "demo clock advances globally, cannot extend real unlocks/sessions, and resets",
      async () => {
        const before = await device();
        await delay(100);
        const advanced = await device();
        assert.ok(new Date(advanced.effectiveNow) > new Date(before.effectiveNow));
        assert.equal((await settings({ effectiveLocal: "2026-10-25T01:30" })).response.status, 400);
        assert.equal((await settings({ destinationId: 2147483647 })).response.status, 400);
        assert.equal(
          (await settings({ effectiveLocal: "2026-11-13T12:00", resetClock: true })).response
            .status,
          400,
        );
        await settings({ effectiveLocal: "2026-11-13T13:00", destinationId: 1 });
        const renewed = await create("new-request", "2026-11-13T13:00");
        await approve(renewed);
        assert.equal(
          (await scan(qr)).data.code,
          "expired",
          "New approval does not reactivate the expired old QR",
        );
        const manual = await req("/api/device/manual-release", {
          visitId: approved.id,
          reason: "Synthetic clock test",
          expectedRevision: (await device()).revision,
          requestId: randomUUID(),
        });
        assert.equal(
          new Date(manual.data.device.unlockedUntil) - new Date(manual.data.device.serverNow),
          5000,
        );
        await settings({ effectiveLocal: "2026-01-01T00:00" });
        assert.equal((await req("/api/staff/session")).response.status, 200);
        await db.query(
          "UPDATE staff_sessions SET expires_at=clock_timestamp()-interval '1 second' WHERE staff_id=$1",
          [staffId],
        );
        assert.equal((await req("/api/device")).response.status, 401);
        const login = await req("/api/staff/login", {
          username: fixture,
          password: "HeavenDemo-2026!",
        });
        cookie = login.response.headers.get("set-cookie").split(";")[0];
        const reset = (await settings({ resetClock: true })).data.device;
        assert.equal(reset.clockMode, "real");
        assert.equal(reset.state, "locked");
        assert.ok(Math.abs(new Date(reset.effectiveNow) - Date.now()) < 5000);
      },
    );
  } finally {
    await db.query("DELETE FROM access_events WHERE staff_id=$1", [staffId]);
    await db.query("DELETE FROM visits WHERE visitor_name LIKE $1", [`${fixture}-%`]);
    await db.query("DELETE FROM staff_accounts WHERE id=$1", [staffId]);
    await db.query(
      "UPDATE demo_device SET destination_id=$1, clock_offset_ms=$2, revision=$3, unlocked_until=$4 WHERE id=1",
      [
        original.destination_id,
        original.clock_offset_ms,
        original.revision,
        original.unlocked_until,
      ],
    );
    await db.end();
  }
});
