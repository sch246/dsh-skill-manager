/**
 * The `skillManager` Remote: management reads and writes for configuration
 * surfaces. Reads serve the invocation-neutral catalog with the disabled
 * state; writes commit through the settings seam or the session log, never
 * around it.
 * @module @deepseek-ai/dsh-skill-manager/remote
 */
import type { Context } from '@deepseek-ai/cordis';
import type { Session } from '@deepseek-ai/dsh-session';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { SkillCatalogStartResult, SkillManagerList } from './types.ts';
declare module '@deepseek-ai/dsh-session/types' {
    interface SessionEventMap {
        /** Newest choice wins; absent means publish the catalog on the first model step. */
        'skill/catalog-at-start': {
            enabled: boolean;
        };
    }
}
/** Capabilities the plugin body hands to the Remote instance. */
export interface SkillManagerRemoteDeps {
    /** Current resolved settings value. */
    readonly current: () => {
        readonly disabled: Readonly<Record<string, boolean>>;
    };
    /** Persist one skill's disabled flag through the settings seam. */
    readonly setDisabled: (name: string, disabled: boolean) => Promise<void>;
}
/** Management Remote addressed by `sessionId` for the per-session choice. */
export declare class SkillManagerRemote extends TypertRemoteService {
    private readonly deps;
    /**
     * @param ctx - host-plane plugin context.
     * @param deps - settings read/write capabilities shared with the plugin body.
     */
    constructor(ctx: Context, deps: SkillManagerRemoteDeps);
    /**
     * Serve the complete invocation-neutral catalog with current disabled state.
     * @returns one sorted row per winning skill across every registry layer.
     */
    list(): Promise<SkillManagerList>;
    /**
     * Fully disable or re-enable one skill. The settings commit applies the
     * invocation override and hot-reloads the session catalog.
     * @param name - kebab-case skill name.
     * @param disabled - `true` disables, `false` re-enables.
     * @returns the catalog after the committed change.
     */
    setDisabled(name: string, disabled: boolean): Promise<SkillManagerList>;
    /**
     * Read the session's first-step catalog choice, newest event winning.
     * @param session - exact live session resolved from the wire identity.
     * @returns whether the first step injects the catalog; `true` while unset.
     */
    catalogAtStart(session: Session): boolean;
    /**
     * Record whether this session's first model step injects the skill catalog.
     * Allowed only while the session is blank; the newest choice wins and a
     * started session keeps its already-run first step.
     * @param session - exact live session resolved from the wire identity.
     * @param enabled - whether the first step injects the catalog.
     * @returns the recorded choice, or `started` when a turn already ran.
     */
    setCatalogAtStart(session: Session, enabled: boolean): SkillCatalogStartResult;
}
//# sourceMappingURL=remote.d.ts.map