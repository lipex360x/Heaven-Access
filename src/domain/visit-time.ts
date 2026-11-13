import { Temporal } from "@js-temporal/polyfill";

export const VISIT_TIME_ZONE = "Europe/Dublin";
export const VISIT_MARGIN_MS = 30 * 60 * 1000;
export type Decision = "pending" | "approved" | "rejected";
export type VisitState = "pending" | "rejected" | "approved_early" | "approved_valid" | "expired";

export function parseVisitTime(localDateTime: string): Date {
  // Only a local date/time; never accept a client-supplied offset or zone.
  if (
    !/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{3})?)?$/.test(localDateTime) ||
    localDateTime.startsWith("0000")
  ) {
    throw new RangeError("Use a local date and time in Europe/Dublin");
  }
  const instant = Temporal.ZonedDateTime.from(`${localDateTime}[${VISIT_TIME_ZONE}]`, {
    disambiguation: "reject",
    overflow: "reject",
  }).toInstant();
  return new Date(instant.epochMilliseconds);
}

export function visitWindow(scheduledAt: Date) {
  return {
    validFrom: new Date(scheduledAt.getTime() - VISIT_MARGIN_MS),
    validUntil: new Date(scheduledAt.getTime() + VISIT_MARGIN_MS),
  };
}

export function visitState(decision: Decision, scheduledAt: Date, effectiveNow: Date): VisitState {
  if (decision === "rejected") return "rejected";
  const { validFrom, validUntil } = visitWindow(scheduledAt);
  if (effectiveNow > validUntil) return "expired";
  if (decision === "pending") return "pending";
  return effectiveNow < validFrom ? "approved_early" : "approved_valid";
}
