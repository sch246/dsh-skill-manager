#!/usr/bin/env bash
# Install the external plugin and its exact, locator-marked Harness seam.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGE="$ROOT/packages/dsh-skill-manager"
PROFILE="${DSH_PROFILE:-web}"
CHECKOUT="${DSH_CHECKOUT:-/root/deepseek-harness}"
PATCH="$ROOT/patches/deepseek-harness.patch"

if [ ! -d "$CHECKOUT/packages" ] || ! git -C "$CHECKOUT" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "setup: invalid Harness checkout: $CHECKOUT" >&2
  exit 1
fi
if [ ! -f "$PATCH" ]; then
  echo "setup: missing compatibility patch: $PATCH" >&2
  exit 1
fi

PATCH_SHA="$(sha256sum "$PATCH" | awk '{print $1}')"
STATE_FILE="$(git -C "$CHECKOUT" rev-parse --git-path dsh-skill-manager.patch-state)"
if [[ "$STATE_FILE" != /* ]]; then STATE_FILE="$CHECKOUT/$STATE_FILE"; fi
RECORDED_SHA=""
RECORDED_OWNED=""
if [ -f "$STATE_FILE" ]; then
  RECORDED_SHA="$(sed -n 's/^patch_sha256=//p' "$STATE_FILE")"
  RECORDED_OWNED="$(sed -n 's/^patch_applied_by_setup=//p' "$STATE_FILE")"
fi
PATCH_APPLIED_BY_SETUP=false

write_receipt() {
  local install_complete="$1"
  {
    echo "patch_sha256=$PATCH_SHA"
    echo "patch_applied_by_setup=$PATCH_APPLIED_BY_SETUP"
    echo "install_complete=$install_complete"
    echo "host_head=$(git -C "$CHECKOUT" rev-parse HEAD)"
    echo "marker_schema=meta-intent-source-region/0.1"
    echo "regions=skill.invocation-overrides,skill.catalog-at-start,conversation.hero.skill-catalog-start,typert.external-project-references"
    echo "generated_catalogs=docs/persistence-catalog.md,docs/subsystems/skills.md,docs/subsystems/skills.zh.md,docs/subsystems/skills.i18n.yaml,packages/core/session/src/known-event-types.ts,packages/extensions/cordis-client-runner/src/client/slot-catalog.ts,packages/extensions/cordis-client-runner/src/client/api-catalog.ts,packages/extensions/tool-cordis/src/api-catalog.ts"
  } > "$STATE_FILE"
}

verify_markers() {
  local needle='@meta-intent:begin dsh-skill-manager '
  local paths=(
    packages/core/scope/src/store.ts
    packages/skill/skill/src/index.ts
    packages/skill/tool-skill/src/index.ts
    packages/client/ui-conversation/src/client/apply.ts
    packages/client/ui-conversation/src/client/contract/slots.ts
    packages/client/ui-conversation/src/client/skeleton/ConversationRoot.tsx
    packages/typert/generator/src/analyzer.ts
    packages/typert/generator/src/workspace.ts
    scripts/gen-cordis-catalog.ts
  )
  for path in "${paths[@]}"; do
    if ! grep -Fq "$needle" "$CHECKOUT/$path"; then
      echo "setup: locator missing from $path" >&2
      return 1
    fi
  done
}

if git -C "$CHECKOUT" apply --check --reverse "$PATCH" 2>/dev/null; then
  if [ "$RECORDED_SHA" = "$PATCH_SHA" ] && [ "$RECORDED_OWNED" = true ]; then
    PATCH_APPLIED_BY_SETUP=true
    echo "setup: exact owned compatibility patch already present"
  else
    echo "setup: compatibility seam already present; preserving external ownership"
  fi
elif git -C "$CHECKOUT" apply --check "$PATCH"; then
  git -C "$CHECKOUT" apply "$PATCH"
  PATCH_APPLIED_BY_SETUP=true
else
  echo "setup: compatibility patch neither applies nor reverses cleanly" >&2
  exit 1
fi

verify_markers

# Persist ownership as soon as the seam is present. If a later build fails, a
# rerun can resume without misclassifying our patch as externally owned.
write_receipt false

echo "setup: regenerating shared catalogs..."
(cd "$CHECKOUT" && pnpm run gen-persistence-catalog && pnpm run gen-client-catalog && pnpm run gen-cordis-api)

echo "setup: rebuilding changed Harness artifacts..."
(cd "$CHECKOUT" && pnpm run build:lib:host)
(cd "$CHECKOUT" && pnpm --filter @deepseek-ai/dsh-client-ui-conversation bundle)

DSH_CHECKOUT="$CHECKOUT" bash "$ROOT/scripts/build.sh"

CHECKOUT_CLI="$CHECKOUT/apps/cli/lib/bin.js"
if command -v dsh >/dev/null 2>&1; then
  (cd "$PACKAGE" && dsh plugin --profile "$PROFILE" add .)
elif [ -f "$CHECKOUT_CLI" ]; then
  (cd "$PACKAGE" && node "$CHECKOUT_CLI" plugin --profile "$PROFILE" add .)
else
  (cd "$PACKAGE" && pnpm --dir "$CHECKOUT" dsh plugin --profile "$PROFILE" add .)
fi

write_receipt true

echo "setup: installed into profile $PROFILE; no service restart was performed"
