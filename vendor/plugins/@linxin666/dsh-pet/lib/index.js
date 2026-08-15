import { a as AFFINITY_MAX, c as applyTurnReward, d as rankOf, i as rowOf, l as defaultAffinityConfig, n as animationForPhase, o as AFFINITY_RANKS, r as defaultPetStateConfig, s as applyInteraction, t as PetStateMachine, u as emptyAffinity } from "./state-IyVnKymD.js";
import { installSettingsSection, settingsNamespace } from "@deepseek-ai/dsh-settings";
import z from "schemastery";
import { Service } from "@deepseek-ai/cordis";
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
//#region src/treats.ts
const defaultTreatConfig = {
	turnsPerTreat: 3,
	timeTreatMs: 30 * 6e4,
	maxTreats: 20
};
function emptyTreatLedger() {
	return {
		treats: 0,
		lastTreatGrantAt: 0,
		turnsAtLastTreatGrant: 0
	};
}
function cap(treats, max) {
	return Math.min(max, Math.max(0, treats));
}
/**
* Settle treat grants from both sources against one ledger snapshot.
* Work output counts whole periods since the last work settlement
* (turnsDelta / turnsPerTreat) and advances only the work anchor;
* time output counts whole periods since the time anchor
* (`lastTreatGrantAt`) and advances only the time anchor. The two sources
* are independent so a continuously working user still earns time treats.
* 0 time history never backfills — the clock starts at the first settlement.
* Both sources are clamped by the stock cap.
*/
function settleTreatGrants(ledger, turns, nowMs, config = defaultTreatConfig) {
	const turnDelta = Math.max(0, turns - ledger.turnsAtLastTreatGrant);
	const workGrants = Math.floor(turnDelta / config.turnsPerTreat);
	const timeAnchor = ledger.lastTreatGrantAt === 0 ? nowMs : ledger.lastTreatGrantAt;
	const timeGrants = Math.floor(Math.max(0, nowMs - timeAnchor) / config.timeTreatMs);
	const gained = workGrants + timeGrants;
	if (gained <= 0) return {
		ledger,
		gained: 0
	};
	return {
		ledger: {
			treats: cap(ledger.treats + gained, config.maxTreats),
			lastTreatGrantAt: timeGrants > 0 ? timeAnchor + timeGrants * config.timeTreatMs : timeAnchor,
			turnsAtLastTreatGrant: workGrants > 0 ? turns - turnDelta % config.turnsPerTreat : ledger.turnsAtLastTreatGrant
		},
		gained
	};
}
/**
* Consume one treat for a feed. Returns the outcome; a feed with no stocked
* treats is refused.
*/
function consumeTreat(ledger) {
	if (ledger.treats <= 0) return { ok: false };
	return {
		ok: true,
		ledger: {
			...ledger,
			treats: ledger.treats - 1
		}
	};
}
//#endregion
//#region src/persist.ts
/**
* Pet persistence — tiny JSON store for affinity + display config, written
* under $DSH_HOME (defaults to ~/.dsh) as `pet.json`. Deliberately minimal:
* one file, atomic rename write, tolerant read (corrupt file → defaults).
* @module @linxin666/dsh-pet/persist
*/
const defaultDisplayConfig = {
	visible: true,
	size: 160,
	right: 24,
	bottom: 20
};
const DISPLAY_INSET_MAX = 1e4;
/** Default pet name (used until the user renames the pet). */
const DEFAULT_PET_NAME = "鲸鱼娘";
function emptyPersist() {
	return {
		name: DEFAULT_PET_NAME,
		affinity: emptyAffinity(),
		treats: emptyTreatLedger(),
		display: { ...defaultDisplayConfig }
	};
}
/** Resolve the persistence directory ($DSH_HOME or ~/.dsh). */
function petHomeDir() {
	return process.env.DSH_HOME ?? join(homedir(), ".dsh");
}
/** Numeric field guard: finite numbers only, else the fallback. */
function finiteNum(value, fallback) {
	return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
/** Clamp one count/score into [0, max]. */
function clamp(value, max) {
	return Math.min(max, Math.max(0, value));
}
/** Load persisted state; missing or corrupt files fall back to defaults. */
function loadPetPersist(dir = petHomeDir()) {
	try {
		const raw = readFileSync(join(dir, "pet.json"), "utf8");
		const parsed = JSON.parse(raw);
		const base = emptyPersist();
		const rawAffinity = parsed.affinity ?? {};
		const affinity = {
			points: clamp(finiteNum(rawAffinity.points, 0), 100),
			lastPetAt: clamp(finiteNum(rawAffinity.lastPetAt, 0), Number.MAX_SAFE_INTEGER),
			lastFeedAt: clamp(finiteNum(rawAffinity.lastFeedAt, 0), Number.MAX_SAFE_INTEGER),
			pets: clamp(finiteNum(rawAffinity.pets, 0), Number.MAX_SAFE_INTEGER),
			feeds: clamp(finiteNum(rawAffinity.feeds, 0), Number.MAX_SAFE_INTEGER),
			turns: clamp(finiteNum(rawAffinity.turns, 0), Number.MAX_SAFE_INTEGER)
		};
		const rawTreats = parsed.treats ?? {};
		const treats = {
			treats: clamp(finiteNum(rawTreats.treats, 0), defaultTreatConfig.maxTreats),
			lastTreatGrantAt: clamp(finiteNum(rawTreats.lastTreatGrantAt, 0), Number.MAX_SAFE_INTEGER),
			turnsAtLastTreatGrant: clamp(finiteNum(rawTreats.turnsAtLastTreatGrant, 0), Number.MAX_SAFE_INTEGER)
		};
		const rawDisplay = parsed.display ?? {};
		const display = {
			visible: typeof rawDisplay.visible === "boolean" ? rawDisplay.visible : base.display.visible,
			size: Math.round(Math.min(512, Math.max(32, finiteNum(rawDisplay.size, base.display.size)))),
			right: Math.round(clamp(finiteNum(rawDisplay.right, base.display.right), DISPLAY_INSET_MAX)),
			bottom: Math.round(clamp(finiteNum(rawDisplay.bottom, base.display.bottom), DISPLAY_INSET_MAX))
		};
		return {
			name: typeof parsed.name === "string" && parsed.name.trim() !== "" ? parsed.name : base.name,
			affinity,
			treats,
			display
		};
	} catch {
		return emptyPersist();
	}
}
/** Atomically persist state (write temp + rename). */
function savePetPersist(data, dir = petHomeDir()) {
	mkdirSync(dir, { recursive: true });
	const target = join(dir, "pet.json");
	const tmp = `${target}.tmp`;
	writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
	renameSync(tmp, target);
}
/**
* Cordis service exposing the pet RPC domain. Lazy: nothing is scanned or
* written until a query or interaction arrives; event listeners update only
* in-memory state, and persistence happens on interaction/config changes
* plus every completed turn.
*/
var PetService = class extends Service {
	static inject = [];
	machine;
	affinityConfig;
	treatConfig;
	persistDir;
	persist;
	lastTurnRewardAt = 0;
	enabled;
	disposeActivity;
	constructor(ctx, config = {}) {
		super(ctx, "pet");
		this.persistDir = config.persistDir ?? petHomeDir();
		this.affinityConfig = {
			...defaultAffinityConfig,
			...config.affinity ?? {}
		};
		this.treatConfig = {
			...defaultTreatConfig,
			...config.treats ?? {}
		};
		this.machine = new PetStateMachine({
			...defaultPetStateConfig,
			...config.state ?? {}
		});
		this.persist = loadPetPersist(this.persistDir);
		this.enabled = config.enabled ?? true;
		this.syncActivity();
	}
	/** Whether the pet service consumes session activity while enabled. */
	isEnabled() {
		return this.enabled;
	}
	/** RPC: current pet state snapshot. */
	async state() {
		return this.view();
	}
	/** Current persisted display config (read-only view). */
	display() {
		return { ...this.persist.display };
	}
	/** Current persisted pet name (read-only view). */
	petName() {
		return this.persist.name;
	}
	/** Start or stop the session-activity listeners that drive the pet. */
	setEnabled(enabled) {
		this.enabled = enabled;
		this.syncActivity();
	}
	syncActivity() {
		if (this.disposeActivity !== void 0) {
			this.disposeActivity();
			this.disposeActivity = void 0;
		}
		if (!this.enabled) return;
		this.disposeActivity = (() => {
			const disposers = [this.ctx.on("session/event", (_session, event) => {
				if (event.type !== "activity/status") return;
				const payload = event.data ?? {};
				if (payload.phase === void 0) return;
				const phase = payload.phase;
				if (![
					"idle",
					"waiting",
					"thinking",
					"tool",
					"done"
				].includes(phase)) return;
				this.machine.onActivityStatus({
					phase,
					...typeof payload.line === "string" ? { line: payload.line } : {},
					...typeof payload.phrase === "string" ? { phrase: payload.phrase } : {}
				});
				this.machine.onSessionActive();
				if (phase === "done") this.rewardTurn();
			}), this.ctx.on("session/disposed", () => {
				this.machine.onSessionDisposed();
			})];
			return () => {
				for (const dispose of disposers) dispose();
			};
		})();
	}
	/** RPC: pet or feed the pet. */
	async interact(kind) {
		const nowMs = Date.now();
		if (kind === "feed") this.settleTreats(nowMs);
		const outcome = applyInteraction(this.persist.affinity, kind, nowMs, this.affinityConfig);
		if (kind === "feed" && !outcome.accepted) return {
			reaction: outcome.reaction,
			delta: 0,
			affinity: this.affinityView(this.persist.affinity)
		};
		if (kind === "feed") {
			const consume = consumeTreat(this.persist.treats);
			if (!consume.ok) return {
				reaction: "没有小鱼干了，多陪鲸鱼娘工作一会儿吧～",
				delta: 0,
				affinity: this.affinityView(this.persist.affinity)
			};
			this.persist = {
				...this.persist,
				treats: consume.ledger
			};
		}
		if (outcome.accepted) {
			this.persist = {
				...this.persist,
				affinity: outcome.affinity
			};
			this.flush();
		}
		const affinity = this.affinityView(outcome.affinity);
		return {
			reaction: outcome.reaction,
			delta: outcome.delta,
			affinity
		};
	}
	/** RPC: show or hide the pet. */
	async setVisible(visible) {
		this.persist = {
			...this.persist,
			display: {
				...this.persist.display,
				visible
			}
		};
		this.flush();
		this.syncSettingsFromPet();
		return {
			ok: true,
			display: this.persist.display
		};
	}
	/** RPC: update display config (size / position). Values are clamped to whole pixels. */
	async setConfig(patch) {
		const next = {
			...this.persist.display,
			...patch
		};
		next.size = Math.round(Math.min(512, Math.max(32, next.size)));
		next.right = Math.round(Math.min(DISPLAY_INSET_MAX, Math.max(0, next.right)));
		next.bottom = Math.round(Math.min(DISPLAY_INSET_MAX, Math.max(0, next.bottom)));
		this.persist = {
			...this.persist,
			display: next
		};
		this.flush();
		this.syncSettingsFromPet();
		return {
			ok: true,
			display: this.persist.display
		};
	}
	/** RPC: rename the pet (trimmed, 1–20 chars). */
	async setName(name) {
		const trimmed = name.trim();
		if (trimmed === "") return {
			ok: false,
			error: "name-empty"
		};
		if (trimmed.length > 20) return {
			ok: false,
			error: "name-too-long"
		};
		this.persist = {
			...this.persist,
			name: trimmed
		};
		this.flush();
		this.syncSettingsFromPet();
		return {
			ok: true,
			name: trimmed
		};
	}
	/**
	* Apply a committed settings section to the persisted display config. Called
	* by the settings surface on every change; values are clamped exactly like
	* the setConfig RPC so both write paths converge.
	* @param section - the resolved settings section.
	*/
	applySettingsSection(section) {
		const next = { ...this.persist.display };
		next.visible = section.visible && (section.enabled ?? true);
		next.size = Math.round(Math.min(512, Math.max(32, section.size)));
		next.right = Math.round(Math.min(DISPLAY_INSET_MAX, Math.max(0, section.right)));
		next.bottom = Math.round(Math.min(DISPLAY_INSET_MAX, Math.max(0, section.bottom)));
		this.persist = {
			...this.persist,
			display: next,
			name: section.name.trim()
		};
		this.flush();
	}
	/** Mirror the persisted display config into the settings document (best-effort). */
	syncSettingsFromPet() {
		const settings = this.ctx.get("settings", false);
		if (settings === void 0) return;
		settings.update("pet", {
			visible: this.persist.display.visible,
			size: this.persist.display.size,
			right: this.persist.display.right,
			bottom: this.persist.display.bottom,
			name: this.persist.name
		}).catch(() => {});
	}
	/** Award the turn reward once per done phase (idempotent per transition). */
	rewardTurn() {
		const nowMs = Date.now();
		if (nowMs - this.lastTurnRewardAt < 5e3) return;
		this.lastTurnRewardAt = nowMs;
		this.persist = {
			...this.persist,
			affinity: applyTurnReward(this.persist.affinity, this.affinityConfig)
		};
		this.flush();
	}
	/**
	* Settle the treat economy (work + time output since the last
	* settlement); persists only when treats were actually granted.
	*/
	settleTreats(nowMs) {
		const settlement = settleTreatGrants(this.persist.treats, this.persist.affinity.turns, nowMs, this.treatConfig);
		if (settlement.gained > 0) {
			this.persist = {
				...this.persist,
				treats: settlement.ledger
			};
			this.flush();
		}
	}
	view() {
		const snapshot = this.machine.render();
		this.settleTreats(Date.now());
		return {
			animation: snapshot.animation,
			...snapshot.bubble === void 0 ? {} : { bubble: snapshot.bubble },
			phase: snapshot.phase,
			sessionActive: snapshot.sessionActive,
			affinity: this.affinityView(this.persist.affinity),
			display: { ...this.persist.display },
			name: this.persist.name,
			treats: {
				stocked: this.persist.treats.treats,
				max: this.treatConfig.maxTreats
			}
		};
	}
	affinityView(affinity) {
		const nowMs = Date.now();
		const rank = rankOf(affinity.points);
		return {
			points: affinity.points,
			rank: rank.name,
			rankEmoji: rank.emoji,
			pets: affinity.pets,
			feeds: affinity.feeds,
			turns: affinity.turns,
			petCooldown: nowMs - affinity.lastPetAt < this.affinityConfig.petCooldownMs,
			feedCooldown: nowMs - affinity.lastFeedAt < this.affinityConfig.feedCooldownMs
		};
	}
	flush() {
		try {
			savePetPersist(this.persist, this.persistDir);
		} catch {}
	}
};
//#endregion
//#region src/routes.ts
/** Browser-facing base path of the pet API. */
const PET_API_PREFIX = "/api/pet";
/** Browser-facing base path of the pet asset routes. */
const PET_ASSET_PREFIX = "/pet/whale";
/** Relative (to package root) asset files exposed under the prefix. */
const ASSET_FILES = [{
	name: "spritesheet.webp",
	mime: "image/webp"
}, {
	name: "pet.json",
	mime: "application/json"
}];
/** Absolute package root, resolved from this module's own location (lib/). */
function petPackageRoot(importMetaUrl) {
	return fileURLToPath(new URL("../", importMetaUrl));
}
/** Write one JSON response. */
function json(res, status, body) {
	res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
	res.end(JSON.stringify(body));
}
/** Require the method or answer 405. */
function requireMethod(req, res, method) {
	if (req.method === method) return true;
	json(res, 405, {
		ok: false,
		error: "method-not-allowed"
	});
	return false;
}
/** Read a JSON request body (bounded). */
function readJsonBody(req) {
	return new Promise((resolve, reject) => {
		let size = 0;
		const chunks = [];
		req.on("data", (chunk) => {
			size += chunk.length;
			if (size > 64 * 1024) {
				reject(/* @__PURE__ */ new Error("body-too-large"));
				queueMicrotask(() => req.destroy());
				return;
			}
			chunks.push(chunk);
		});
		req.on("end", () => {
			if (chunks.length === 0) {
				resolve({});
				return;
			}
			try {
				resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
			} catch {
				reject(/* @__PURE__ */ new Error("invalid-json"));
			}
		});
		req.on("error", reject);
	});
}
/** Wrap one async service call as a GET JSON route. */
function getRoute(path, run) {
	return {
		kind: "exact",
		path,
		handler: (req, res) => {
			if (!requireMethod(req, res, "GET")) return;
			run().then((value) => json(res, 200, value), (error) => {
				json(res, 500, {
					ok: false,
					error: error instanceof Error ? error.message : String(error)
				});
			});
		}
	};
}
/** Wrap one async service call as a POST JSON route (body passed through). */
function postRoute(path, run) {
	return {
		kind: "exact",
		path,
		handler: (req, res) => {
			if (!requireMethod(req, res, "POST")) return Promise.resolve();
			return readJsonBody(req).then((body) => {
				return run(typeof body === "object" && body !== null ? body : {}).then((value) => json(res, 200, value), (error) => {
					json(res, 400, {
						ok: false,
						error: error instanceof Error ? error.message : String(error)
					});
				});
			}, (error) => {
				json(res, 400, {
					ok: false,
					error: error instanceof Error ? error.message : String(error)
				});
			});
		}
	};
}
/** Build the full route family (API + assets) for one service + package root. */
function makePetRoutes(deps) {
	const { service, packageRoot } = deps;
	const apiRoutes = [
		getRoute(`${PET_API_PREFIX}/state`, () => service.state()),
		postRoute(`${PET_API_PREFIX}/interact`, (body) => {
			const kind = body.kind;
			if (kind !== "pet" && kind !== "feed") return Promise.reject(/* @__PURE__ */ new Error("invalid-kind"));
			return service.interact(kind);
		}),
		postRoute(`${PET_API_PREFIX}/set-visible`, (body) => {
			const visible = body.visible;
			if (typeof visible !== "boolean") return Promise.reject(/* @__PURE__ */ new Error("invalid-visible"));
			return service.setVisible(visible);
		}),
		postRoute(`${PET_API_PREFIX}/set-config`, (body) => service.setConfig({
			...typeof body.size === "number" ? { size: body.size } : {},
			...typeof body.right === "number" ? { right: body.right } : {},
			...typeof body.bottom === "number" ? { bottom: body.bottom } : {},
			...typeof body.visible === "boolean" ? { visible: body.visible } : {}
		})),
		postRoute(`${PET_API_PREFIX}/set-name`, (body) => {
			const name = body.name;
			if (typeof name !== "string") return Promise.reject(/* @__PURE__ */ new Error("invalid-name"));
			return service.setName(name);
		})
	];
	const assetRoutes = ASSET_FILES.map((file) => ({
		kind: "exact",
		path: `${PET_ASSET_PREFIX}/${file.name}`,
		handler: (req, res) => {
			if (req.method !== "GET" && req.method !== "HEAD") {
				res.writeHead(405);
				res.end();
				return;
			}
			return readFile(join(packageRoot, "assets", "whale", file.name)).then((body) => {
				res.writeHead(200, {
					"content-type": file.mime,
					"content-length": String(body.byteLength),
					"cache-control": "no-cache"
				});
				if (req.method === "HEAD") {
					res.end();
					return;
				}
				res.end(body);
			}, () => {
				res.writeHead(404);
				res.end();
			});
		}
	}));
	return [...apiRoutes, ...assetRoutes];
}
//#endregion
//#region src/index.ts
/** Stable cordis plugin name (matches cordis.patch.yml insert id). */
const name = "pet";
/** Services required before the pet can mount its surfaces. */
const inject = ["webServer"];
/** Settings section schema: the display fields and name the web settings surface edits. */
const PET_SETTINGS_SCHEMA = z.object({
	visible: z.boolean().default(true),
	size: z.number().step(1).min(32).max(512).default(160),
	right: z.number().step(1).min(0).max(DISPLAY_INSET_MAX).default(24),
	bottom: z.number().step(1).min(0).max(DISPLAY_INSET_MAX).default(20),
	name: z.string().min(1).max(20).pattern(/\S/).default(DEFAULT_PET_NAME),
	enabled: z.boolean().default(true)
});
/** Register the pet service and its API + asset routes on the context. */
function apply(ctx, config = {}) {
	const service = new PetService(ctx, config);
	let current = () => base;
	const base = {
		visible: service.display().visible,
		size: service.display().size,
		right: service.display().right,
		bottom: service.display().bottom,
		name: service.petName(),
		enabled: config.enabled ?? true
	};
	const routes = makePetRoutes({
		service,
		packageRoot: petPackageRoot(import.meta.url)
	});
	let disposeRoutes;
	const syncRoutes = () => {
		const enabled = current().enabled ?? true;
		if (disposeRoutes === void 0 && enabled) disposeRoutes = ctx.effect(() => {
			const disposers = routes.map((route) => ctx.webServer.register(route));
			return () => {
				for (const dispose of disposers) dispose();
			};
		}, "pet: routes");
		else if (disposeRoutes !== void 0 && !enabled) {
			disposeRoutes();
			disposeRoutes = void 0;
		}
	};
	installSettingsSection(ctx, settingsNamespace("pet"), PET_SETTINGS_SCHEMA, base, {
		setSource: (source) => {
			current = source;
		},
		onChange: () => {
			const section = current();
			service.applySettingsSection(section);
			service.setEnabled(section.enabled ?? true);
			syncRoutes();
		}
	});
	syncRoutes();
}
//#endregion
export { AFFINITY_MAX, AFFINITY_RANKS, PET_API_PREFIX, PET_ASSET_PREFIX, PET_SETTINGS_SCHEMA, PetService, PetStateMachine, animationForPhase, apply, applyInteraction, applyTurnReward, consumeTreat, defaultDisplayConfig, defaultTreatConfig, emptyAffinity, emptyPersist, emptyTreatLedger, inject, loadPetPersist, makePetRoutes, name, petHomeDir, petPackageRoot, rankOf, rowOf, savePetPersist, settleTreatGrants };
