import { isSkillName } from "@deepseek-ai/dsh-skill";
import z from "@deepseek-ai/schemastery";
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
//#region lib/types/remote.js
/**
* The `skillManager` Remote: management reads and writes for configuration
* surfaces. Reads serve the invocation-neutral catalog with the disabled
* state; writes commit through the settings seam or the session log, never
* around it.
* @module @deepseek-ai/dsh-skill-manager/remote
*/
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) {
			if (kind === "field") initializers.unshift(_);
			else descriptor[key] = _;
		}
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
/** Whether one session has started a turn; catalog-at-start choices stop then. */
function sessionHasTurn(session) {
	return session.events.some((event) => event.type === "turn/start");
}
/** Management Remote addressed by `sessionId` for the per-session choice. */
let SkillManagerRemote = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _list_decorators;
	let _setDisabled_decorators;
	let _catalogAtStart_decorators;
	let _setCatalogAtStart_decorators;
	return class SkillManagerRemote extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_list_decorators = [Remote("list")];
			_setDisabled_decorators = [Remote("setDisabled")];
			_catalogAtStart_decorators = [Remote("catalogAtStart")];
			_setCatalogAtStart_decorators = [Remote("setCatalogAtStart")];
			__esDecorate(this, null, _list_decorators, {
				kind: "method",
				name: "list",
				static: false,
				private: false,
				access: {
					has: (obj) => "list" in obj,
					get: (obj) => obj.list
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _setDisabled_decorators, {
				kind: "method",
				name: "setDisabled",
				static: false,
				private: false,
				access: {
					has: (obj) => "setDisabled" in obj,
					get: (obj) => obj.setDisabled
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _catalogAtStart_decorators, {
				kind: "method",
				name: "catalogAtStart",
				static: false,
				private: false,
				access: {
					has: (obj) => "catalogAtStart" in obj,
					get: (obj) => obj.catalogAtStart
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _setCatalogAtStart_decorators, {
				kind: "method",
				name: "setCatalogAtStart",
				static: false,
				private: false,
				access: {
					has: (obj) => "setCatalogAtStart" in obj,
					get: (obj) => obj.setCatalogAtStart
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		deps = __runInitializers(this, _instanceExtraInitializers);
		/**
		* @param ctx - host-plane plugin context.
		* @param deps - settings read/write capabilities shared with the plugin body.
		*/
		constructor(ctx, deps) {
			super(ctx, "skillManager");
			this.deps = deps;
		}
		/**
		* Serve the complete invocation-neutral catalog with current disabled state.
		* @returns one sorted row per winning skill across every registry layer.
		*/
		async list() {
			const skills = await this.ctx.skills.listAll();
			const { disabled } = this.deps.current();
			return { skills: skills.map((skill) => ({
				name: skill.name,
				description: skill.description,
				disabled: disabled[skill.name] === true
			})) };
		}
		/**
		* Fully disable or re-enable one skill. The settings commit applies the
		* invocation override and hot-reloads the session catalog.
		* @param name - kebab-case skill name.
		* @param disabled - `true` disables, `false` re-enables.
		* @returns the catalog after the committed change.
		*/
		async setDisabled(name, disabled) {
			await this.deps.setDisabled(name, disabled);
			return this.list();
		}
		/**
		* Read the session's first-step catalog choice, newest event winning.
		* @param session - exact live session resolved from the wire identity.
		* @returns whether the first step injects the catalog; `true` while unset.
		*/
		catalogAtStart(session) {
			return catalogStartEnabled(session.events);
		}
		/**
		* Record whether this session's first model step injects the skill catalog.
		* Allowed only while the session is blank; the newest choice wins and a
		* started session keeps its already-run first step.
		* @param session - exact live session resolved from the wire identity.
		* @param enabled - whether the first step injects the catalog.
		* @returns the recorded choice, or `started` when a turn already ran.
		*/
		setCatalogAtStart(session, enabled) {
			if (sessionHasTurn(session)) return { outcome: "started" };
			session.append("skill/catalog-at-start", { enabled });
			return {
				outcome: "saved",
				enabled
			};
		}
	};
})();
/** The per-session first-step catalog choice, newest event winning; absent means inject. */
function catalogStartEnabled(events) {
	for (let index = events.length - 1; index >= 0; index -= 1) {
		const event = events[index];
		if (event?.type === "skill/catalog-at-start") return event.data.enabled;
	}
	return true;
}
//#endregion
//#region lib/types/index.js
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
const name = "skill-manager";
/** Required service: the skill registry this policy governs. */
const inject = ["skills"];
/** Settings namespace carrying the user's disabled-skill table. */
const SKILL_MANAGER_NAMESPACE = "skill-manager";
/** Schema of the settings section: kebab-case skill name to disabled flag. */
const SKILL_MANAGER_SCHEMA = z.object({ disabled: z.dict(z.boolean()).default({}) });
/** Composition entry used as the settings base: nothing disabled. */
const DEFAULT_SETTINGS = Object.freeze({ disabled: {} });
/** Fully disabled invocation policy applied by the overrides table. */
const DISABLED_POLICY = Object.freeze({
	modelInvocable: false,
	userInvocable: false
});
/** Project the settings section onto the registry override table. */
function overridesFrom(settings) {
	const overrides = {};
	for (const [skillName, disabled] of Object.entries(settings.disabled)) if (disabled) overrides[skillName] = DISABLED_POLICY;
	return overrides;
}
/** Reject disabled keys the schema cannot constrain: names must be skill names. */
function validateSettings(value) {
	for (const skillName of Object.keys(value.disabled)) if (!isSkillName(skillName)) throw new Error(`skill-manager: disabled skill name "${skillName}" must match the skill-name grammar`);
}
/**
* Install the enablement policy: the settings section and its override
* application, the optional `/skills` command, and the `skillManager` Remote.
* @param ctx - host-plane plugin context.
*/
function apply(ctx) {
	let current = () => DEFAULT_SETTINGS;
	const deps = {
		current: () => current(),
		setDisabled: async (skillName, disabled) => {
			const settings = ctx.get("settings");
			if (settings === void 0) throw new Error("skill-manager: settings service is unavailable");
			if (!isSkillName(skillName)) throw new Error(`skill-manager: invalid skill name "${skillName}"`);
			await settings.mutate(SKILL_MANAGER_NAMESPACE, [disabled ? {
				op: "set",
				path: ["disabled", skillName],
				value: true
			} : {
				op: "unset",
				path: ["disabled", skillName]
			}]);
		}
	};
	ctx.inject(["settings"], (settingsCtx) => {
		settingsCtx.settings.installSection(ctx, SKILL_MANAGER_NAMESPACE, SKILL_MANAGER_SCHEMA, DEFAULT_SETTINGS, {
			setSource: (next) => {
				current = next;
			},
			onChange: () => {
				ctx.skills.setInvocationOverrides(overridesFrom(deps.current()));
			},
			validate: validateSettings
		});
	});
	ctx.inject(["commands"], (commandCtx) => {
		commandCtx.commands.register({
			name: "skills",
			description: "Manage skill enablement",
			input: { hint: "list | enable <skill> | disable <skill>" },
			handler: async ({ agent, rawInput }) => {
				const input = rawInput.trim();
				const lookup = {
					scope: agent,
					cwd: agent.session.header.cwd
				};
				if (input === "list") {
					const skills = await ctx.skills.list(lookup);
					const { disabled } = deps.current();
					if (skills.length === 0) return {
						kind: "success",
						text: "no skills available"
					};
					return {
						kind: "success",
						text: skills.map((skill) => `- ${skill.name}${disabled[skill.name] === true ? " (disabled)" : ""}: ${skill.description}`).join("\n")
					};
				}
				const match = /^(enable|disable) ([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(input);
				if (match === null || match[1] === void 0 || match[2] === void 0) return {
					kind: "error",
					text: "usage: /skills list | /skills enable <skill> | /skills disable <skill>"
				};
				const disable = match[1] === "disable";
				const skillName = match[2];
				if (!(await ctx.skills.list(lookup)).some((skill) => skill.name === skillName)) return {
					kind: "error",
					text: `unknown skill "${skillName}"`
				};
				await deps.setDisabled(skillName, disable);
				return {
					kind: "success",
					text: `skill ${skillName} ${disable ? "disabled" : "enabled"}`
				};
			}
		});
	});
	new SkillManagerRemote(ctx, deps);
	ctx.effect(() => () => {
		ctx.skills.setInvocationOverrides({});
	}, "skill-manager: restore provider invocation policies on unload");
}
//#endregion
export { SKILL_MANAGER_NAMESPACE, SKILL_MANAGER_SCHEMA, SkillManagerRemote, apply, inject, name };
