/**
 * The new-session hero seat for the first-step skill-catalog choice: a
 * checkbox beside the agent-preset chip that records, while the session is
 * still blank, whether its first model step injects the skill catalog.
 *
 * The control disappears once a turn has run — the choice only ever governs
 * the first step, and a started session keeps the one it already ran.
 */

import { useEffect, useState, type ReactNode } from 'react'
import type { SessionId } from '@deepseek-ai/dsh-api-remotes/client'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import css from './SkillCatalogStartSeat.module.css'

/** Registration-side Remote face used by the seat. */
export interface SkillCatalogStartSeatInjected {
  /** Read the blank session's current first-step choice. */
  read: (sessionId: SessionId) => Promise<boolean>
  /** Record a new choice; resolves `started` once the session is no longer blank. */
  set: (sessionId: SessionId, enabled: boolean) => Promise<'saved' | 'started'>
}

/** Full component props assembled by the hero slot renderer. */
export type SkillCatalogStartSeatProps =
  PropsRuntime<'conversation.hero.skillCatalogStart'>
  & PropsLocale<'settings.skillManager'>
  & InjectFace<SkillCatalogStartSeatInjected>

/**
 * Render the hero checkbox, or null when no blank session exists.
 * @param props - composed slot props.
 * @returns the labeled checkbox while a blank session is current.
 */
export function SkillCatalogStartSeat({ useSessions, read, set, t }: SkillCatalogStartSeatProps): ReactNode {
  const sessions = useSessions(snapshot => snapshot)
  const current = sessions.current
  const blank = current !== undefined && sessions.byId[current]?.blank === true
  const [enabled, setEnabled] = useState(true)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (current === undefined || !blank) return
    let live = true
    void read(current).then(
      (value) => { if (live) setEnabled(value) },
      () => { if (live) setEnabled(true) },
    )
    return () => { live = false }
  }, [blank, current, read])

  if (current === undefined || !blank) return null

  const toggle = (): void => {
    const next = !enabled
    setEnabled(next)
    setBusy(true)
    void set(current, next).then(
      (outcome) => {
        setBusy(false)
        // A session that started mid-write keeps its already-run first step;
        // the sessions frame flips `blank` and this seat unmounts itself.
        if (outcome === 'started') setEnabled(true)
      },
      () => {
        setBusy(false)
        setEnabled(!next)
      },
    )
  }

  return (
    <label className={css.seat} title={t('seatHint')}>
      <input
        type="checkbox"
        className={css.checkbox}
        checked={enabled}
        disabled={busy}
        onChange={toggle}
      />
      <span>{t('seatLabel')}</span>
    </label>
  )
}
