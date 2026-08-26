import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The skill management Settings section: one toggle row per skill over the
 * `skillManager` Remote. Toggling commits through the settings seam and
 * re-lists the authoritative catalog.
 */
import { useEffect, useId, useMemo, useState } from 'react';
import css from './SkillsSettingsSection.module.css';
/** Whether a row matches the local catalog query. */
function matches(row, normalizedQuery) {
    if (normalizedQuery.length === 0)
        return true;
    return [row.name, row.description]
        .some(value => value.toLocaleLowerCase().includes(normalizedQuery));
}
/**
 * Render the skill toggle list.
 * @param props - composed slot props.
 * @returns the section content.
 */
export function SkillsSettingsSection({ list, setDisabled, t }) {
    const switchId = useId();
    const [request, setRequest] = useState(0);
    const [query, setQuery] = useState('');
    const [pending, setPending] = useState(null);
    const [state, setState] = useState({ status: 'loading' });
    useEffect(() => {
        let current = true;
        void Promise.resolve().then(() => list()).then((value) => { if (current)
            setState({ status: 'ready', rows: value }); }, () => { if (current)
            setState({ status: 'error' }); });
        return () => { current = false; };
    }, [list, request]);
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const filtered = useMemo(() => state.status === 'ready'
        ? state.rows.skills.filter(row => matches(row, normalizedQuery))
        : [], [normalizedQuery, state]);
    const toggle = (row) => {
        setPending(row.name);
        void setDisabled(row.name, !row.disabled).then(() => {
            setPending(null);
            setRequest(value => value + 1);
        }, () => { setPending(null); });
    };
    return (_jsxs("div", { className: css.section, "aria-busy": state.status === 'loading', children: [state.status === 'loading' ? _jsx("p", { className: css.status, children: t('loading') }) : null, state.status === 'error' ? (_jsxs("div", { className: css.failure, children: [_jsx("p", { role: "alert", children: t('error') }), _jsx("button", { type: "button", onClick: () => { setState({ status: 'loading' }); setRequest(value => value + 1); }, children: t('retry') })] })) : null, state.status === 'ready' ? (_jsxs("div", { className: css.catalog, children: [_jsxs("label", { className: css.search, children: [_jsx("span", { className: css.visuallyHidden, children: t('search') }), _jsx("input", { type: "search", value: query, placeholder: t('search'), "aria-label": t('search'), onChange: (event) => { setQuery(event.currentTarget.value); } })] }), _jsxs("div", { className: css.catalogHeading, children: [_jsx("h3", { children: t('catalog') }), _jsx("span", { "data-skill-count": filtered.length, children: filtered.length })] }), state.rows.skills.length === 0 ? _jsx("p", { className: css.status, children: t('empty') }) : null, state.rows.skills.length > 0 && filtered.length === 0
                        ? _jsx("p", { className: css.status, children: t('emptySearch') })
                        : null, filtered.length > 0 ? (_jsx("ul", { className: css.cards, children: filtered.map((row) => {
                            const busy = pending === row.name;
                            const switchName = `${switchId}-${row.name}`;
                            return (_jsxs("li", { className: css.card, "data-skill": row.name, "data-disabled": row.disabled ? 'true' : undefined, children: [_jsxs("div", { className: css.cardBody, children: [_jsx("strong", { className: css.cardTitle, children: row.name }), _jsx("span", { className: css.cardDescription, children: row.description })] }), _jsxs("span", { className: css.cardTrailing, children: [_jsx("span", { className: css.configTag, "data-enabled": row.disabled ? 'false' : 'true', children: row.disabled ? t('disabledTag') : t('enabledTag') }), _jsx("button", { type: "button", role: "switch", id: switchName, className: css.switch, "aria-checked": !row.disabled, "aria-label": `${t('toggleAria')} ${row.name}`, disabled: busy, onClick: () => { toggle(row); } })] })] }, row.name));
                        }) })) : null] })) : null] }));
}
//# sourceMappingURL=SkillsSettingsSection.js.map