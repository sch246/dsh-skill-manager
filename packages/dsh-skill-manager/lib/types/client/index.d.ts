/**
 * Browser half of the external skill manager. It mounts the package's own
 * generated Remote contribution through the generic Client Remote seam, then
 * contributes the Settings section and blank-session catalog control.
 */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import { type SkillManagerLocaleKey } from './locales.ts';
export type { SkillCatalogStartSeatInjected, SkillCatalogStartSeatProps } from './SkillCatalogStartSeat.tsx';
export type { SkillsSettingsSectionInjected, SkillsSettingsSectionProps } from './SkillsSettingsSection.tsx';
export type { SkillManagerLocaleKey } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Skill management settings and hero copy. */
        'settings.skillManager': SkillManagerLocaleKey;
    }
}
/** Dictionary namespace owned by this plugin. */
export declare const NS = "settings.skillManager";
/** Services required before this package mounts its Remote and UI contributions. */
export declare const inject: string[];
/** Mount the generated Remote contribution and then register both UI surfaces. */
export declare function apply(ctx: ClientContext): Promise<void>;
//# sourceMappingURL=index.d.ts.map