/**
 * The `skillManager` Remote: management reads and writes for configuration
 * surfaces. Reads serve the invocation-neutral catalog with the disabled
 * state; writes commit through the settings seam or the session log, never
 * around it.
 * @module @deepseek-ai/dsh-skill-manager/remote
 */
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
/** Whether one session has started a turn; catalog-at-start choices stop then. */
function sessionHasTurn(session) {
    return session.events.some(event => event.type === 'turn/start');
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
            _list_decorators = [Remote('list')];
            _setDisabled_decorators = [Remote('setDisabled')];
            _catalogAtStart_decorators = [Remote('catalogAtStart')];
            _setCatalogAtStart_decorators = [Remote('setCatalogAtStart')];
            __esDecorate(this, null, _list_decorators, { kind: "method", name: "list", static: false, private: false, access: { has: obj => "list" in obj, get: obj => obj.list }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _setDisabled_decorators, { kind: "method", name: "setDisabled", static: false, private: false, access: { has: obj => "setDisabled" in obj, get: obj => obj.setDisabled }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _catalogAtStart_decorators, { kind: "method", name: "catalogAtStart", static: false, private: false, access: { has: obj => "catalogAtStart" in obj, get: obj => obj.catalogAtStart }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _setCatalogAtStart_decorators, { kind: "method", name: "setCatalogAtStart", static: false, private: false, access: { has: obj => "setCatalogAtStart" in obj, get: obj => obj.setCatalogAtStart }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        deps = __runInitializers(this, _instanceExtraInitializers);
        /**
         * @param ctx - host-plane plugin context.
         * @param deps - settings read/write capabilities shared with the plugin body.
         */
        constructor(ctx, deps) {
            super(ctx, 'skillManager');
            this.deps = deps;
        }
        /**
         * Serve the complete invocation-neutral catalog with current disabled state.
         * @returns one sorted row per winning skill across every registry layer.
         */
        async list() {
            const skills = await this.ctx.skills.listAll();
            const { disabled } = this.deps.current();
            return {
                skills: skills.map(skill => ({
                    name: skill.name,
                    description: skill.description,
                    disabled: disabled[skill.name] === true,
                })),
            };
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
            if (sessionHasTurn(session))
                return { outcome: 'started' };
            session.append('skill/catalog-at-start', { enabled });
            return { outcome: 'saved', enabled };
        }
    };
})();
export { SkillManagerRemote };
/** The per-session first-step catalog choice, newest event winning; absent means inject. */
function catalogStartEnabled(events) {
    for (let index = events.length - 1; index >= 0; index -= 1) {
        const event = events[index];
        if (event?.type === 'skill/catalog-at-start')
            return event.data.enabled;
    }
    return true;
}
//# sourceMappingURL=remote.js.map