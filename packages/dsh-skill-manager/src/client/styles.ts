/** Plugin-owned styles with stable prefixed class names. */

const classes = Object.freeze({
  card: 'dsh-skill-manager-card',
  cardBody: 'dsh-skill-manager-cardBody',
  cardDescription: 'dsh-skill-manager-cardDescription',
  cardTitle: 'dsh-skill-manager-cardTitle',
  cardTrailing: 'dsh-skill-manager-cardTrailing',
  cards: 'dsh-skill-manager-cards',
  catalog: 'dsh-skill-manager-catalog',
  catalogHeading: 'dsh-skill-manager-catalogHeading',
  checkbox: 'dsh-skill-manager-checkbox',
  configTag: 'dsh-skill-manager-configTag',
  failure: 'dsh-skill-manager-failure',
  search: 'dsh-skill-manager-search',
  seat: 'dsh-skill-manager-seat',
  section: 'dsh-skill-manager-section',
  status: 'dsh-skill-manager-status',
  switch: 'dsh-skill-manager-switch',
  visuallyHidden: 'dsh-skill-manager-visuallyHidden',
})

const css = `.dsh-skill-manager-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 760px;
  color: var(--dsw-alias-label-primary);
}

.dsh-skill-manager-catalogHeading h3,
.dsh-skill-manager-status,
.dsh-skill-manager-failure p {
  margin: 0;
}

.dsh-skill-manager-status,
.dsh-skill-manager-failure {
  font-size: 13px;
  line-height: 20px;
  color: var(--dsw-alias-label-tertiary);
}

.dsh-skill-manager-failure {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--dsw-alias-state-error-primary);
}

.dsh-skill-manager-failure button {
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 6px;
  padding: 4px 10px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  cursor: pointer;
}

.dsh-skill-manager-catalog {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dsh-skill-manager-search {
  display: flex;
  width: 100%;
}

.dsh-skill-manager-search input {
  flex: 1;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 8px;
  padding: 8px 12px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: var(--dsw-font-s-14);
}

.dsh-skill-manager-search input::placeholder {
  color: var(--dsw-alias-label-tertiary);
}

.dsh-skill-manager-visuallyHidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.dsh-skill-manager-catalogHeading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dsh-skill-manager-catalogHeading h3 {
  font: var(--dsw-font-m-18);
}

.dsh-skill-manager-catalogHeading [data-skill-count] {
  font: var(--dsw-font-xxs-strong-12);
  color: var(--dsw-alias-label-tertiary);
}

.dsh-skill-manager-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dsh-skill-manager-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 10px;
  padding: 12px 14px;
}

.dsh-skill-manager-card[data-disabled] .dsh-skill-manager-cardTitle,
.dsh-skill-manager-card[data-disabled] .dsh-skill-manager-cardDescription {
  color: var(--dsw-alias-label-tertiary);
}

.dsh-skill-manager-cardBody {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.dsh-skill-manager-cardTitle {
  font: var(--dsw-font-base-strong-16);
}

.dsh-skill-manager-cardDescription {
  font: var(--dsw-font-s-14);
  color: var(--dsw-alias-label-secondary);
}

.dsh-skill-manager-cardTrailing {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.dsh-skill-manager-configTag {
  font: var(--dsw-font-xxs-strong-12);
  color: var(--dsw-alias-label-tertiary);
}

.dsh-skill-manager-switch {
  position: relative;
  width: 36px;
  height: 20px;
  border: none;
  border-radius: 10px;
  padding: 0;
  background: var(--dsw-alias-fill-l2);
  cursor: pointer;
}

.dsh-skill-manager-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--dsw-alias-label-inverse);
  transition: transform 120ms ease;
}

.dsh-skill-manager-switch[aria-checked='true'] {
  background: var(--dsw-static-deepseek-500);
}

.dsh-skill-manager-switch[aria-checked='true']::after {
  transform: translateX(16px);
}

.dsh-skill-manager-switch:disabled {
  opacity: 0.6;
  cursor: default;
}

.dsh-skill-manager-seat {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: 1px solid var(--dsw-alias-border-l2);
  border-radius: 999px;
  color: var(--dsw-alias-label-secondary);
  font: var(--dsw-font-xxs-strong-12);
  cursor: pointer;
  user-select: none;
}

.dsh-skill-manager-checkbox {
  accent-color: var(--dsw-static-deepseek-500);
}

.dsh-skill-manager-checkbox:disabled {
  cursor: default;
}

.dsh-skill-manager-seat:has(.dsh-skill-manager-checkbox:disabled) {
  cursor: default;
}`

if (typeof document !== 'undefined' && document.querySelector('style[data-plugin="dsh-skill-manager"]') === null) {
  const tag = document.createElement('style')
  tag.dataset.plugin = 'dsh-skill-manager'
  tag.textContent = css
  document.head.appendChild(tag)
}

export default classes
