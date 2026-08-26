/**
 * The new-session hero seat for the first-step skill-catalog choice: a
 * checkbox beside the agent-preset chip that records, while the session is
 * still blank, whether its first model step injects the skill catalog.
 *
 * The control disappears once a turn has run — the choice only ever governs
 * the first step, and a started session keeps the one it already ran.
 */
import { type ReactNode } from 'react';
import type { SessionId } from '@deepseek-ai/dsh-api-remotes/client';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
/** Registration-side Remote face used by the seat. */
export interface SkillCatalogStartSeatInjected {
    /** Read the blank session's current first-step choice. */
    read: (sessionId: SessionId) => Promise<boolean>;
    /** Record a new choice; resolves `started` once the session is no longer blank. */
    set: (sessionId: SessionId, enabled: boolean) => Promise<'saved' | 'started'>;
}
/** Full component props assembled by the hero slot renderer. */
export type SkillCatalogStartSeatProps = PropsRuntime<'conversation.hero.skillCatalogStart'> & PropsLocale<'settings.skillManager'> & InjectFace<SkillCatalogStartSeatInjected>;
/**
 * Render the hero checkbox, or null when no blank session exists.
 * @param props - composed slot props.
 * @returns the labeled checkbox while a blank session is current.
 */
export declare function SkillCatalogStartSeat({ useSessions, read, set, t }: SkillCatalogStartSeatProps): ReactNode;
//# sourceMappingURL=SkillCatalogStartSeat.d.ts.map