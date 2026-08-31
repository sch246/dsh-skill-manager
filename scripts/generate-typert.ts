/** Generate this tree-external package's Typert artifacts with the selected Harness toolchain. */

import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { WorkspaceTypertGenerator } from '../harness/packages/typert/generator/lib/types/index.js'

const root = fileURLToPath(new URL('..', import.meta.url))
const output = fileURLToPath(new URL('../packages/dsh-skill-manager/lib', import.meta.url))
const generator = new WorkspaceTypertGenerator(root, {
  checkDiagnostics: false,
  externalProjectReferences: true,
})
const artifacts = generator.generate(['@deepseek-ai/dsh-skill-manager'], ['host'])

if (artifacts.length !== 1 || artifacts[0]?.remote === undefined) {
  throw new Error('generate-typert: expected one Host artifact with Client Remote output')
}

const [artifact] = artifacts
mkdirSync(output, { recursive: true })
writeFileSync(`${output}/typert.host.js`, artifact.js)
writeFileSync(`${output}/typert.host.d.ts`, artifact.dts)
writeFileSync(`${output}/typert.remote-client.js`, artifact.remote.js)
writeFileSync(`${output}/typert.remote-client.d.ts`, artifact.remote.dts)
writeFileSync(`${output}/typert.remote-client.d.ts.map`, artifact.remote.dtsMap)
