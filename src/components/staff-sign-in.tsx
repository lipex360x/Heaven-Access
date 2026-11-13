"use client";

import { useState } from "react";
import { sendJson } from "@/client/api";

export function StaffSignIn({ onSignedIn }: { onSignedIn: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <form
      className="panel stack"
      onSubmit={async (event) => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        setBusy(true);
        setError("");
        try {
          await sendJson("/api/staff/login", {
            username: values.get("username"),
            password: values.get("password"),
          });
          onSignedIn();
        } catch (failure) {
          setError(failure instanceof Error ? failure.message : "Sign-in failed.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2>Staff sign-in</h2>
      <label>
        Username
        <input name="username" autoComplete="username" required />
      </label>
      <label>
        Password
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
