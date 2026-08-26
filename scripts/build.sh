#!/usr/bin/env bash
# Build the external Host/Web package against one DeepSeek Harness checkout.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGE="$ROOT/packages/dsh-skill-manager"
CHECKOUT="${DSH_CHECKOUT:-/root/deepseek-harness}"

if [ ! -d "$CHECKOUT/packages" ]; then
  echo "build: cannot locate Harness checkout at $CHECKOUT" >&2
  exit 1
fi
if [ ! -x "$CHECKOUT/node_modules/.bin/tsc" ] || [ ! -x "$CHECKOUT/node_modules/.bin/tsdown" ]; then
  echo "build: Harness TypeScript build tools are unavailable" >&2
  exit 1
fi

ensure_link() {
  local link="$1"
  local target="$2"
  if [ -L "$link" ]; then
    rm "$link"
  elif [ -e "$link" ]; then
    echo "build: refusing to replace non-symlink $link" >&2
    exit 1
  fi
  ln -s "$target" "$link"
}

ensure_link "$ROOT/harness" "$CHECKOUT"
ensure_link "$ROOT/node_modules" "$CHECKOUT/node_modules"

mkdir -p "$PACKAGE/node_modules/@types"
ensure_link "$PACKAGE/node_modules/react" "$CHECKOUT/packages/client/ui-renderer/node_modules/react"
ensure_link "$PACKAGE/node_modules/react-dom" "$CHECKOUT/packages/client/ui-renderer/node_modules/react-dom"
ensure_link "$PACKAGE/node_modules/@types/react" "$CHECKOUT/packages/client/ui-renderer/node_modules/@types/react"
ensure_link "$PACKAGE/node_modules/@types/react-dom" "$CHECKOUT/packages/client/ui-renderer/node_modules/@types/react-dom"
ensure_link "$PACKAGE/node_modules/zod" "$CHECKOUT/packages/api/gateway/node_modules/zod"

echo "building Host declarations..."
"$CHECKOUT/node_modules/.bin/tsc" -p "$PACKAGE/tsconfig.json"

echo "bundling Host entry..."
(cd "$PACKAGE" && "$CHECKOUT/node_modules/.bin/tsdown" --config tsdown.host.config.ts)

for artifact in typert.host.js typert.host.d.ts typert.remote-client.js typert.remote-client.d.ts; do
  if [ ! -f "$PACKAGE/lib/$artifact" ]; then
    echo "build: retained Typert artifact is missing: lib/$artifact" >&2
    exit 1
  fi
done

echo "building browser declarations..."
"$CHECKOUT/node_modules/.bin/tsc" -p "$PACKAGE/tsconfig.client.json"

echo "bundling browser contribution..."
(cd "$PACKAGE" && "$CHECKOUT/node_modules/.bin/tsdown" --config tsdown.client.config.ts)

echo "build: complete"
