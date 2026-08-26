/**
 * The skill management Settings section: one toggle row per skill over the
 * `skillManager` Remote. Toggling commits through the settings seam and
 * re-lists the authoritative catalog.
 */

import { useEffect, useId, useMemo, useState, type ReactNode } from 'react'
import type { SkillManagerList } from '@deepseek-ai/dsh-skill-manager/types'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import css from './SkillsSettingsSection.module.css'

/** Registration-side Remote face used by the section. */
export interface SkillsSettingsSectionInjected {
  /** Read the complete catalog with current disabled state. */
  list: () => Promise<SkillManagerList>
  /** Persist one skill's disabled flag through the settings seam. */
  setDisabled: (name: string, disabled: boolean) => Promise<void>
}

/** Full component props assembled by the Settings slot renderer. */
export type SkillsSettingsSectionProps =
  PropsRuntime<'settings.section'>
  & PropsLocale<'settings.skillManager'>
  & InjectFace<SkillsSettingsSectionInjected>

type SkillRow = SkillManagerList['skills'][number]

type ViewState =
  | { readonly status: 'loading' }
  | { readonly status: 'error' }
  | { readonly status: 'ready'; readonly rows: SkillManagerList }

/** Whether a row matches the local catalog query. */
function matches(row: SkillRow, normalizedQuery: string): boolean {
  if (normalizedQuery.length === 0) return true
  return [row.name, row.description]
    .some(value => value.toLocaleLowerCase().includes(normalizedQuery))
}

/**
 * Render the skill toggle list.
 * @param props - composed slot props.
 * @returns the section content.
 */
export function SkillsSettingsSection({ list, setDisabled, t }: SkillsSettingsSectionProps): ReactNode {
  const switchId = useId()
  const [request, setRequest] = useState(0)
  const [query, setQuery] = useState('')
  const [pending, setPending] = useState<string | null>(null)
  const [state, setState] = useState<ViewState>({ status: 'loading' })

  useEffect(() => {
    let current = true
    void Promise.resolve().then(() => list()).then(
      (value) => { if (current) setState({ status: 'ready', rows: value }) },
      () => { if (current) setState({ status: 'error' }) },
    )
    return () => { current = false }
  }, [list, request])

  const normalizedQuery = query.trim().toLocaleLowerCase()
  const filtered = useMemo(
    () => state.status === 'ready'
      ? state.rows.skills.filter(row => matches(row, normalizedQuery))
      : [],
    [normalizedQuery, state],
  )

  const toggle = (row: SkillRow): void => {
    setPending(row.name)
    void setDisabled(row.name, !row.disabled).then(
      () => {
        setPending(null)
        setRequest(value => value + 1)
      },
      () => { setPending(null) },
    )
  }

  return (
    <div className={css.section} aria-busy={state.status === 'loading'}>
      {state.status === 'loading' ? <p className={css.status}>{t('loading')}</p> : null}
      {state.status === 'error' ? (
        <div className={css.failure}>
          <p role="alert">{t('error')}</p>
          <button type="button" onClick={() => { setState({ status: 'loading' }); setRequest(value => value + 1) }}>
            {t('retry')}
          </button>
        </div>
      ) : null}
      {state.status === 'ready' ? (
        <div className={css.catalog}>
          <label className={css.search}>
            <span className={css.visuallyHidden}>{t('search')}</span>
            <input
              type="search"
              value={query}
              placeholder={t('search')}
              aria-label={t('search')}
              onChange={(event) => { setQuery(event.currentTarget.value) }}
            />
          </label>
          <div className={css.catalogHeading}>
            <h3>{t('catalog')}</h3>
            <span data-skill-count={filtered.length}>{filtered.length}</span>
          </div>
          {state.rows.skills.length === 0 ? <p className={css.status}>{t('empty')}</p> : null}
          {state.rows.skills.length > 0 && filtered.length === 0
            ? <p className={css.status}>{t('emptySearch')}</p>
            : null}
          {filtered.length > 0 ? (
            <ul className={css.cards}>
              {filtered.map((row) => {
                const busy = pending === row.name
                const switchName = `${switchId}-${row.name}`
                return (
                  <li className={css.card} key={row.name} data-skill={row.name} data-disabled={row.disabled ? 'true' : undefined}>
                    <div className={css.cardBody}>
                      <strong className={css.cardTitle}>{row.name}</strong>
                      <span className={css.cardDescription}>{row.description}</span>
                    </div>
                    <span className={css.cardTrailing}>
                      <span className={css.configTag} data-enabled={row.disabled ? 'false' : 'true'}>
                        {row.disabled ? t('disabledTag') : t('enabledTag')}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        id={switchName}
                        className={css.switch}
                        aria-checked={!row.disabled}
                        aria-label={`${t('toggleAria')} ${row.name}`}
                        disabled={busy}
                        onClick={() => { toggle(row) }}
                      />
                    </span>
                  </li>
                )
              })}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
