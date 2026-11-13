import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const composeFile = fileURLToPath(new URL("../compose.yaml", import.meta.url));

// Explicitly opt in; never destroy an existing demo database during diagnostics.
if (!process.argv.includes("--confirm")) {
  console.error(
    "This deletes the local Heaven Access database. Run npm run db:reset -- --confirm to proceed.",
  );
  process.exit(1);
}

for (const action of [
  ["down", "--volumes"],
  ["up", "-d", "--wait", "db"],
]) {
  const result = spawnSync(
    "docker",
    ["compose", "--project-name", "heaven-access", "--file", composeFile, ...action],
    {
      cwd: projectRoot,
      stdio: "inherit",
    },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
}
