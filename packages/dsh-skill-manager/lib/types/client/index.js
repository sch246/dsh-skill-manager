/**
 * Browser half of the external skill manager. It mounts the package's own
 * generated Remote contribution through the generic Client Remote seam, then
 * contributes the Settings section and blank-session catalog control.
 */
import skillManagerRemote from '@deepseek-ai/dsh-skill-manager/remote';
import { SkillCatalogStartSeat } from "./SkillCatalogStartSeat.js";
import { SkillsSettingsSection } from "./SkillsSettingsSection.js";
import { en, zh } from "./locales.js";
/** Dictionary namespace owned by this plugin. */
export const NS = 'settings.skillManager';
/** Services required before this package mounts its Remote and UI contributions. */
export const inject = ['slots', 'locale', 'remote'];
/** Mount the generated Remote contribution and then register both UI surfaces. */
export async function apply(ctx) {
    await ctx.effect(() => ctx.remote.$mount(skillManagerRemote), 'dsh-skill-manager: generated Remote contribution');
    ctx.inject(['remote.skillManager'], (scope) => {
        scope.effect(() => scope.locale.register(NS, { zh, en }), 'dsh-skill-manager: dictionaries');
        const t = scope.locale.bind(NS);
        const list = async () => {
            const result = await scope.remote.skillManager.list();
            if (!result.ok)
                throw new Error(`skillManager.list failed: ${result.error.code}: ${result.error.message}`);
            return result.value;
        };
        const setDisabled = async (name, disabled) => {
            const result = await scope.remote.skillManager.setDisabled(name, disabled);
            if (!result.ok)
                throw new Error(`skillManager.setDisabled failed: ${result.error.code}: ${result.error.message}`);
        };
        const sectionInjected = () => ({ list, setDisabled });
        scope.slots.inject('settings.section', () => scope.slots.register({
            name: 'settings.section',
            id: 'skills',
            order: 25,
            label: () => t('nav'),
            locale: NS,
            inject: sectionInjected,
        }, SkillsSettingsSection));
        const read = async (sessionId) => {
            const result = await scope.remote.skillManager.catalogAtStart(sessionId);
            if (!result.ok)
                throw new Error(`skillManager.catalogAtStart failed: ${result.error.code}: ${result.error.message}`);
            return result.value;
        };
        const set = async (sessionId, enabled) => {
            const result = await scope.remote.skillManager.setCatalogAtStart(sessionId, enabled);
            if (!result.ok)
                throw new Error(`skillManager.setCatalogAtStart failed: ${result.error.code}: ${result.error.message}`);
            return result.value.outcome;
        };
        const seatInjected = () => ({ read, set });
        scope.slots.inject('conversation.hero.skillCatalogStart', () => scope.slots.register({
            name: 'conversation.hero.skillCatalogStart',
            locale: NS,
            inject: seatInjected,
        }, SkillCatalogStartSeat));
    });
}
//# sourceMappingURL=index.js.map