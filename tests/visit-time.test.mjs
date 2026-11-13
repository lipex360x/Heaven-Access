import assert from "node:assert/strict";
import test from "node:test";
import { parseVisitTime, visitState, visitWindow } from "../src/domain/visit-time.ts";

test("Dublin local time resolves winter and summer offsets", () => {
  assert.equal(parseVisitTime("2026-11-13T12:00").toISOString(), "2026-11-13T12:00:00.000Z");
  assert.equal(parseVisitTime("2026-07-13T12:00").toISOString(), "2026-07-13T11:00:00.000Z");
});

test("DST gap, overlap, invalid dates and client offsets are rejected", () => {
  for (const value of [
    "2026-03-29T01:30",
    "2026-10-25T01:30",
    "2026-02-30T12:00",
    "2026-11-13T24:00",
    "2026-11-13T12:00Z",
    "2026-11-13T12:00+01:00",
    "2026-11-13T12:00:60",
    "0000-01-01T12:00",
  ]) {
    assert.throws(() => parseVisitTime(value), RangeError);
  }
});

test("approval window includes both boundaries and excludes the adjacent millisecond", () => {
  const scheduled = new Date("2026-11-13T12:00:00Z");
  const { validFrom, validUntil } = visitWindow(scheduled);
  assert.equal(
    visitState("approved", scheduled, new Date(validFrom.getTime() - 1)),
    "approved_early",
  );
  assert.equal(visitState("approved", scheduled, validFrom), "approved_valid");
  assert.equal(visitState("approved", scheduled, validUntil), "approved_valid");
  assert.equal(visitState("approved", scheduled, new Date(validUntil.getTime() + 1)), "expired");
  assert.equal(visitState("pending", scheduled, validUntil), "pending");
  assert.equal(visitState("pending", scheduled, new Date(validUntil.getTime() + 1)), "expired");
  assert.equal(visitState("rejected", scheduled, new Date(validUntil.getTime() + 1)), "rejected");
});

test("clock replay changes a derived state without changing the stored visit window", () => {
  const scheduled = new Date("2026-11-13T12:00:00Z");
  const bounds = visitWindow(scheduled);
  assert.equal(visitState("approved", scheduled, new Date("2026-11-13T13:00:00Z")), "expired");
  assert.equal(visitState("approved", scheduled, scheduled), "approved_valid");
  assert.deepEqual(visitWindow(scheduled), bounds);
});
