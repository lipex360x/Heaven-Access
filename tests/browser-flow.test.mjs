import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { randomUUID, scryptSync } from "node:crypto";
import test from "node:test";
import { setTimeout as delay } from "node:timers/promises";
import { promisify } from "node:util";
import pg from "pg";
import { PRIVACY_NOTICE_VERSION } from "../src/domain/privacy.ts";

const execute = promisify(execFile);
const base = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";
const port = process.env.TEST_CDP_PORT;
const executable = process.env.WEB_VIEW_BIN ?? "web-view";
const local = (host) => ["127.0.0.1", "localhost"].includes(host);
const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
let target;
let database;
try {
  target = new URL(base);
  database = new URL(connectionString);
} catch {
  throw new Error("Configure TEST_BASE_URL and the matching DATABASE_URL privately.");
}
const hosted = !local(target.hostname);
if (
  target.origin !== base ||
  target.username ||
  target.password ||
  (hosted
    ? process.env.TEST_ALLOW_HOSTED_BROWSER !== "1" ||
      base !== "https://heaven-access.vercel.app" ||
      !database.hostname.endsWith(".neon.tech")
    : !local(database.hostname) || database.pathname !== "/heaven_access")
) {
  throw new Error(
    "Browser checks require the local demo or explicit opt-in to its hosted Neon environment.",
  );
}
if (!port || !/^\d+$/.test(port) || Number(port) < 1024 || Number(port) > 65535) {
  throw new Error(
    "Set TEST_CDP_PORT to a dedicated web-view Chrome port; see docs/browser-tests.md.",
  );
}

async function browser(...args) {
  try {
    const { stdout } = await execute(executable, [...args, "--port", port], {
      timeout: 25000,
      maxBuffer: 4 * 1024 * 1024,
    });
    return stdout.trim();
  } catch {
    // CLI errors can echo command arguments containing private pass/image data.
    throw new Error(
      `web-view ${args[0]} failed; inspect the test browser without logging secrets.`,
    );
  }
}
const evaluate = async (tab, js) => JSON.parse(await browser("eval", "--tab", tab, "--js", js));
async function waitFor(tab, expression, label) {
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (await evaluate(tab, expression)) return;
    await delay(200);
  }
  assert.fail(`Timed out: ${label}`);
}
const focus = (tab) => browser("tab", "switch", "--tab", tab);
async function action(tab, verb, options) {
  const args = ["do", verb, "--tab", tab];
  for (const [key, value] of Object.entries(options)) args.push(`--${key}`, value);
  await browser(...args);
}
const hasText = (text) => `document.body.innerText.includes(${JSON.stringify(text)})`;

// This optional suite is separate from npm test: it needs Chrome, web-view and a running app.
test("browser reader, shared display and pass revocation (synthetic camera)", {
  timeout: 180000,
}, async (t) => {
  const run = randomUUID();
  const visitorName = `Browser QA ${run}`;
  const username = `browser-test-${run}`;
  const password = randomUUID();
  const suffix = `?qa=${run}`;
  const reader = `${base}/device/reader${suffix}`;
  const staff = `${base}/staff${suffix}`;
  const display = `${base}/device/display${suffix}`;
  const pass = `${base}/pass${suffix}`;
  const tabs = new Set();
  const db = new pg.Client({ connectionString, connectionTimeoutMillis: 5000 });
  let staffId;
  let original;
  let connected = false;
  async function open(url) {
    // Store only a public query selector for cleanup; never print the pass capability.
    const selector = url.split("#")[0];
    tabs.add(selector);
    await browser("navigate", "--url", url, "--new-tab");
    await focus(selector);
  }
  try {
    try {
      await execute(executable, ["--version"], { timeout: 5000 });
    } catch {
      throw new Error("Install web-view or set WEB_VIEW_BIN to its executable.");
    }
    const health = await fetch(`${base}/api/health`, { signal: AbortSignal.timeout(10000) });
    assert.equal(health.status, 200, "Application/database must be ready before the walkthrough");
    try {
      await db.connect();
      connected = true;
    } catch {
      throw new Error(
        "Cannot connect to the test database; check the private environment configuration.",
      );
    }
    original = (await db.query("SELECT * FROM demo_device WHERE id=1")).rows[0];
    assert.ok(original, "Initialize the test database first");
    assert.ok(
      original.unlocked_until < new Date(),
      "Wait for the current opening and stop other demonstrations first",
    );
    await open(reader);
    await waitFor(reader, hasText("Staff sign-in"), "fresh test-browser sign-in");
    const salt = randomUUID();
    const hash = `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
    staffId = (
      await db.query(
        "INSERT INTO staff_accounts(username,password_hash) VALUES($1,$2) RETURNING id",
        [username, hash],
      )
    ).rows[0].id;

    await t.test(
      "dedicated reader authenticates against the configured database and hides controls",
      async () => {
        await action(reader, "fill", { role: "textbox", name: "Username", value: username });
        await action(reader, "fill", { role: "textbox", name: "Password", value: password });
        await action(reader, "click", { role: "button", name: "Sign in" });
        await waitFor(reader, hasText("READY TO SCAN"), "authenticated dedicated reader");
        assert.equal(
          await evaluate(
            reader,
            `${hasText("Apply scenario")} || ${hasText("Assisted manual release")}`,
          ),
          false,
        );
      },
    );
    // A successful login with this unique database-created account proves the app/DB pairing.
    const clock = await evaluate(
      reader,
      "(async()=>{const r=await fetch('/api/device');return (await r.json()).device})()",
    );
    const scheduledLocal = new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Europe/Dublin",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .format(new Date(clock.effectiveNow))
      .replace(" ", "T");
    const created = await fetch(`${base}/api/visits`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: base },
      body: JSON.stringify({
        visitorName,
        destinationId: clock.destination.id,
        scheduledLocal,
        privacyAcknowledged: true,
        noticeVersion: PRIVACY_NOTICE_VERSION,
      }),
      signal: AbortSignal.timeout(10000),
    });
    assert.equal(created.status, 201, "Synthetic visit preparation must succeed");
    const { visitId, visitorPath } = await created.json();
    assert.equal(
      (
        await db.query("SELECT id FROM visits WHERE id=$1 AND visitor_name=$2", [
          visitId,
          visitorName,
        ])
      ).rowCount,
      1,
    );
    const fragment = visitorPath.match(/^\/pass#(v_[A-Za-z0-9_-]{43})$/)?.[1];
    assert.ok(fragment, "The API must return a private pass capability");
    await open(`${pass}#${fragment}`);
    let image;
    const card = `article[aria-label="Visit for ${visitorName}"]`;
    await t.test("UI approval automatically reveals the visitor QR", async () => {
      await waitFor(pass, hasText("Awaiting approval"), "pending visitor pass");
      assert.equal(await evaluate(pass, "!!document.querySelector('canvas')"), false);
      await open(staff);
      await waitFor(
        staff,
        `!!document.querySelector(${JSON.stringify(card)})`,
        "synthetic visit card",
      );
      await action(staff, "click", { selector: `${card} .actions button:first-child` });
      await focus(pass);
      await waitFor(
        pass,
        "!!document.querySelector('canvas') && !document.querySelector('.pass-qr button').disabled",
        "QR after approval without reload",
      );
      image = await evaluate(pass, "document.querySelector('canvas').toDataURL('image/png')");
      assert.ok(image.startsWith("data:image/png;base64,"));
    });
    await open(display);
    await waitFor(display, hasText("GATE LOCKED"), "initial locked display");
    await focus(reader);
    await evaluate(
      reader,
      `(async()=>{
      const canvas=document.createElement('canvas');canvas.width=640;canvas.height=480;
      const context=canvas.getContext('2d');const image=new Image();image.src=${JSON.stringify(image)};await image.decode();
      window.qaShowQr=true;
      const draw=()=>{context.fillStyle='white';context.fillRect(0,0,640,480);if(window.qaShowQr)context.drawImage(image,140,60,360,360)};
      draw();navigator.mediaDevices.getUserMedia=async()=>{
        const stream=canvas.captureStream(10);const track=stream.getVideoTracks()[0];
        const timer=setInterval(()=>{if(track.readyState==='ended'){clearInterval(timer);return}draw()},100);
        return stream;
      };return true;
    })()`,
    );
    await t.test("synthetic camera opens the separate display once and relocks", async () => {
      await action(reader, "click", { role: "button", name: "Start camera" });
      await waitFor(reader, hasText("ACCESS GRANTED"), "synthetic-video QR authorization");
      await focus(display);
      await waitFor(display, hasText("ACCESS GRANTED"), "shared display grant");
      await waitFor(display, hasText("GATE LOCKED"), "real-time automatic relock");
      await focus(reader);
      await waitFor(reader, hasText("READY TO SCAN"), "reader returns to ready");
      await browser("resize", "--tab", reader, "--width", "390", "--height", "844", "--viewport");
      assert.equal(
        await evaluate(reader, "document.documentElement.scrollWidth<=innerWidth"),
        true,
        "No horizontal overflow at phone width",
      );
      assert.equal(
        await evaluate(
          reader,
          "(()=>{const b=Array.from(document.querySelectorAll('button')).find(b=>b.innerText==='Stop camera');return !!b && b.getBoundingClientRect().bottom<=innerHeight})()",
        ),
        true,
        "Camera controls fit the phone viewport",
      );
      const count = await db.query(
        "SELECT count(*)::int AS total FROM access_events WHERE visit_id=$1 AND method='qr'",
        [visitId],
      );
      assert.equal(count.rows[0].total, 1, "Continuous frames must not add another opening");
    });
    await t.test("confirmed UI revocation removes the QR and denies its saved image", async () => {
      await focus(staff);
      await waitFor(
        staff,
        `document.querySelector(${JSON.stringify(card)}).innerText.includes('QR authorizations: 1')`,
        "reception count convergence",
      );
      await action(staff, "click", { selector: `${card} .danger-button` });
      assert.equal(
        await evaluate(
          staff,
          `document.querySelector(${JSON.stringify(`${card} input[type=checkbox]`)}).checked`,
        ),
        false,
        "Revocation confirmation starts unchecked",
      );
      await action(staff, "check", { selector: `${card} input[type=checkbox]` });
      await action(staff, "click", { selector: `${card} button[type=submit]` });
      await waitFor(
        staff,
        `document.querySelector(${JSON.stringify(card)}).innerText.includes('Access revoked')`,
        "reception revoked state",
      );
      await focus(pass);
      await waitFor(
        pass,
        `${hasText("Access revoked")} && !document.querySelector('canvas')`,
        "automatic QR removal",
      );
      await focus(reader);
      await evaluate(reader, "window.qaShowQr=false");
      // Three empty frames while locked rearm the real scanner latch; the camera emits 10 fps.
      await delay(1000);
      await evaluate(reader, "window.qaShowQr=true");
      await waitFor(
        reader,
        `${hasText("ACCESS DENIED")} && ${hasText("revoked")}`,
        "saved image denied by decoder/server",
      );
      await focus(display);
      await waitFor(
        display,
        `${hasText("ACCESS DENIED")} && ${hasText("revoked")}`,
        "shared display revoked denial",
      );
      const audit = (
        await db.query(
          `SELECT revoked_by,revoked_at,decision,
        (SELECT count(*)::int FROM access_events WHERE visit_id=visits.id) AS total
        FROM visits WHERE id=$1`,
          [visitId],
        )
      ).rows[0];
      assert.equal(audit.revoked_by, staffId);
      assert.ok(audit.revoked_at instanceof Date);
      assert.equal(audit.decision, "approved", "Original approval is retained");
      assert.equal(audit.total, 1, "Revoked reads cannot add access events");
      const current = (
        await db.query("SELECT clock_offset_ms,revision,unlocked_until FROM demo_device WHERE id=1")
      ).rows[0];
      assert.equal(
        current.clock_offset_ms,
        original.clock_offset_ms,
        "Test must not change the demo clock",
      );
      assert.equal(current.revision, original.revision, "Test must not change the scenario");
      assert.ok(current.unlocked_until < new Date(), "Device remains locked");
    });
  } finally {
    // Close only this run's uniquely tagged tabs, which stops its synthetic media tracks.
    const cleanupFailures = [];
    for (const tab of [...tabs].reverse()) {
      try {
        await browser("tab", "close", "--tab", tab);
      } catch {
        cleanupFailures.push("test browser tab");
      }
    }
    if (connected) {
      try {
        await db.query("BEGIN");
        await db.query(
          "DELETE FROM access_events WHERE visit_id IN (SELECT id FROM visits WHERE visitor_name=$1)",
          [visitorName],
        );
        await db.query("DELETE FROM visits WHERE visitor_name=$1", [visitorName]);
        if (staffId)
          await db.query("DELETE FROM staff_accounts WHERE id=$1 AND username=$2", [
            staffId,
            username,
          ]);
        // Staff deletion cascades to this run's sessions and deduplicated device requests.
        await db.query("COMMIT");
      } catch {
        await db.query("ROLLBACK").catch(() => {});
        cleanupFailures.push("synthetic database fixture");
      }
    }
    await db.end().catch(() => {});
    assert.equal(cleanupFailures.length, 0, `Cleanup incomplete: ${cleanupFailures.join(", ")}`);
  }
});
