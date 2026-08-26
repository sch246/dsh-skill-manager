# dsh-skill-manager state

Status: draft reconstruction authorized for local realization by the user's 2026-08-26 extraction request.

## Intent

Provide Skill enablement as one uninstallable external DeepSeek Harness plugin instead of five permanent local Harness commits.

The plugin owns one settings-backed disabled-skill table. A disabled skill is neither model-invocable nor user-invocable; re-enabling restores the winning provider's policy. `/skills` and the Web settings surface are write faces over the same settings authority. The management list shows all registered skills across global and scoped provider layers without changing their providers.

For a blank session, the Web hero offers a choice to inject the skill catalog on its first model step. The newest logged choice wins. Disabled-at-start suppresses only the initial publication; a later model step may publish the catalog. Once a turn has started, the choice no longer changes that session.

The browser half mounts this package's generated Remote contribution through the Host's generic Client Remote mount capability. Harness must not statically import this package's Remote or contain this package in official base/Web bundle manifests.

## Realization ownership

- Product behavior, Host Remote, settings/command writes, Web surfaces, profile bundle row, build artifacts, setup/uninstall procedures, and compatibility patch belong to this package.
- Harness retains only the smallest compatibility seam needed by that behavior: runtime invocation-policy overrides and all-layer enumeration, the durable session event and first-step gate, and one lifecycle-owned hero slot.
- Every intrusive source region has nearby package-delimited locator comments. Locators are navigation evidence, not removal authority.
- Setup records the exact patch digest and whether it applied the patch in a Git-private receipt. Uninstall may reverse only an exact owned patch that still reverse-applies; drift stops mutation.
- Shared generated catalogs are regenerated from the current composed source and are not owned as static patch bytes.
- The current candidate retains the Typert Host/Remote artifacts generated in the five-commit source assembly. Out-of-tree regeneration is not claimed; changing Remote signatures requires a new candidate that regenerates and rebinds those artifacts.

## Acceptance

- The package builds Host, Typert Remote, browser, and declaration artifacts against official Harness baseline `b150a551b8d465e31e418e1b2eaf5e79bbb7d28e` plus independently owned local interventions.
- Its compatibility patch applies or exactly reverse-applies, every modified source region is locator-delimited, and removal preserves unrelated dirty work.
- Installation links `@deepseek-ai/dsh-skill-manager` into the `web` profile and regenerates shared catalogs without a package-specific static Remote row in `@deepseek-ai/dsh-api-remotes`.
- The Harness branch points to the official baseline rather than carrying the five extracted commits; right-sidebar, preset-manager, and other pre-existing uncommitted interventions remain present.
- Runtime/UI behavior remains pending user observation until the service is reloaded or restarted under explicit authority.

## Constraints and permissions

- Local reversible source patching, building, catalog regeneration, and profile installation are authorized by the extraction request.
- Do not publish, push, choose a new license, or restart `dsh-web` without explicit authority.
- Do not treat build, Git cleanliness, structural validation, or profile registration as user-visible acceptance.
- Do not keep a compatibility mirror, fallback, static Remote import, or second settings write path after cutover.

## Non-goals

- A general Skill registry redesign, generic package manager, or new Remote registry parallel to `TypertClientRemote.$mount`.
- Preserving the five commits on the active Harness branch, their test-only follow-up commits, or their Web golden changes.
- Owning generated catalogs or unrelated right-sidebar, preset-manager, warm-minimal, settings, documentation, or workspace changes.
