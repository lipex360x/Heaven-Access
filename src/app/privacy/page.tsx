import { PRIVACY_NOTICE_VERSION, PRIVACY_SUMMARY } from "@/domain/privacy";

export default function PrivacyPage() {
  return (
    <main className="stack">
      <p className="eyebrow">Heaven Access</p>
      <h1>Demonstration privacy notice</h1>
      <p>Version: {PRIVACY_NOTICE_VERSION}</p>
      <p className="demo-note">
        This is a prototype using fictional visitor details. It is not a live building-access
        service.
      </p>
      <section className="panel stack">
        <h2>What is collected and why</h2>
        <p>{PRIVACY_SUMMARY}</p>
        <p>
          A submitted request contains your name, chosen company/room and scheduled visit time, plus
          this notice version and the time you acknowledged it. No email address, phone number,
          identity document or facial template is requested.
        </p>
        <h2>Who can access the information</h2>
        <p>
          Authenticated demonstration staff can review visit details, approve or reject requests,
          revoke approved passes and see separate QR/manual authorization counts. A manual release
          records its staff actor and reason. Your private pass link grants access to your own visit
          only; keep it and its QR private.
        </p>
        <h2>Revocation and retained history</h2>
        <p>
          When staff revoke an approved pass, we record the staff account and the real date and time
          of revocation. The visitor page removes the QR, and future QR authorizations are refused,
          including downloaded copies. The original approval and access history remain in the
          database; revocation does not delete personal data. An opening already authorized finishes
          normally. A separately authorized manual release does not restore the revoked QR.
        </p>
        <h2>Camera and device simulation</h2>
        <p>
          The reader processes camera frames locally to decode QR data. Camera footage is not
          recorded or uploaded. The server checks the credential, approval or revocation,
          destination and time. Successful openings record an authorization event, not proof of
          physical passage or current occupancy.
        </p>
        <h2>Storage and demonstration limits</h2>
        <p>
          Records remain in the demonstration database until explicitly removed during test cleanup
          or a database reset. There is no automatic retention/deletion process. The application
          does not save unsubmitted form drafts. Staff use a session cookie; the private visitor
          link is read from its URL fragment.
        </p>
        <p>
          A live service needs an approved privacy notice, processing basis, retention policy and
          assistance procedures before use with real visitors. Acknowledging this notice does not by
          itself establish those requirements.
        </p>
        <h2>If you do not continue</h2>
        <p>
          No visit record is created until you submit the form. If you do not wish to submit or need
          help, ask reception about assisted access; this does not promise anonymous entry.
        </p>
      </section>
      <a href="/register">Back to visit request</a>
    </main>
  );
}
