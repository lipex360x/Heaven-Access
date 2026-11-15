# Prototype and evaluation: presentation input

Use #11 for the dated verification record and the selected source register for third-party claims. These implementation facts come from the merged application, not external marketing or simulated user testimony.

## What is implemented

One Next.js/TypeScript application uses PostgreSQL and visible-page polling. A public visitor request collects name, destination and scheduled Dublin time after an unchecked privacy-notice acknowledgement. Staff approve/reject; approval reveals the private QR/download automatically. The reusable QR has an inclusive ±30-minute window. Expiry or revocation needs a new request and approval.

A second phone can open /device/reader; QR frames are decoded locally. The server checks credential, approval/revocation, destination and time. The tablet's /device/display shows the same simulated gate or elevator opening for eight real seconds and relocking. Repeated frames/retries do not extend an opening or inflate counts. Reception can revoke a pass with confirmation; saved images are then refused. An opening already granted completes its deadline. Manual override requires a reason/confirmation and has a separate count; it does not restore QR approval.

## Recorded evaluation

On 15 November, #11 records 7 unit results, 10 visitor/auth integration results, 9 device integration results and 5 maintained browser-test results locally plus 5 online. The browser suite used synthetic video through the real decoder and checked approval, shared opening/relock, revocation, saved-image refusal and cleanup. The request was prepared through the API in that retained browser suite; separate earlier checks exercised the registration form. Felipe also reported successful online tests, without enumerating a physical-camera path through the new reader. Do not relabel the synthetic suite as a physical-camera test.

The stable prototype is https://heaven-access.vercel.app. Public registration needs no account; protected reception/device views use the intentionally synthetic demonstration account documented in the project README. A health check confirms service/database readiness, not a physical scan. Final screenshots must show actual app UI with fictional records and no private capabilities/live QR secrets.

The prototype does not verify identity, physical passage, occupancy, prevention of tailgating, real hardware behaviour, recurring employee credentials or cross-building blocking. No measured cost saving, incident reduction or net environmental saving is available. Do not describe those outcomes as tested.
