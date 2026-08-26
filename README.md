# dsh-skill-manager

An external Host/Web plugin extracted from the five local Skill-enablement commits that previously lived directly on top of DeepSeek Harness `b150a551b8d465e31e418e1b2eaf5e79bbb7d28e`.

The Host half owns the settings-backed disabled-skill policy, `/skills`, and the `skillManager` Remote. The browser half mounts this package's generated Remote contribution through Harness's generic `ctx.remote.$mount(...)` seam, then adds the Skills settings section and the blank-session “inject catalog at start” control. No package-specific Remote import remains in Harness.

Harness compatibility is limited to `patches/deepseek-harness.patch`: generic invocation overrides and all-layer enumeration, the durable catalog-start event and first-step gate, and one hero slot. Every region has nearby `@meta-intent:begin/end dsh-skill-manager` locators. Setup records exact patch ownership in the Harness Git directory; uninstall refuses drifted or externally owned regions.

```bash
DSH_CHECKOUT=/root/deepseek-harness bash scripts/setup.sh
```

Setup applies or recognizes the exact seam, regenerates shared catalogs, rebuilds affected artifacts, builds this package, and links it into the `web` profile. It does not restart `dsh-web`.

```bash
DSH_CHECKOUT=/root/deepseek-harness bash scripts/uninstall.sh
```

The semantic package is under `.intent/`; its candidate lock records what has and has not been observed.
