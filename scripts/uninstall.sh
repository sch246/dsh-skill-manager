#!/usr/bin/env bash
# Remove the profile entry and only the exact Harness seam owned by setup.sh.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGE_NAME='@deepseek-ai/dsh-skill-manager'
PROFILE="${DSH_PROFILE:-web}"
CHECKOUT="${DSH_CHECKOUT:-/root/deepseek-harness}"
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

CHECKOUT_CLI="$CHECKOUT/apps/cli/lib/bin.js"
if command -v dsh >/dev/null 2>&1; then
  dsh plugin --profile "$PROFILE" remove "$PACKAGE_NAME"
elif [ -f "$CHECKOUT_CLI" ]; then
  node "$CHECKOUT_CLI" plugin --profile "$PROFILE" remove "$PACKAGE_NAME"
else
  pnpm --dir "$CHECKOUT" dsh plugin --profile "$PROFILE" remove "$PACKAGE_NAME"
fi

git -C "$CHECKOUT" apply --reverse "$PATCH"
(cd "$CHECKOUT" && pnpm run gen-persistence-catalog && pnpm run gen-client-catalog && pnpm run gen-cordis-api)
(cd "$CHECKOUT" && pnpm run build:lib:host)
(cd "$CHECKOUT" && pnpm --filter @deepseek-ai/dsh-client-ui-conversation bundle)
rm "$STATE_FILE"

echo "uninstall: removed owned contribution; no service restart was performed"
