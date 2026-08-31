# Stale API Remotes artifact repair evidence

Record ID: `SRC-2026-08-27-STALE-API-REMOTES-REBUILD-EVIDENCE`

Status: verified implementation repair. It does not revise skill-manager intent, accept a realization, or change the selected protocol.

`@deepseek-ai/dsh-api-remotes` was rebuilt from the current harness source. The rebuilt `packages/api/remotes/lib/client.js` contains neither `skillManager` nor `dsh-skill-manager`. The focused API Remotes and gateway test run passed 36 tests in two files, including the gateway's duplicate direct-method protection.

The managed `dsh-web` service was restarted through systemd and returned HTTP 200. A scan of all 46 client entries in the served boot manifest found `skillManager/catalogAtStart` in exactly one owner, `@deepseek-ai/dsh-skill-manager`; the official API Remotes bundle no longer contributed it.

A headless Chromium cold load returned HTTP 200, displayed no `Failed to load plugins` text, and produced no page or console errors. The duplicate registration failure is therefore resolved without weakening gateway uniqueness or changing the external plugin's registration lifecycle.
