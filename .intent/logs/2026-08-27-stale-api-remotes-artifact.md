# Stale API Remotes artifact duplicated the extracted Remote

Record ID: `SRC-2026-08-27-STALE-API-REMOTES-ARTIFACT`

Status: checked implementation mismatch and repair boundary. It does not revise skill-manager intent, accept a realization, or change the selected protocol.

The running Web client reported that direct method `skillManager/catalogAtStart` was already mounted while applying the external `@deepseek-ai/dsh-skill-manager` entry. Final composed config, the browser boot manifest, the external package source, and its built client each contain only one skill-manager row and one explicit Remote mount.

Inspection of the actually served client bundles found the same `skillManager` Remote descriptors in two bundles: the external skill-manager client and the official `@deepseek-ai/dsh-api-remotes` client. Current `packages/api/remotes/src/client/index.ts` does not select skill-manager, while its ignored `lib/client.js` still contains a historical `packages/skill/skill-manager` contribution from before extraction. Git reset removed the source selection but intentionally did not remove ignored build output.

The repair is to rebuild `@deepseek-ai/dsh-api-remotes` from current source, not to tolerate duplicate direct methods or remove the external package's lifecycle-owned mount. Verification must show that the rebuilt official bundle no longer contains `skillManager`, all relevant tests and builds pass, the served bundle scan finds exactly one owner, and the managed Web service restarts without the loader failure.
