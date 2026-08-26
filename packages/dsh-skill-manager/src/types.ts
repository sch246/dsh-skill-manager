/**
 * Client-safe wire vocabulary of the skill manager: the settings section
 * value and the Remote method results. Types only — nothing here reaches a
 * Host-only symbol.
 * @module @deepseek-ai/dsh-skill-manager/types
 */

/** Stored settings section: kebab-case skill name to its disabled flag. */
export interface SkillManagerSettings {
  /** `true` disables the named skill; absent or `false` keeps it enabled. */
  readonly disabled: Readonly<Record<string, boolean>>
}

/** One management-catalog row: skill identity plus the current disabled state. */
export interface SkillManagerEntry {
  /** Kebab-case skill name. */
  readonly name: string
  /** Short routing description shown by the settings surface. */
  readonly description: string
  /** Whether the skill is currently fully disabled. */
  readonly disabled: boolean
}

/** Result of `skillManager.list` and `skillManager.setDisabled`. */
export interface SkillManagerList {
  /** Complete invocation-neutral catalog with disabled state, sorted by name. */
  readonly skills: readonly SkillManagerEntry[]
}

/** Result of `skillManager.setCatalogAtStart`. */
export type SkillCatalogStartResult =
  | {
    /** The choice was recorded for the still-blank session. */
    readonly outcome: 'saved'
    readonly enabled: boolean
  }
  | {
    /** The session already ran a turn; the choice no longer changes anything. */
    readonly outcome: 'started'
  }
