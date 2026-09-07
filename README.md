# dsh-skill-manager

Installation and maintenance start at [STATE](.intent/state/STATE.md), including target drift, ownership, removal and evidence limits.

An external Host/Web plugin recomposed for DeepSeek Harness `0a53fb55bea101816fa226bb964ae2bed71c343b` (`0.1.2-alpha.2`). Its historical source was extracted from five local Skill-enablement commits rather than kept as permanent Harness commits.

The Host half owns the settings-backed disabled-skill policy, `/skills`, and the `skillManager` Remote. The browser half mounts this package's generated Remote contribution through Harness's generic `ctx.remote.$mount(...)` seam, then adds the Skills settings section and the blank-session “inject catalog at start” control. No package-specific Remote import remains in Harness.

Alpha.2 already supplies dynamic `dsh.client` package loading and the generic Client Remote mount, so the plugin does not patch an official Bundle or `@deepseek-ai/dsh-api-remotes` with a package-specific import. Harness compatibility is limited to `patches/deepseek-harness.patch`: generic invocation overrides and all-layer enumeration, the durable catalog-start event and first-step gate, one hero slot, and an opt-in that lets Typert analyze explicitly referenced tree-external packages. The opt-in defaults off, preserving Harness workspace discovery. Every source region has nearby `@meta-intent:begin/end dsh-skill-manager` locators. Setup regenerates the shared persistence, Client, and Cordis catalogs, records exact patch ownership in the Harness Git directory, and uninstall refuses drifted or externally owned regions.

## 开发与安装入口

仓库根目录是 private 开发 workspace；实际 npm 包为 [`packages/dsh-skill-manager`](packages/dsh-skill-manager/package.json)。包路径与 npm 身份保持不变；根目录提供统一开发入口。

```sh
node scripts/plugin.mjs inspect
node scripts/plugin.mjs setup         # 只检查
node scripts/plugin.mjs remove        # 只检查
DSH_CHECKOUT=/absolute/harness DSH_BUILD_TOOLS=/absolute/node_modules node scripts/build.mjs build
DSH_CHECKOUT=/absolute/harness DSH_BUILD_TOOLS=/absolute/node_modules node scripts/build.mjs typecheck
DSH_CHECKOUT=/absolute/harness DSH_HOME=/absolute/dsh-home DSH_PROFILE=web node scripts/plugin.mjs setup --install
DSH_CHECKOUT=/absolute/harness DSH_HOME=/absolute/dsh-home DSH_PROFILE=web node scripts/plugin.mjs remove --remove
```

根 scripts 暴露 `build`、`typecheck`、`setup`、`inspect`、`remove`。固定开发工具为 TypeScript 5.9.3、tsdown 0.22.14、pnpm 10.17.1；构建直接调用已安装 Node 工具，不自动安装依赖。可使用根目录自身的 `node_modules`，或以 `DSH_BUILD_TOOLS` 指向已有工具目录；构建依赖仅创建候选内的独立目录和叶子链接。安装／移除调用明确 checkout 的已构建 CLI，变更 profile 的依赖、锁文件和 Bundle；不会重启服务。Windows 可使用同一 Node 入口，Host 补丁步骤需要 Git Bash。

安装执行原有补丁正反检查、归属凭据、共享 catalog 重生成、Host 相关编译面重建与插件构建，再注册实际包路径。升级时按 STATE 检查上游等价能力并适配或撤销多余补丁；移除只撤销仍归本插件所有且精确匹配的 Host 内容，保留业务数据和其他改动。

The semantic package is under `.intent/`. Its current state selects no active or candidate realization lock; the retained candidate 1 lock is historical extraction evidence only.
