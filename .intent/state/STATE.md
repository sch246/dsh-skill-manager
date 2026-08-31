# dsh-skill-manager state

Status: draft current authority for recomposition against DeepSeek Harness `0a53fb55bea101816fa226bb964ae2bed71c343b`. No realization is active or selected as a current candidate.

## Intent

Provide Skill enablement as one uninstallable external DeepSeek Harness plugin rather than permanent local Harness commits.

The plugin owns one settings-backed disabled-skill authority. A disabled skill is neither model-invocable nor user-invocable; re-enabling restores the winning provider's policy. `/skills` and the Web settings surface are write faces over the same authority. The management list shows all registered skills across global and scoped provider layers without changing their providers.

For a blank session, the Web hero offers a choice to inject the skill catalog on its first model step. The newest logged choice wins. Disabled-at-start suppresses only the initial publication; a later model step may publish the catalog. Once a turn has started, the choice no longer changes that session.

The browser half mounts this package's generated Remote contribution through the Host's generic Client Remote capability. Harness must not statically import this package's Remote or contain this package in official base or Web bundle manifests.

## Current reality

- Plugin source revision `ec6a90f7d2d34eca0746b7e733ce0617290d6a1e` is the latest committed source available for recomposition.
- DeepSeek Harness `0a53fb55bea101816fa226bb964ae2bed71c343b` is the current official target. It has no accepted Skill-manager realization.
- The last live-composed Host baseline is `cd5ef8148158c3a752a658978873241fdf8e2bbc`. Its served browser manifest had exactly one `skillManager/catalogAtStart` owner after the stale official artifact was rebuilt, and a cold browser load showed no plugin loader failure or console error.
- That live evidence establishes only the repaired single-owner loading path. It does not establish user acceptance of settings, `/skills`, disabled-skill invocation, or blank-session catalog behavior.
- The `b150a551b8d465e31e418e1b2eaf5e79bbb7d28e` extraction baseline and candidate 1 lock are historical evidence. They are not current target or candidate authority.

## Realization ownership

- Product behavior, settings and command writes, Web surfaces, profile composition, build artifacts, setup and uninstall procedures, and any required Host adaptation belong to this package's realization.
- Harness retains only the minimum generic capabilities needed to express the desired behavior. The exact adaptation mechanism is realization-level evidence rather than intent.
- Shared generated catalogs are regenerated from the composed source and are not statically owned by this package.
- Every realization must leave one Skill-manager behavior owner and one settings authority. Compatibility mirrors, fallback registration, static package-specific Remote imports, and second settings write paths are invalid.
- The immutable candidate 1 bundle remains historical extraction evidence after this state revision; it does not claim applicability to the current target.

## Acceptance

- Recompose the plugin against DeepSeek Harness `0a53fb55bea101816fa226bb964ae2bed71c343b` without moving Skill-manager product ownership into Harness.
- Installation leaves exactly one served Skill-manager Remote owner, and a cold browser load completes without plugin loader failure.
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
