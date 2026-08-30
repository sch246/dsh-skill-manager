/**
 * Browser half of the external skill manager. It mounts the package's own
 * generated Remote contribution through the generic Client Remote seam, then
 * contributes the Settings section and blank-session catalog control.
 */

import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
// Type-only: pulls the SlotRegistry service merge (ctx.slots).
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import skillManagerRemote from '@deepseek-ai/dsh-skill-manager/remote'
import type { Context } from '@deepseek-ai/cordis'
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
export async function apply(ctx: Context): Promise<void> {
  await ctx.effect(
    () => ctx.remote.$mount(skillManagerRemote),
    'dsh-skill-manager: generated Remote contribution',
  )

  ctx.inject(['remote.skillManager'], (scope: Context) => {
    scope.effect(() => scope.locale.register(NS, { zh, en }), 'dsh-skill-manager: dictionaries')
    const t = scope.locale.bind(NS)

    const list: SkillsSettingsSectionInjected['list'] = async () => {
      const result = await scope.remote.skillManager.list()
      if (!result.ok) throw new Error(`skillManager.list failed: ${result.error.code}: ${result.error.message}`)
      return result.value
    }
    const setDisabled: SkillsSettingsSectionInjected['setDisabled'] = async (name, disabled) => {
      const result = await scope.remote.skillManager.setDisabled(name, disabled)
      if (!result.ok) throw new Error(`skillManager.setDisabled failed: ${result.error.code}: ${result.error.message}`)
    }
    const sectionInjected = (): SkillsSettingsSectionInjected => ({ list, setDisabled })
    scope.slots.inject('settings.section', () => scope.slots.register({
      name: 'settings.section',
      id: 'skills',
      order: 25,
      label: () => t('nav'),
      locale: NS,
      inject: sectionInjected,
    }, SkillsSettingsSection))

    const read: SkillCatalogStartSeatInjected['read'] = async (sessionId) => {
      const result = await scope.remote.skillManager.catalogAtStart(sessionId)
      if (!result.ok) throw new Error(`skillManager.catalogAtStart failed: ${result.error.code}: ${result.error.message}`)
      return result.value
    }
    const set: SkillCatalogStartSeatInjected['set'] = async (sessionId, enabled) => {
      const result = await scope.remote.skillManager.setCatalogAtStart(sessionId, enabled)
      if (!result.ok) throw new Error(`skillManager.setCatalogAtStart failed: ${result.error.code}: ${result.error.message}`)
      return result.value.outcome
    }
    const seatInjected = (): SkillCatalogStartSeatInjected => ({ read, set })
    scope.slots.inject('conversation.hero.skillCatalogStart', () => scope.slots.register({
      name: 'conversation.hero.skillCatalogStart',
      locale: NS,
      inject: seatInjected,
    }, SkillCatalogStartSeat))
  })
}
