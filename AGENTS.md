# Agent entry

This repository hosts an embedded intent package and an installable DeepSeek Harness plugin.

- Semantic root: `.intent/`; read `.intent/state/STATE.json` and its selected protocol before changing lifecycle or compatibility behavior.
- Installable package root: `packages/dsh-skill-manager/`.
- The package owns `patches/deepseek-harness.patch`; every intrusive source region carries a nearby `dsh-skill-manager` locator, while the Git-private receipt written by `scripts/setup.sh` is the removal authority.
- Shared generated catalogs are regenerated from current source contributions and are not statically owned by this package.
- Do not restart `dsh-web`, publish, push, or mutate a remote without explicit user authority.
