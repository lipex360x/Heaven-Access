export default function Home() {
  return (
    <main>
      <p className="eyebrow">Heaven Access</p>
      <h1>Visitor access, with a clear approval.</h1>
      <p>Request a visit, wait for reception approval and present your QR at the access reader.</p>
      <nav className="panel stack" aria-label="Heaven Access interfaces">
        <a href="/register">Request a visit</a>
        <a href="/staff">Reception · review visits</a>
        <a href="/device">Camera reader and demonstration controls</a>
        <a href="/device/display">Gate / elevator display</a>
      </nav>
      <p>This demonstration uses fictional visitors and simulated hardware.</p>
    </main>
  );
}
