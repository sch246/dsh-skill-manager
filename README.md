# dsh-skill-manager

An external Host/Web plugin recomposed for DeepSeek Harness `0a53fb55bea101816fa226bb964ae2bed71c343b` (`0.1.2-alpha.2`). Its historical source was extracted from five local Skill-enablement commits rather than kept as permanent Harness commits.

The Host half owns the settings-backed disabled-skill policy, `/skills`, and the `skillManager` Remote. The browser half mounts this package's generated Remote contribution through Harness's generic `ctx.remote.$mount(...)` seam, then adds the Skills settings section and the blank-session “inject catalog at start” control. No package-specific Remote import remains in Harness.

Alpha.2 already supplies dynamic `dsh.client` package loading and the generic Client Remote mount, so the plugin does not patch an official Bundle or `@deepseek-ai/dsh-api-remotes` with a package-specific import. Harness compatibility is limited to `patches/deepseek-harness.patch`: generic invocation overrides and all-layer enumeration, the durable catalog-start event and first-step gate, one hero slot, and an opt-in that lets Typert analyze explicitly referenced tree-external packages. The opt-in defaults off, preserving Harness workspace discovery. Every source region has nearby `@meta-intent:begin/end dsh-skill-manager` locators. Setup regenerates the shared persistence, Client, and Cordis catalogs, records exact patch ownership in the Harness Git directory, and uninstall refuses drifted or externally owned regions.

```bash
DSH_CHECKOUT=/root/deepseek-harness bash scripts/setup.sh
```

Setup applies or recognizes the exact seam, regenerates shared catalogs, rebuilds affected artifacts, regenerates this package's Host and Client Remote Typert artifacts against the selected Harness checkout, builds the browser contribution, and links the Bundle into the `web` profile. It does not restart `dsh-web`.

```bash
DSH_CHECKOUT=/root/deepseek-harness bash scripts/uninstall.sh
```

The semantic package is under `.intent/`. Its current state selects no active or candidate realization lock; the retained candidate 1 lock is historical extraction evidence only.
