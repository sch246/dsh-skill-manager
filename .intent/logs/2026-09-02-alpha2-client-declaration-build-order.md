# Alpha.2 client declaration build-order failure

Record ID: `SRC-2026-09-02-ALPHA-2-CLIENT-DECLARATION-BUILD-ORDER`

Status: confirmed installation failure during formal alpha.2 recomposition.

## Observed event

On 2026-09-02, `scripts/setup.sh` applied the current Skill-manager Host patch to a clean DeepSeek Harness `0a53fb55bea101816fa226bb964ae2bed71c343b`, regenerated the shared catalogs, and ran the configured Host build. The patched `packages/client/ui-conversation/src/client/contract/slots.ts` contained `conversation.hero.skillCatalogStart`, while its emitted `lib/types/client/contract/slots.d.ts` still reflected the preceding build and omitted that key.

The subsequent Skill-manager browser declaration build failed because `conversation.hero.skillCatalogStart` was absent from the resolved `SlotMap` key union. The setup sequence bundled `@deepseek-ai/dsh-client-ui-conversation` but did not compile that client project's declarations after applying the source patch.

## Decision

When the selected Harness realization separates client source from emitted declarations, setup must compile each patched client interface project after applying the Host patch and before compiling this plugin's browser contribution. A bundle command is not a substitute for declaration emission.

This record describes the failed installation event and the resulting installation requirement. It does not establish user acceptance of the alpha.2 realization.
