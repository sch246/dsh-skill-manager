/**
 * The `skillManager` Remote: management reads and writes for configuration
 * surfaces. Reads serve the invocation-neutral catalog with the disabled
 * state; writes commit through the settings seam or the session log, never
 * around it.
 * @module @deepseek-ai/dsh-skill-manager/remote
 */

import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-skill'
import type { Session } from '@deepseek-ai/dsh-session'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import type { SkillCatalogStartResult, SkillManagerList } from './types.ts'

declare module '@deepseek-ai/dsh-session/types' {
  interface SessionEventMap {
    /** Newest choice wins; absent means publish the catalog on the first model step. */
    'skill/catalog-at-start': { enabled: boolean }
  }
}

/** Capabilities the plugin body hands to the Remote instance. */
export interface SkillManagerRemoteDeps {
  /** Current resolved settings value. */
  readonly current: () => { readonly disabled: Readonly<Record<string, boolean>> }
  /** Persist one skill's disabled flag through the settings seam. */
  readonly setDisabled: (name: string, disabled: boolean) => Promise<void>
}

/** Whether one session has started a turn; catalog-at-start choices stop then. */
function sessionHasTurn(session: Session): boolean {
  return session.events.some(event => event.type === 'turn/start')
}

/** Management Remote addressed by `sessionId` for the per-session choice. */
export class SkillManagerRemote extends TypertRemoteService {
  /**
   * @param ctx - host-plane plugin context.
   * @param deps - settings read/write capabilities shared with the plugin body.
   */
  constructor(ctx: Context, private readonly deps: SkillManagerRemoteDeps) {
    super(ctx, 'skillManager')
  }

  /**
   * Serve the complete invocation-neutral catalog with current disabled state.
   * @returns one sorted row per winning skill across every registry layer.
   */
  @Remote('list')
  async list(): Promise<SkillManagerList> {
    const skills = await this.ctx.skills.listAll()
    const { disabled } = this.deps.current()
    return {
      skills: skills.map(skill => ({
        name: skill.name,
        description: skill.description,
        disabled: disabled[skill.name] === true,
      })),
    }
  }

  /**
   * Fully disable or re-enable one skill. The settings commit applies the
   * invocation override and hot-reloads the session catalog.
   * @param name - kebab-case skill name.
   * @param disabled - `true` disables, `false` re-enables.
   * @returns the catalog after the committed change.
   */
  @Remote('setDisabled')
  async setDisabled(name: string, disabled: boolean): Promise<SkillManagerList> {
    await this.deps.setDisabled(name, disabled)
    return this.list()
  }

  /**
   * Read the session's first-step catalog choice, newest event winning.
   * @param session - exact live session resolved from the wire identity.
   * @returns whether the first step injects the catalog; `true` while unset.
   */
  @Remote('catalogAtStart')
  catalogAtStart(session: Session): boolean {
    return catalogStartEnabled(session.events)
  }

  /**
   * Record whether this session's first model step injects the skill catalog.
   * Allowed only while the session is blank; the newest choice wins and a
   * started session keeps its already-run first step.
   * @param session - exact live session resolved from the wire identity.
   * @param enabled - whether the first step injects the catalog.
   * @returns the recorded choice, or `started` when a turn already ran.
   */
  @Remote('setCatalogAtStart')
  setCatalogAtStart(session: Session, enabled: boolean): SkillCatalogStartResult {
    if (sessionHasTurn(session)) return { outcome: 'started' }
    session.append('skill/catalog-at-start', { enabled })
    return { outcome: 'saved', enabled }
  }
}

/** The per-session first-step catalog choice, newest event winning; absent means inject. */
function catalogStartEnabled(events: readonly Session['events'][number][]): boolean {
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const event = events[index]
    if (event?.type === 'skill/catalog-at-start') return event.data.enabled
  }
  return true
}
