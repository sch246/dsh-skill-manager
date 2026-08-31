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
import { isSkillName } from '@deepseek-ai/dsh-skill';
import z from '@deepseek-ai/schemastery';
import { SkillManagerRemote } from "./remote.js";
export { SkillManagerRemote } from "./remote.js";
export const name = 'skill-manager';
/** Required service: the skill registry this policy governs. */
export const inject = ['skills'];
/** Settings namespace carrying the user's disabled-skill table. */
export const SKILL_MANAGER_NAMESPACE = 'skill-manager';
/** Schema of the settings section: kebab-case skill name to disabled flag. */
export const SKILL_MANAGER_SCHEMA = z.object({
    disabled: z.dict(z.boolean()).default({}),
});
/** Composition entry used as the settings base: nothing disabled. */
const DEFAULT_SETTINGS = Object.freeze({ disabled: {} });
/** Fully disabled invocation policy applied by the overrides table. */
const DISABLED_POLICY = Object.freeze({
    modelInvocable: false,
    userInvocable: false,
});
/** Project the settings section onto the registry override table. */
function overridesFrom(settings) {
    const overrides = {};
    for (const [skillName, disabled] of Object.entries(settings.disabled)) {
        if (disabled)
            overrides[skillName] = DISABLED_POLICY;
    }
    return overrides;
}
/** Reject disabled keys the schema cannot constrain: names must be skill names. */
function validateSettings(value) {
    for (const skillName of Object.keys(value.disabled)) {
        if (!isSkillName(skillName)) {
            throw new Error(`skill-manager: disabled skill name "${skillName}" must match the skill-name grammar`);
        }
    }
}
/**
 * Install the enablement policy: the settings section and its override
 * application, the optional `/skills` command, and the `skillManager` Remote.
 * @param ctx - host-plane plugin context.
 */
export function apply(ctx) {
    let current = () => DEFAULT_SETTINGS;
    const deps = {
        current: () => current(),
        setDisabled: async (skillName, disabled) => {
            // Read at call time: the settings provider may attach after this apply.
            const settings = ctx.get('settings');
            if (settings === undefined)
                throw new Error('skill-manager: settings service is unavailable');
            if (!isSkillName(skillName))
                throw new Error(`skill-manager: invalid skill name "${skillName}"`);
            await settings.mutate(SKILL_MANAGER_NAMESPACE, [
                disabled
                    ? { op: 'set', path: ['disabled', skillName], value: true }
                    : { op: 'unset', path: ['disabled', skillName] },
            ]);
        },
    };
    ctx.inject(['settings'], (settingsCtx) => {
        settingsCtx.settings.installSection(ctx, SKILL_MANAGER_NAMESPACE, SKILL_MANAGER_SCHEMA, DEFAULT_SETTINGS, {
            setSource: (next) => { current = next; },
            onChange: () => { ctx.skills.setInvocationOverrides(overridesFrom(deps.current())); },
            validate: validateSettings,
        });
    });
    // The /skills command activates only when a command registry is composed.
    ctx.inject(['commands'], (commandCtx) => {
        commandCtx.commands.register({
            name: 'skills',
            description: 'Manage skill enablement',
            input: { hint: 'list | enable <skill> | disable <skill>' },
            handler: async ({ agent, rawInput }) => {
                const input = rawInput.trim();
                const lookup = { scope: agent, cwd: agent.session.header.cwd };
                if (input === 'list') {
                    const skills = await ctx.skills.list(lookup);
                    const { disabled } = deps.current();
                    if (skills.length === 0)
                        return { kind: 'success', text: 'no skills available' };
                    return {
                        kind: 'success',
                        text: skills.map(skill => `- ${skill.name}${disabled[skill.name] === true ? ' (disabled)' : ''}: ${skill.description}`).join('\n'),
                    };
                }
                const match = /^(enable|disable) ([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(input);
                if (match === null || match[1] === undefined || match[2] === undefined) {
                    return { kind: 'error', text: 'usage: /skills list | /skills enable <skill> | /skills disable <skill>' };
                }
                const disable = match[1] === 'disable';
                const skillName = match[2];
                const skills = await ctx.skills.list(lookup);
                if (!skills.some(skill => skill.name === skillName)) {
                    return { kind: 'error', text: `unknown skill "${skillName}"` };
                }
                await deps.setDisabled(skillName, disable);
                return { kind: 'success', text: `skill ${skillName} ${disable ? 'disabled' : 'enabled'}` };
            },
        });
    });
    // The Remote service self-registers under 'skillManager' in the plugin
    // context and is removed with this fiber.
    new SkillManagerRemote(ctx, deps);
    // Removing the manager removes its policy: unloading (HMR) restores every
    // provider-resolved invocation policy.
    ctx.effect(() => () => {
        ctx.skills.setInvocationOverrides({});
    }, 'skill-manager: restore provider invocation policies on unload');
}
//# sourceMappingURL=index.js.map