import assert from "node:assert/strict";
import test from "node:test";
import { ScannerLatch } from "../src/domain/scanner.ts";

test("continuous QR frames cannot trigger another opening after relock", () => {
  const scanner = new ScannerLatch();
  assert.equal(scanner.observe(true, true), true);
  for (let frame = 0; frame < 20; frame++) assert.equal(scanner.observe(true, false), false);
  for (let frame = 0; frame < 20; frame++) assert.equal(scanner.observe(true, true), false);
  // One missed decode does not rearm a continuously displayed code.
  scanner.observe(false, true);
  assert.equal(scanner.observe(true, true), false);
  for (let frame = 0; frame < 3; frame++) scanner.observe(false, true);
  assert.equal(scanner.observe(true, true), true);
});

test("settings changes and codes seen during an opening require a fresh presentation", () => {
  const scanner = new ScannerLatch();
  assert.equal(scanner.observe(true, false), false);
  for (let frame = 0; frame < 5; frame++) scanner.observe(false, false);
  assert.equal(scanner.observe(true, true), false);
  for (let frame = 0; frame < 3; frame++) scanner.observe(false, true);
  scanner.requireNewPresentation();
  assert.equal(scanner.observe(true, true), false);
  for (let frame = 0; frame < 3; frame++) scanner.observe(false, true);
  assert.equal(scanner.observe(true, true), true);
});
