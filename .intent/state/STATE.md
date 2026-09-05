# dsh-skill-manager state

Status: draft current authority for recomposition against DeepSeek Harness `0a53fb55bea101816fa226bb964ae2bed71c343b`. No realization is active or selected as a current candidate.

## Map entry

Use the [installation and maintenance route](#installation-and-maintenance-route) and [removal route](#removal-route) for the selected deployment. The existing protocol 0.2 selection remains unchanged.

## Intent

Provide Skill enablement as one uninstallable external DeepSeek Harness plugin rather than permanent local Harness commits.

The plugin owns one settings-backed disabled-skill authority. A disabled skill is neither model-invocable nor user-invocable; re-enabling restores the winning provider's policy. `/skills` and the Web settings surface are write faces over the same authority. The management list shows all registered skills across global and scoped provider layers without changing their providers.

For a blank session, the Web hero offers a choice to inject the skill catalog on its first model step. The newest logged choice wins. Disabled-at-start suppresses only the initial publication; a later model step may publish the catalog. Once a turn has started, the choice no longer changes that session.

The browser half mounts this package's generated Remote contribution through the Host's generic Client Remote capability. Harness must not statically import this package's Remote or contain this package in official base or Web bundle manifests.

## Installation and maintenance route

From this repository root, select the actual Host checkout, Home and profile; `/root/deepseek-harness`, the ordinary DSH Home and `web` are local defaults. The checkout needs its installed build dependencies. Inspect its revision, local changes, existing Skill-manager registrations and Git-private receipt before applying the [owned patch](../../patches/deepseek-harness.patch). The documented alpha.2 baseline is a known source target, not a claim that the operator's checkout still matches it.

```sh
DSH_CHECKOUT=/root/deepseek-harness DSH_PROFILE=web bash scripts/setup.sh
```

[Setup](../../scripts/setup.sh) applies or recognizes the exact patch, preserves pre-existing ownership, records incomplete installation before building, regenerates persistence/Client/Cordis catalogs, builds Host artifacts and patched ui-conversation declarations and bundle, then runs the [plugin build](../../scripts/build.sh) and profile add. The link target is `packages/dsh-skill-manager`, package identity `@deepseek-ai/dsh-skill-manager`, Bundle row `dsh-skill-manager`; adding the repository root is not equivalent. Host and Client Remote artifacts are generated together. Inspect the selected CLI if `dsh` is on PATH: the scripts prefer it over the checkout CLI.

After profile mutation, check that the dependency, profile lockfile, resolved package and `dsh.profile.bundles` agree, and that composed config has one row. Setup's `install_complete=true` does not establish these runtime observations. A failure after patch application may leave source, generated artifacts or profile state partially updated; inspect the receipt and failing phase, repair and resume the same route. Do not add fallback registrations to make a failed build load.

On a changed Host, inspect invocation overrides/all-layer enumeration, the logged catalog-start gate, hero slot, generic Client Remote mount and tree-external Typert analysis. Reuse equivalent upstream capabilities and retire superseded patch hunks; adapt only missing capabilities. Generic Client Remote mounting and dynamic client loading are already native on alpha.2. Other packages may share ui-conversation, generator mappings and generated catalogs: compose their source contributions without claiming or erasing their effects.

For the affected install or repair, build through the route above, then verify one served `skillManager/catalogAtStart` owner and cold loading. If the official api-remotes artifact still embeds the extracted Remote, rebuild it from current source with `pnpm --filter @deepseek-ai/dsh-api-remotes bundle` in the selected checkout. The [stale-artifact evidence](../logs/2026-08-27-stale-api-remotes-artifact.md) explains why source-only uniqueness is insufficient. Observe settings and `/skills` agreement, disabled/re-enabled invocation and first-turn catalog timing against Acceptance; a map-only edit needs link/JSON checks, not a live reinstall.

## Removal route

```sh
DSH_CHECKOUT=/root/deepseek-harness DSH_PROFILE=web bash scripts/uninstall.sh
```

[Uninstall](../../scripts/uninstall.sh) requires an exact owned `dsh-skill-manager.patch-state` receipt and reverse check, removes the profile package, reverses source, regenerates shared catalogs and rebuilds Host and ui-conversation. For a missing, foreign or drifted receipt it exits before profile removal. Investigate ownership and use the selected `dsh plugin --profile web remove @deepseek-ai/dsh-skill-manager` for profile-only removal when the Host seam belongs elsewhere; shared capabilities stay with their remaining consumers. Verify the plugin's settings/command/UI/Remote effects are absent and provider policy is restored, while preserving settings data and other contributions. Scripts do not restart the service; activation follows the existing deployment authority.

## Current reality

- Plugin source `ec6a90f7d2d34eca0746b7e733ce0617290d6a1e` was the September 1 recomposition input. The map review inspected `6ecbdee0b1175c7dd720db38f9750c6b1c14d061`, including the September 2 setup repair; neither identity establishes current acceptance.
- DeepSeek Harness `0a53fb55bea101816fa226bb964ae2bed71c343b` is the current official target. It has no accepted Skill-manager realization.
- The last retained served-client acceptance observations use Host baseline `cd5ef8148158c3a752a658978873241fdf8e2bbc`. Its served browser manifest had exactly one `skillManager/catalogAtStart` owner after the stale official artifact was rebuilt, and a cold browser load showed no plugin loader failure or console error.
- That live evidence establishes only the repaired single-owner loading path. It does not establish user acceptance of settings, `/skills`, disabled-skill invocation, or blank-session catalog behavior.
- The `b150a551b8d465e31e418e1b2eaf5e79bbb7d28e` extraction baseline and candidate 1 lock are historical evidence. They are not current target or candidate authority.

## Realization ownership

- Product behavior, settings and command writes, Web surfaces, profile composition, build artifacts, setup and uninstall procedures, and any required Host adaptation belong to this package's realization.
- Harness retains only the minimum generic capabilities needed to express the desired behavior. The exact adaptation mechanism is realization-level evidence rather than intent.
- Shared generated catalogs are regenerated from the composed source and are not statically owned by this package.
- When a target Harness compiles client interfaces into separate declaration artifacts, installation compiles every patched client interface after applying the adaptation and before compiling this package's browser contribution. It must not consume declarations left by an earlier source generation.
- Every realization must leave one Skill-manager behavior owner and one settings authority. Compatibility mirrors, fallback registration, static package-specific Remote imports, and second settings write paths are invalid.
- The immutable candidate 1 bundle remains historical extraction evidence after this state revision; it does not claim applicability to the current target.

## Acceptance

- Recompose the plugin against DeepSeek Harness `0a53fb55bea101816fa226bb964ae2bed71c343b` without moving Skill-manager product ownership into Harness.
- Installation leaves exactly one served Skill-manager Remote owner, and a cold browser load completes without plugin loader failure.
- Installation completes from the selected clean Harness target without relying on declaration artifacts produced before its Host adaptation was applied.
- On the user's real machine, settings and `/skills` read and write the same disabled-skill authority; a disabled skill is unavailable to both model and user invocation, and re-enabling restores provider policy.
- On the user's real machine, a blank session records and honors the newest catalog-start choice with the stated first-turn timing.
- Uninstall removes only this package's owned effects and preserves unrelated target changes.

The single-owner served manifest and successful cold load on the last live baseline satisfy only the corresponding loading observations. Settings, command, disabled-skill, catalog-choice, current-target composition, and uninstall acceptance remain pending.

## Constraints and permissions

- Local reversible source adaptation, building, catalog regeneration, profile installation, and structural validation are authorized for realization work.
- Do not publish, push, choose a new license, restart `dsh-web`, or mutate a remote without explicit authority.
- Do not treat build success, structural validation, profile registration, or absence of loader errors as acceptance of user-visible behavior.
- Do not keep a compatibility mirror, fallback, static Remote import, or second settings write path after cutover.

## Non-goals

- A general Skill registry redesign, generic package manager, or package-specific Remote registry parallel to the Host's generic Client Remote capability.
- Preserving the five extracted commits on an active Harness branch or treating their exact implementation as current intent.
- Owning generated catalogs or unrelated sidebar, preset, warm-minimal, settings, documentation, or workspace changes.
