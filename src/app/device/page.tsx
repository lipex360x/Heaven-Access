import { DeviceSimulator } from "./simulator";

export default function DevicePage() {
  return (
    <main>
      <p className="eyebrow">Heaven Access · Staff demonstration</p>
      <h1>Access simulator</h1>
      <p>
        This is a simulated gate. It does not control a real elevator or verify physical passage.
      </p>
      <DeviceSimulator />
    </main>
  );
}
