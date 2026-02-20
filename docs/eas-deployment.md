# EAS Deployment Reference

A reference guide for how Panda Quotes is built and deployed to the App Store and Play Store
using Expo Application Services (EAS).

---

## Table of contents

1. [How deployment works — the big picture](#1-how-deployment-works--the-big-picture)
2. [What needs to be wired together](#2-what-needs-to-be-wired-together)
3. [Distribution tracks: iOS vs Android](#3-distribution-tracks-ios-vs-android)
4. [eas build vs eas submit](#4-eas-build-vs-eas-submit)
5. [How eas.json and app.json fit together](#5-how-easjson-and-appjson-fit-together)
6. [Secrets: what they are, where they live, how to create them](#6-secrets-what-they-are-where-they-live-how-to-create-them)
7. [The full CI/CD pipeline](#7-the-full-cicd-pipeline)
8. [Releasing to production (manual steps)](#8-releasing-to-production-manual-steps)
9. [Version numbering](#9-version-numbering)

---

## 1. How deployment works — the big picture

A release goes through three stages:

```
1. BUILD        2. SUBMIT           3. RELEASE
──────────      ──────────────      ──────────────────────
Compile the  →  Upload artifact  →  Promote build from
native app      to store backend    testing track to
on EAS cloud    (App Store          public store listing
                Connect /           (manual step in
                Play Console)       App Store Connect
                                    or Play Console)
```

**Stage 1 — Build** happens on Expo's cloud infrastructure. You trigger it from GitHub Actions; the
compilation itself (~15 min iOS, ~8 min Android) runs on Expo's servers, not on GitHub's runners.

**Stage 2 — Submit** happens automatically after the build finishes, because the workflow uses
`--auto-submit`. EAS uploads the artifact to the appropriate store backend. The build becomes
available to internal testers immediately — no review required.

**Stage 3 — Release** is always manual. You go into App Store Connect or Google Play Console and
promote the tested build to the public store listing. Neither EAS nor this workflow ever touches
production automatically.

---

## 2. What needs to be wired together

For the full pipeline to work, five things must be in place:

| # | What | Where | Purpose |
|---|---|---|---|
| 1 | `EXPO_TOKEN` | GitHub org/repo secret | Authenticates EAS CLI in GitHub Actions |
| 2 | `GOOGLE_SERVICE_ACCOUNT_KEY_JSON` | GitHub repo secret | Lets EAS CLI validate Android submit config locally at queue time |
| 3 | `GOOGLE_SERVICE_ACCOUNT_KEY` | EAS project secret (file) | Used by EAS servers when actually submitting the Android build |
| 4 | `APPLE_API_KEY_ID`, `APPLE_API_ISSUER_ID`, `APPLE_API_KEY` | EAS project secrets | Used by EAS servers when submitting the iOS build to App Store Connect |
| 5 | iOS credentials (Distribution Certificate + Provisioning Profile) | EAS credential storage | Used by EAS build servers to sign the iOS binary |

Items 1–2 live in GitHub. Items 3–5 live in EAS (expo.dev). EAS manages iOS credentials
automatically the first time you run a build interactively.

---

## 3. Distribution tracks: iOS vs Android

### iOS

Apple controls who can install an app through code signing. The signing method determines the
distribution channel.

| Track | Who can install | Setup | Review | Notes |
|---|---|---|---|---|
| **Ad-hoc** | Up to 100 specific devices by UDID | Register each device in Apple Developer portal before building | None | Most painful option; avoid in CI |
| **TestFlight — Internal** | Up to 100 people in your App Store Connect team | Just upload; no device registration | None | Instant availability after upload |
| **TestFlight — External** | Up to 10,000 opt-in testers | Upload + invite | Lightweight beta review (~1 day) | For testers outside your team |
| **App Store** | Everyone | Full submission | Full review (1–3 days) | Publicly listed |

This project targets **TestFlight Internal**: every build submitted by EAS appears there immediately,
available to your App Store Connect team members with no review and no device registration.

### Android

Android separates "can this be installed" (just needs signing) from "where is it distributed"
(Play Store tracks or direct sideloading).

| Track | Who can install | Setup | Review | Notes |
|---|---|---|---|---|
| **APK sideload** | Anyone with the file (unknown sources enabled) | None | None | Direct file share; no Play Store |
| **Internal testing** | Up to 100 opted-in testers | Upload AAB | None | Instant; testers join via link |
| **Closed testing (alpha)** | Invited groups | Upload AAB | None | Invite by email or Google Group |
| **Open testing (beta)** | Public opt-in | Upload AAB | Minimal | Anyone can join |
| **Production** | Everyone | Upload AAB | Full review | Publicly listed |

This project targets **Play Store Internal Testing**: instant availability, no review, testers
opt in via a link from the Play Console.

---

## 4. eas build vs eas submit

### `eas build`

Compiles the native app on Expo's cloud infrastructure and produces a signed artifact:

- **iOS** → `.ipa` file, signed with a Distribution Certificate + Provisioning Profile
- **Android** → `.aab` (Android App Bundle), signed with a Keystore

The artifact is stored on Expo's servers. Nothing has reached any store yet.

### `eas submit`

Takes a built artifact and uploads it to the store backend:

- **iOS** → uploads to App Store Connect → build appears in TestFlight for internal testers
- **Android** → uploads to the Play Store track specified in `eas.json` (`internal` in this project)

Uploading does not release the app to users. The stores make it available to testers immediately
(for internal tracks), but promoting to public requires a separate manual step.

### `--auto-submit`

Combines both in one command. After the build completes on EAS servers, EAS automatically
runs submit using the `submit` block in `eas.json`. This is what the CI workflow uses.

**Important:** `--auto-submit` also validates the submit configuration locally (on the GitHub
Actions runner) at queue time. This means the submit credentials must be resolvable in the CI
environment, not just on EAS servers — see the secrets section below for how this is handled.

---

## 5. How eas.json and app.json fit together

### `app.json` — app identity and metadata

Defines who the app is:

```json
{
  "expo": {
    "name": "Panda Quotes",
    "slug": "panda-quotes",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.luxyanastudios.pandaquotes",
      "buildNumber": "6"
    },
    "android": {
      "package": "com.luxyanastudios.pandaquotes",
      "versionCode": 11
    }
  }
}
```

- `version` — human-readable version shown to users (e.g. "1.2.0")
- `buildNumber` (iOS) / `versionCode` (Android) — internal counter the store uses to distinguish
  builds; must increase with every submission. With `appVersionSource: "remote"`, EAS manages
  these remotely and you do not need to commit changes to this file between builds.

### `eas.json` — build and submission configuration

Defines *how* to build and *where* to submit:

```json
{
  "cli": {
    "version": ">= 16.28.0",
    "appVersionSource": "remote"
  },
  "build": {
    "production": {
      "autoIncrement": true,
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "6758789066",
        "ascApiKeyId": "$APPLE_API_KEY_ID",
        "ascApiKeyIssuerId": "$APPLE_API_ISSUER_ID",
        "ascApiKeyPath": "$APPLE_API_KEY"
      },
      "android": {
        "serviceAccountKeyPath": "$GOOGLE_SERVICE_ACCOUNT_KEY",
        "track": "internal"
      }
    }
  }
}
```

**`build.production`**
- `autoIncrement: true` — EAS increments `buildNumber` (iOS) and `versionCode` (Android)
  automatically before each build
- `buildType: "app-bundle"` — produces `.aab` for Android (required for Play Store)
- iOS defaults to store distribution when no `distribution` key is present

**`submit.production`**
- The key name (`production`) matches the build profile name — EAS links them automatically
- iOS fields authenticate with App Store Connect using an API key (non-interactive, works in CI)
- Android `track: "internal"` targets the Play Store internal testing track specifically;
  unlike iOS, Android requires you to explicitly name the track

**The `$VAR` syntax**
Values prefixed with `$` are resolved from EAS project secrets at submit time on EAS servers.
See the next section for the full picture of where each secret lives and why.

---

## 6. Secrets: what they are, where they live, how to create them

Two separate secret stores are involved: **GitHub** and **EAS**.

### Why two stores?

The EAS CLI runs in GitHub Actions to *queue* the build. At queue time it validates the submit
configuration locally — which means submit credentials must be available as environment variables
on the GitHub Actions runner, not just on EAS servers.

Once the build is queued, the actual build and submit run on EAS servers, where EAS secrets
are injected automatically.

Result: Android submit credentials live in both places. Apple and iOS credentials live only in
EAS (Apple's non-interactive API key flow works without local file access).

### GitHub secrets

Stored at: GitHub → repo (or org) → Settings → Secrets and variables → Actions

| Secret | Value | Used by |
|---|---|---|
| `EXPO_TOKEN` | Expo access token | EAS CLI authentication in GitHub Actions |
| `GOOGLE_SERVICE_ACCOUNT_KEY_JSON` | Full JSON content of the service account file | Written to a temp file at build queue time so EAS CLI can validate the submit config locally |

**How to create `EXPO_TOKEN`:**
1. expo.dev → Account Settings → Access Tokens → Create token
2. Add to GitHub as `EXPO_TOKEN`

**How to create `GOOGLE_SERVICE_ACCOUNT_KEY_JSON`:**
1. Google Play Console → Setup → API access → Service accounts → your service account →
   Manage keys → Add key → Create new key (JSON)
2. Paste the entire contents of the downloaded `.json` file as the secret value

### EAS project secrets

Stored at: expo.dev → your project → Secrets

Managed via CLI:
```bash
# String secret
npx eas-cli@latest secret:create --scope project --name SECRET_NAME --value "secret-value"

# File secret (the $VAR resolves to a temp file path on EAS servers)
npx eas-cli@latest secret:create --scope project --name SECRET_NAME --type file --value ./path/to/file
```

| Secret | Type | Value | Used by |
|---|---|---|---|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | File | Google Play service account `.json` file | `eas submit` on EAS servers (Android) |
| `APPLE_API_KEY_ID` | String | Key ID from App Store Connect API key | `eas submit` on EAS servers (iOS) |
| `APPLE_API_ISSUER_ID` | String | Issuer ID from App Store Connect | `eas submit` on EAS servers (iOS) |
| `APPLE_API_KEY` | File | `.p8` private key file downloaded from App Store Connect | `eas submit` on EAS servers (iOS) |

**Where to find Apple values:**
- App Store Connect → Users & Access → Integrations → App Store Connect API
- **Issuer ID**: shown at the top of that page (a UUID)
- **Key ID** and **`.p8` file**: generated when you create a new key (download the `.p8` once —
  Apple does not let you download it again)

**Create EAS secrets:**
```bash
npx eas-cli@latest secret:create --scope project \
  --name GOOGLE_SERVICE_ACCOUNT_KEY --type file --value ./service-account.json

npx eas-cli@latest secret:create --scope project \
  --name APPLE_API_KEY_ID --value "<Key ID>"

npx eas-cli@latest secret:create --scope project \
  --name APPLE_API_ISSUER_ID --value "<Issuer ID>"

npx eas-cli@latest secret:create --scope project \
  --name APPLE_API_KEY --type file --value ./AuthKey_XXXXX.p8
```

**To replace an existing secret:**
```bash
npx eas-cli@latest secret:delete --name SECRET_NAME
npx eas-cli@latest secret:create --scope project --name SECRET_NAME ...
```

---

## 7. The full CI/CD pipeline

### Trigger

Manual only (`workflow_dispatch`). Go to GitHub → Actions → EAS Build → Run workflow.
Select platform: `all`, `ios`, or `android`.

### Workflow steps

```
GitHub Actions runner (ubuntu, ~2–3 min total)
│
├─ Lint job
│   └─ npm ci → npm run lint
│
└─ Build job (needs: lint)
    ├─ npm ci
    ├─ Write $GOOGLE_SERVICE_ACCOUNT_KEY_JSON to /tmp/service-account.json
    └─ eas build --platform <input> --profile production --non-interactive --no-wait --auto-submit
        │
        ├─ Validates submit config (locally, using the temp file above)
        ├─ Queues Android build on EAS servers
        ├─ Queues iOS build on EAS servers
        └─ Exits (GitHub Actions job completes here)

EAS servers (async, after GitHub Actions exits)
│
├─ Android build (~8 min)
│   └─ Signs with Keystore stored in EAS credentials
│   └─ On complete → eas submit (Android)
│       └─ Resolves $GOOGLE_SERVICE_ACCOUNT_KEY from EAS secrets (file type → temp path)
│       └─ Uploads AAB to Play Store internal testing track
│       └─ Available to opted-in testers immediately
│
└─ iOS build (~15 min)
    └─ Signs with Distribution Certificate + Provisioning Profile stored in EAS credentials
    └─ On complete → eas submit (iOS)
        └─ Resolves $APPLE_API_KEY_* from EAS secrets
        └─ Uploads IPA to App Store Connect
        └─ Available to internal testers (App Store Connect team members) immediately
```

### Monitoring builds

After triggering, builds appear at expo.dev → your project → Builds.
GitHub Actions only shows the queue step (~2–3 min); the build logs are on expo.dev.

---

## 8. Releasing to production (manual steps)

Neither submission channel publishes to the public store automatically. To release:

**iOS:**
1. Open TestFlight on your device → install and test the build
2. App Store Connect → your app → App Store → select the build → Submit for Review

**Android:**
1. Google Play Console → your app → Testing → Internal testing → install and test
2. Google Play Console → your app → Production → Create new release → promote the build

---

## 9. Version numbering

| Field | File | Platform | Visible to | Managed by |
|---|---|---|---|---|
| `version` | `app.json` | Both | Users (e.g. "1.2.0") | You, manually in `app.json` |
| `buildNumber` | EAS remote | iOS | Apple / internal only | EAS (`autoIncrement: true`) |
| `versionCode` | EAS remote | Android | Google / internal only | EAS (`autoIncrement: true`) |

With `appVersionSource: "remote"` and `autoIncrement: true`, you only need to bump `version`
in `app.json` when you want the user-facing version to change. Build numbers increment
automatically with every build and do not need to be committed.
