import { QrReader } from "./reader";

export default function ReaderPage() {
  return (
    <main className="reader-page">
      <p className="eyebrow">Heaven Access · Simulated reader</p>
      <h1>QR reader</h1>
      <QrReader />
    </main>
  );
}
