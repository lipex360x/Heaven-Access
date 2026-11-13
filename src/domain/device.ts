export type Device = {
  id: number;
  destination: { id: number; companyLabel: string; roomLabel: string; floorLabel: string | null };
  revision: number;
  state: "locked" | "unlocked";
  unlockedUntil: string;
  serverNow: string;
  effectiveNow: string;
  clockMode: "real" | "demo";
};

export type AccessCode =
  | "granted"
  | "already_unlocked"
  | "invalid_qr"
  | "not_approved"
  | "too_early"
  | "expired"
  | "wrong_destination"
  | "stale_device_state";

export type AccessResult = { code: AccessCode; device: Device };

export const ACCESS_MESSAGES: Record<AccessCode, string> = {
  granted: "Access authorized. The simulated gate opens for five real seconds.",
  already_unlocked: "The gate is already open. No additional access was recorded.",
  invalid_qr: "This is not an available Heaven Access QR pass.",
  not_approved: "This visit is not approved.",
  too_early: "This visit's access window has not started.",
  expired: "This visit has expired. A new request and approval are required.",
  wrong_destination: "This pass does not authorize the selected destination.",
  stale_device_state: "The scenario changed. Refresh, remove the QR and present it again.",
};
