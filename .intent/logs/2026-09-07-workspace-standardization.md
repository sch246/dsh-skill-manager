# Workspace standardization — 2026-09-07

The user selected a private root workspace, package-local runtime artifacts, common explicit installation entries and MIT while preserving plugin identities and behavior. No live installation, profile migration, Host mutation, service restart or push was performed in this candidate worktree.

Build and typecheck use existing TypeScript 5.9.3 and tsdown 0.22.14 through direct Node calls. Source and Host patch contents are unchanged. Patch ownership is recorded before generators; profile CLI failures propagate. Historical map observations below are retained as evidence rather than operational requirements.

## Current reality

- Plugin source `ec6a90f7d2d34eca0746b7e733ce0617290d6a1e` was the September 1 recomposition input. The map review inspected `6ecbdee0b1175c7dd720db38f9750c6b1c14d061`, including the September 2 setup repair; neither identity establishes current acceptance.
- DeepSeek Harness `0a53fb55bea101816fa226bb964ae2bed71c343b` is the current official target. It has no accepted Skill-manager realization.
- The last retained served-client acceptance observations use Host baseline `cd5ef8148158c3a752a658978873241fdf8e2bbc`. Its served browser manifest had exactly one `skillManager/catalogAtStart` owner after the stale official artifact was rebuilt, and a cold browser load showed no plugin loader failure or console error.
- That live evidence establishes only the repaired single-owner loading path. It does not establish user acceptance of settings, `/skills`, disabled-skill invocation, or blank-session catalog behavior.
- The `b150a551b8d465e31e418e1b2eaf5e79bbb7d28e` extraction baseline and candidate 1 lock are historical evidence. They are not current target or candidate authority.

## Candidate verification

`DSH_CHECKOUT=/root/deepseek-harness DSH_BUILD_TOOLS=/root/dsh-decoupling-apply/sidebar/node_modules node scripts/build.mjs build` passed with TypeScript 5.9.3 and tsdown 0.22.14. After that external tools path became unavailable during concurrent cleanup, `DSH_CHECKOUT=/root/deepseek-harness DSH_BUILD_TOOLS=/root/dsh-block-edit/user-files/node_modules node scripts/build.mjs typecheck` passed against the same versions. Default inspect/setup/remove and shell/Node syntax checks passed. No behavior test or live deployment acceptance was run for this mechanical layout change.
