# Heaven Access — Local Environment Onboarding

Use this prompt before the issue-specific agent prompt when preparing a team member's computer. It diagnoses first, then suggests the smallest necessary setup. Task decisions and setup blockers belong in [issue #1](https://github.com/lipex360x/Heaven-Access/issues/1); this document is an onboarding artifact, not a machine-status tracker.

## Current boundary

At the time this document was introduced, the repository contained planning documents, without an application manifest, runtime-version pins, dependency lockfile or Compose file. The prompt must inspect the current revision rather than assume those files are still absent. Until the application exists, distinguish **tools ready** from **application run verified**. Do not invent startup commands or select independent runtime versions on each computer.

## Platform and version policy

| Concern | Approach |
| --- | --- |
| macOS | Prefer Homebrew for system-tool installation where supported; `brew install mise` is a supported mise installation option. Check OS/CPU compatibility first. |
| Native Windows | Prefer native tools such as WinGet; `winget install jdx.mise` is supported. Homebrew is not the native Windows installation route. |
| Windows with WSL | Identify it explicitly. Keep Linux and Windows tool installations, shells, paths and Docker integration distinct. Do not add a WSL development workflow merely because Docker uses a WSL backend. |
| Node/Bun | Prefer mise and the repository's agreed versions. Bun is part of the requested readiness check; Node is needed only if the chosen tooling requires it. Do not install several competing runtime managers. |
| Docker | Prefer an existing working setup; Docker Desktop includes the engine, CLI and Compose. Check the daemon separately from CLI presence. PostgreSQL runs in Docker, so a host PostgreSQL installation is not required. |
| Synchronization | Follow committed runtime pins, lockfiles and the selected PostgreSQL image tag. Exact project versions should be agreed and committed through issue #1, rather than each member selecting `latest`. |

The supported platform routes and example mise commands above are based on the official [mise installation guide](https://mise.jdx.dev/installing-mise.html), [mise Windows guidance](https://mise.jdx.dev/faq.html), [Homebrew installation guide](https://docs.brew.sh/Installation), and [Docker Compose installation guide](https://docs.docker.com/compose/install/). Recheck current requirements before installing on another machine.

## Copyable initial prompt

```text
Help me prepare my computer to work on Heaven Access:
https://github.com/lipex360x/Heaven-Access
Setup coordination issue: https://github.com/lipex360x/Heaven-Access/issues/1

Optional preferences:
- Conversation language: [default Portuguese; or my preference]
- Conversation tone/detail/style: [optional]
- Operating system and terminal, if known: [optional]
- Local repository location, if already cloned: [optional]

Heaven Access is a small local visitor-access MVP: request, staff approval, mobile QR and a simulated camera-enabled access device with live updates. PostgreSQL will run through Docker Compose with SQL seed data. I need a practical environment check aligned with the team, not application implementation or an unrelated tooling overhaul.

1. Detect my actual OS, version, CPU architecture and shell before choosing commands. Distinguish macOS Intel/Apple Silicon, native Windows PowerShell and a WSL Linux terminal. Do not assume a person's OS from their name. If you cannot run local commands, give me a small OS-appropriate diagnostic batch and interpret the results I provide; do not claim you checked them yourself.

2. Begin with read-only diagnostics. Check Git, GitHub access, mise, Bun, Docker CLI, Docker Compose and a running compatible Docker engine; check Node if the chosen tooling needs it. Locate the actual executables and versions, so a command hidden by PATH or another version manager is not mistaken for a missing installation. Useful checks, when the command exists, include git --version, gh --version, mise --version, mise current, bun --version, bun --revision, node --version, docker --version, docker compose version, docker context show and docker info --format '{{.ServerVersion}}'. Do not stop the whole diagnosis at the first missing command. Installed Docker CLI alone does not mean the daemon works.

3. Check whether the private repository invitation has been accepted and the correct GitHub account can read the repository. If gh is available, gh auth status and gh repo view lipex360x/Heaven-Access --json nameWithOwner,viewerPermission can help. Never request/print tokens, passwords, full environment files or secret-bearing authentication output. An authentication failure is an access blocker, not an empty repository. GitHub CLI is useful for the shared workflow, but an existing authenticated Git/browser route can also establish repository access.

4. If a checkout is available, inspect AGENTS.md, README.md, docs/environment-setup.md, the current setup decisions in issue #1, and only relevant tool files: mise.toml/.mise.toml/mise.lock, .tool-versions, .nvmrc, package.json (including engines/packageManager/scripts), dependency lockfiles, and Compose/image definitions if they exist. Check the branch/commit and local changes. Do not overwrite a checkout or switch/reset a branch with unpreserved work. If no checkout exists, suggest an appropriate local folder and authenticated clone; do not assume Felipe's absolute workspace path exists on my computer.

5. Reuse a reliable prior diagnosis/handoff in this conversation. Compare relevant repository changes and current tool versions; repeat only failed, missing or changed checks. In a new chat without that context, do the first diagnosis. Do not claim cross-chat memory. If private files/issues are inaccessible, request only the relevant excerpts and report the limitation explicitly.

6. Produce a compact table: requirement, team-required version, detected version/path, usable status and next action. Separate missing tools, wrong runtime versions, PATH/shell conflicts, Docker-daemon/backend problems, repository access and project-level decisions still pending. Do not call the application ready just because tools are installed. If versions or run files have not been agreed/committed yet, mark that as a shared setup decision in #1 rather than inventing them.

7. Suggest the smallest needed installations using current official instructions. On macOS, prefer Homebrew for supported system packages, then mise for project Node/Bun versions; brew install mise is a supported starting option when mise is missing. On native Windows, prefer WinGet or the official Windows installers; winget install jdx.mise is a supported option. Homebrew is not a native Windows package manager. For Docker Desktop on Windows, check the supported OS, virtualization/backend and WSL requirements as applicable. A WSL Docker backend does not require moving the entire project into WSL; if we choose WSL development, keep all project tools/paths in that environment and explain its Docker integration. Never mix Bash, PowerShell and Windows/Linux paths in one unexplained command batch.

8. Prefer mise's supported Node/Bun backends and the committed project versions. Check platform support and shell activation/PATH against current docs. Preserve working runtime managers and unrelated projects; do not uninstall/replace them or change global versions as a shortcut. Do not independently run mise use to choose new project pins. When the team config exists, inspect its contents/trust requirements and suggest mise install for those versions. Verify that the active executable actually resolves to the intended version. Do not install Bun again through Homebrew/npm if mise is already managing it.

9. Use the existing supported Docker environment if it works; otherwise suggest the appropriate Docker Desktop installation. Verify Compose using docker compose, and a Linux-container backend suitable for PostgreSQL. Do not install host PostgreSQL, a global frontend toolchain or optional browser automation merely to prepare the machine. Vite+/vp and Node requirements depend on the chosen architecture and repository dependencies; web-view is optional if unavailable. Explain what a suggested install changes. Perform installations, shell/profile edits, clone operations or container/app startup only when I ask you to proceed, preserving any authorization already given. Never reset database volumes to diagnose setup.

10. Once project run files exist and I request startup, follow the committed README/scripts and lockfile-compatible package manager instead of inventing commands. Use the documented local environment example without exposing secrets; run the agreed PostgreSQL Compose service and application, then check database readiness, expected ports, HTTP response and a basic multi-tab flow. For camera testing, distinguish localhost from another Wi-Fi device's connection to the host LAN address and check browser camera/security permissions. A full real-camera scan is a separate functional check. If application files are still absent, finish with tools-ready/run-not-yet-verifiable and the exact team decision needed.

Finish with a short environment summary and ordered next actions. Keep a concise in-chat handoff containing OS/shell, repository revision, relevant tool versions, checks already passed and remaining blockers. Record shared setup decisions/blockers in issue #1, without creating parallel local machine-status checklists. After environment readiness, use the prompt from the specific issue I will work on.
```

## Official references for the assisting agent

- [mise installation and supported package-manager routes](https://mise.jdx.dev/installing-mise.html)
- [mise Bun backend and platform handling](https://mise.jdx.dev/lang/bun.html)
- [mise getting started and shared project tool configuration](https://mise.jdx.dev/getting-started)
- [Bun installation and version verification](https://bun.com/docs/installation)
- [Homebrew installation and platform requirements](https://docs.brew.sh/Installation)
- [Microsoft WinGet documentation](https://learn.microsoft.com/en-us/windows/package-manager/winget/)
- [Docker Desktop for Windows](https://docs.docker.com/desktop/setup/install/windows-install/) and [Docker WSL integration](https://docs.docker.com/desktop/features/wsl/)
- [Docker Desktop for macOS](https://docs.docker.com/desktop/setup/install/mac-install/)
- [Docker Compose installation](https://docs.docker.com/compose/install/)

Reviewed on 6 November 2026. Use current official requirements when diagnosing a later machine; do not infer runtime pins from example versions in those pages.
