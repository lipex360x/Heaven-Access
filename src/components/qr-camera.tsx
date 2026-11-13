"use client";

import jsQR from "jsqr";
import { useEffect, useRef, useState } from "react";
import { ScannerLatch } from "@/domain/scanner";

export function QrCamera({
  locked,
  revision,
  disabled,
  onCode,
}: {
  locked: boolean;
  revision: number;
  disabled: boolean;
  onCode: (code: string) => Promise<void>;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const latch = useRef(new ScannerLatch());
  const observedRevision = useRef(revision);
  const sending = useRef(false);
  const mounted = useRef(false);
  const [active, setActive] = useState(false);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);
  const latest = useRef({ locked, disabled, onCode });
  useEffect(() => {
    latest.current = { locked, disabled, onCode };
  }, [locked, disabled, onCode]);
  useEffect(() => {
    if (observedRevision.current !== revision) {
      observedRevision.current = revision;
      latch.current.requireNewPresentation();
    }
  }, [revision]);
  useEffect(() => {
    if (!active) return;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const timer = setInterval(() => {
      const frame = video.current;
      if (
        !context ||
        !frame ||
        frame.readyState < 2 ||
        document.hidden ||
        latest.current.disabled ||
        sending.current
      )
        return;
      canvas.width = Math.min(frame.videoWidth, 640);
      canvas.height = Math.round((frame.videoHeight * canvas.width) / frame.videoWidth);
      if (!canvas.width || !canvas.height) return;
      context.drawImage(frame, 0, 0, canvas.width, canvas.height);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(pixels.data, canvas.width, canvas.height, {
        inversionAttempts: "dontInvert",
      });
      if (latch.current.observe(!!code, latest.current.locked) && code) {
        sending.current = true;
        void latest.current.onCode(code.data).finally(() => {
          sending.current = false;
        });
      }
    }, 200);
    return () => {
      clearInterval(timer);
      canvas.width = 0;
      canvas.height = 0;
    };
  }, [active]);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      stream.current?.getTracks().forEach((track) => {
        track.stop();
      });
    };
  }, []);
  return (
    <section className="panel stack" aria-label="QR camera">
      <h2>Scan visitor QR</h2>
      <p>
        Camera images are processed locally and are not recorded or uploaded. Remove the QR from
        view before presenting it again.
      </p>
      <video ref={video} muted playsInline aria-label="Live camera preview" hidden={!active} />
      {error && <p role="alert">{error} Ask reception for assisted access.</p>}
      <div className="actions">
        <button
          type="button"
          disabled={starting || active}
          onClick={async () => {
            setStarting(true);
            setError("");
            try {
              if (!navigator.mediaDevices?.getUserMedia)
                throw new Error("Camera requires localhost or HTTPS and a supported browser.");
              const media = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
                audio: false,
              });
              stream.current = media;
              if (!mounted.current || !video.current) {
                media.getTracks().forEach((track) => {
                  track.stop();
                });
                return;
              }
              video.current.srcObject = media;
              await video.current.play();
              setActive(true);
            } catch (failure) {
              stream.current?.getTracks().forEach((track) => {
                track.stop();
              });
              setError(
                failure instanceof DOMException && failure.name === "NotAllowedError"
                  ? "Camera permission was denied."
                  : "Camera could not start. Check permissions, connection and camera availability.",
              );
            } finally {
              setStarting(false);
            }
          }}
        >
          {starting ? "Starting camera…" : "Start camera"}
        </button>
        {active && (
          <button
            type="button"
            onClick={() => {
              stream.current?.getTracks().forEach((track) => {
                track.stop();
              });
              stream.current = null;
              if (video.current) video.current.srcObject = null;
              setActive(false);
            }}
          >
            Stop camera
          </button>
        )}
      </div>
    </section>
  );
}
