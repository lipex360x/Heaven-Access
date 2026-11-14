import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

/** @type {import('next').NextConfig} */
const config = {
  allowedDevOrigins: [
    "127.0.0.1",
    ...(process.env.DEV_ALLOWED_HOSTS ?? "")
      .split(",")
      .map((host) => host.trim())
      .filter(Boolean),
  ],
  turbopack: { root: projectRoot },
  outputFileTracingRoot: projectRoot,
};

export default config;
