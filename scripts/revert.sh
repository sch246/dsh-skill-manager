#!/usr/bin/env bash
# Remove the profile entry and only the exact Harness seam owned by setup.sh.
set -euo pipefail
: "${DSH_HOME:?set DSH_HOME}"
: "${DSH_PROFILE:?set DSH_PROFILE}"
: "${DSH_CHECKOUT:?set DSH_CHECKOUT}"
TSC="${DSH_BUILD_TOOLS:-$DSH_CHECKOUT/node_modules}/typescript/bin/tsc"
TSDOWN="${DSH_BUILD_TOOLS:-$DSH_CHECKOUT/node_modules}/tsdown/dist/run.mjs"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGE_NAME='@deepseek-ai/dsh-skill-manager'
PROFILE="${DSH_PROFILE:?set DSH_PROFILE}"
CHECKOUT="${DSH_CHECKOUT:?set DSH_CHECKOUT}"
PATCH="$ROOT/patches/deepseek-harness.patch"
PATCH_SHA="$(sha256sum "$PATCH" | awk '{print $1}')"
STATE_FILE="$(git -C "$CHECKOUT" rev-parse --git-path dsh-skill-manager.patch-state)"
if [[ "$STATE_FILE" != /* ]]; then STATE_FILE="$CHECKOUT/$STATE_FILE"; fi

if [ ! -f "$STATE_FILE" ]; then
  echo "uninstall: ownership receipt is missing; refusing to alter Harness source" >&2
  exit 1
fi
RECORDED_SHA="$(sed -n 's/^patch_sha256=//p' "$STATE_FILE")"
RECORDED_OWNED="$(sed -n 's/^patch_applied_by_setup=//p' "$STATE_FILE")"
if [ "$RECORDED_SHA" != "$PATCH_SHA" ] || [ "$RECORDED_OWNED" != true ]; then
  echo "uninstall: this setup does not own the exact installed patch" >&2
  exit 1
fi
if ! git -C "$CHECKOUT" apply --check --reverse "$PATCH"; then
  echo "uninstall: owned regions drifted; refusing blind reversal" >&2
  exit 1
fi

node "$CHECKOUT/apps/cli/lib/bin.js" plugin --profile "$DSH_PROFILE" remove "$PACKAGE_NAME"

git -C "$CHECKOUT" apply --reverse "$PATCH"
(cd "$CHECKOUT" && node --import tsx/esm scripts/gen-persistence-catalog.ts && node --import tsx/esm scripts/gen-client-catalog.ts && node --import tsx/esm scripts/gen-cordis-api.ts)
(cd "$CHECKOUT" && node --max-old-space-size=4096 "$TSC" -b tsconfig.host.json && node "$TSDOWN" --env.DSH_BUILD_FACE host)
(cd "$CHECKOUT" && (cd packages/client/ui-conversation && node "$TSDOWN"))
rm "$STATE_FILE"

echo "uninstall: removed owned contribution; no service restart was performed"
