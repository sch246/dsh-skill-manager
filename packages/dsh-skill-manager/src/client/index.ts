/**
 * Browser half of the external skill manager. It mounts the package's own
 * generated Remote contribution through the generic Client Remote seam, then
 * contributes the Settings section and blank-session catalog control.
 */

import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import skillManagerRemote from '@deepseek-ai/dsh-skill-manager/remote'
import { SkillCatalogStartSeat, type SkillCatalogStartSeatInjected } from './SkillCatalogStartSeat.tsx'
import { SkillsSettingsSection, type SkillsSettingsSectionInjected } from './SkillsSettingsSection.tsx'
import { en, zh, type SkillManagerLocaleKey } from './locales.ts'

export type { SkillCatalogStartSeatInjected, SkillCatalogStartSeatProps } from './SkillCatalogStartSeat.tsx'
export type { SkillsSettingsSectionInjected, SkillsSettingsSectionProps } from './SkillsSettingsSection.tsx'
export type { SkillManagerLocaleKey } from './locales.ts'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Skill management settings and hero copy. */
    'settings.skillManager': SkillManagerLocaleKey
  }
}

/** Dictionary namespace owned by this plugin. */
export const NS = 'settings.skillManager'

/** Services required before this package mounts its Remote and UI contributions. */
export const inject = ['slots', 'locale', 'remote']

/** Mount the generated Remote contribution and then register both UI surfaces. */
export async function apply(ctx: ClientContext): Promise<void> {
  await ctx.effect(
    () => ctx.remote.$mount(skillManagerRemote),
    'dsh-skill-manager: generated Remote contribution',
  )

  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-skill-manager: dictionaries')
  const t = ctx.locale.bind(NS)

  const list: SkillsSettingsSectionInjected['list'] = async () => {
    const result = await ctx.remote.skillManager.list()
    if (!result.ok) throw new Error(`skillManager.list failed: ${result.error.code}: ${result.error.message}`)
    return result.value
  }
  const setDisabled: SkillsSettingsSectionInjected['setDisabled'] = async (name, disabled) => {
    const result = await ctx.remote.skillManager.setDisabled(name, disabled)
    if (!result.ok) throw new Error(`skillManager.setDisabled failed: ${result.error.code}: ${result.error.message}`)
  }
  const sectionInjected = (): SkillsSettingsSectionInjected => ({ list, setDisabled })
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'skills',
    order: 25,
    label: () => t('nav'),
    locale: NS,
    inject: sectionInjected,
  }, SkillsSettingsSection))

  const read: SkillCatalogStartSeatInjected['read'] = async (sessionId) => {
    const result = await ctx.remote.skillManager.catalogAtStart(sessionId)
    if (!result.ok) throw new Error(`skillManager.catalogAtStart failed: ${result.error.code}: ${result.error.message}`)
    return result.value
  }
  const set: SkillCatalogStartSeatInjected['set'] = async (sessionId, enabled) => {
    const result = await ctx.remote.skillManager.setCatalogAtStart(sessionId, enabled)
    if (!result.ok) throw new Error(`skillManager.setCatalogAtStart failed: ${result.error.code}: ${result.error.message}`)
    return result.value.outcome
  }
  const seatInjected = (): SkillCatalogStartSeatInjected => ({ read, set })
  ctx.slots.inject('conversation.hero.skillCatalogStart', () => ctx.slots.register({
    name: 'conversation.hero.skillCatalogStart',
    locale: NS,
    inject: seatInjected,
  }, SkillCatalogStartSeat))
}
