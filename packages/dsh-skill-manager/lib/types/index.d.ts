/**
 * Skill enablement management: the user's disabled-skill table, applied as
 * invocation overrides on the skill registry, plus the `/skills` command and
 * the `skillManager` Remote for configuration surfaces.
 *
 * The settings section is the single source of truth; every write path
 * (`/skills`, the Remote) commits through the settings seam, and the registry
 * override application runs from the committed value, so a change hot-reloads
 * the session catalog through `skills/change`.
 * @module @deepseek-ai/dsh-skill-manager
 */
import type { Context } from '@deepseek-ai/cordis';
import z from '@deepseek-ai/schemastery';
import type { SkillManagerSettings } from './types.ts';
export type * from './types.ts';
export { SkillManagerRemote } from './remote.ts';
export declare const name = "skill-manager";
/** Required service: the skill registry this policy governs. */
export declare const inject: string[];
/** Settings namespace carrying the user's disabled-skill table. */
export declare const SKILL_MANAGER_NAMESPACE = "skill-manager";
/** Schema of the settings section: kebab-case skill name to disabled flag. */
export declare const SKILL_MANAGER_SCHEMA: z<SkillManagerSettings>;
/**
 * Install the enablement policy: the settings section and its override
 * application, the optional `/skills` command, and the `skillManager` Remote.
 * @param ctx - host-plane plugin context.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map