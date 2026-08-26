import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * The new-session hero seat for the first-step skill-catalog choice: a
 * checkbox beside the agent-preset chip that records, while the session is
 * still blank, whether its first model step injects the skill catalog.
 *
 * The control disappears once a turn has run — the choice only ever governs
 * the first step, and a started session keeps the one it already ran.
 */
import { useEffect, useState } from 'react';
import css from "./styles.js";
/**
 * Render the hero checkbox, or null when no blank session exists.
 * @param props - composed slot props.
 * @returns the labeled checkbox while a blank session is current.
 */
export function SkillCatalogStartSeat({ useSessions, read, set, t }) {
    const sessions = useSessions(snapshot => snapshot);
    const current = sessions.current;
    const blank = current !== undefined && sessions.byId[current]?.blank === true;
    const [enabled, setEnabled] = useState(true);
    const [busy, setBusy] = useState(false);
    useEffect(() => {
        if (current === undefined || !blank)
            return;
        let live = true;
        void read(current).then((value) => { if (live)
            setEnabled(value); }, () => { if (live)
            setEnabled(true); });
        return () => { live = false; };
    }, [blank, current, read]);
    if (current === undefined || !blank)
        return null;
    const toggle = () => {
        const next = !enabled;
        setEnabled(next);
        setBusy(true);
        void set(current, next).then((outcome) => {
            setBusy(false);
            // A session that started mid-write keeps its already-run first step;
            // the sessions frame flips `blank` and this seat unmounts itself.
            if (outcome === 'started')
                setEnabled(true);
        }, () => {
            setBusy(false);
            setEnabled(!next);
        });
    };
    return (_jsxs("label", { className: css.seat, title: t('seatHint'), children: [_jsx("input", { type: "checkbox", className: css.checkbox, checked: enabled, disabled: busy, onChange: toggle }), _jsx("span", { children: t('seatLabel') })] }));
}
//# sourceMappingURL=SkillCatalogStartSeat.js.map