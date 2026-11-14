import { RegistrationForm } from "./registration-form";

export default function RegistrationPage() {
  return (
    <main className="pass-page">
      <p className="eyebrow">Heaven Access · Visitor</p>
      <h1>Request a visit</h1>
      <p>
        Request access to your host's office. Reception must approve your visit before you can use a
        QR pass.
      </p>
      <RegistrationForm />
      <p>
        <a href="/">Back to Heaven Access</a>
      </p>
    </main>
  );
}
