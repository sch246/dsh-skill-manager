# Five-commit Skill-enablement extraction

## Desired change

The user directed that the five local commits above official Harness baseline `b150a551b8d465e31e418e1b2eaf5e79bbb7d28e` be removed from the Harness branch. Their desired behavior must instead be reverse-engineered into a meta-intent package, with only necessary Host seams retained as this plugin's minimal compatibility patch and every intrusive region marked by a nearby locator.

The user additionally directed that the static Remote mount be removed in favor of a general contribution seam, that the plugin be installed, shared catalogs regenerated, and unrelated existing uncommitted interventions such as right-sidebar and preset-manager preserved.

## Checked reality

- `b642a10626a950cc95c2d6f839810cb01fe599fe` is exactly five commits above the official remote baseline and contains the complete Skill-enablement implementation plus follow-up tests and snapshots.
- The behavior divides into one Host/Web plugin and a smaller Host compatibility surface: `SkillRegistry` invocation overrides/all-layer listing, one logged session choice consumed by `tool-skill`, and one UI slot.
- `TypertClientRemote.$mount(contribution)` already exists as a generic lifecycle-owned Remote contribution seam. The package can mount its own generated artifact; no new registry or static `api-remotes` import is required.
- Current unrelated dirty Harness paths do not directly overlap the five commits, but generated catalogs must be regenerated after composition so stale Skill-manager rows and other plugins' contributions are handled together.

## Classification and decision

This is a realization migration and authority transfer, not an intent revision. The plugin becomes the only owner of Skill-manager product behavior. Harness retains only the compatibility seam, represented by the plugin-owned patch, local locators, and installation receipt. Generated catalogs remain shared synthesis output rather than patch-owned files.

The user explicitly requested local installation and the Harness branch reset. They did not request publishing, pushing, or restarting the service.
