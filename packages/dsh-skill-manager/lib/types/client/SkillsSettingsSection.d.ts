/**
 * The skill management Settings section: one toggle row per skill over the
 * `skillManager` Remote. Toggling commits through the settings seam and
 * re-lists the authoritative catalog.
 */
import { type ReactNode } from 'react';
import type { SkillManagerList } from '@deepseek-ai/dsh-skill-manager/types';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
/** Registration-side Remote face used by the section. */
export interface SkillsSettingsSectionInjected {
    /** Read the complete catalog with current disabled state. */
    list: () => Promise<SkillManagerList>;
    /** Persist one skill's disabled flag through the settings seam. */
    setDisabled: (name: string, disabled: boolean) => Promise<void>;
}
/** Full component props assembled by the Settings slot renderer. */
export type SkillsSettingsSectionProps = PropsRuntime<'settings.section'> & PropsLocale<'settings.skillManager'> & InjectFace<SkillsSettingsSectionInjected>;
/**
 * Render the skill toggle list.
 * @param props - composed slot props.
 * @returns the section content.
 */
export declare function SkillsSettingsSection({ list, setDisabled, t }: SkillsSettingsSectionProps): ReactNode;
//# sourceMappingURL=SkillsSettingsSection.d.ts.map