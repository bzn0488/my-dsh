window.__ModuleLoader__.load({
	id: "@linxin666/dsh-live-stats",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		let _deepseek_ai_dsh_client_runtime_client = require("@deepseek-ai/dsh-client-runtime/client");
		//#region \0dsh-css:/home/runner/work/dsh-web-ui/dsh-web-ui/packages/dsh-live-stats/src/client/settings-card.module.css.mjs
		const css = ".q9TcFa_card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:8px;min-width:0;list-style:none;transition:border-color .16s,background .16s;overflow:hidden}.q9TcFa_cardOpen{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-label-dimmed)}.q9TcFa_header{width:100%;color:inherit;cursor:pointer;text-align:left;font:inherit;background:0 0;border:0;align-items:center;gap:8px;padding:10px 14px;display:flex}.q9TcFa_header:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}.q9TcFa_header:active:not(:disabled){background:var(--dsw-alias-interactive-bg-active)}.q9TcFa_header:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:-2px}.q9TcFa_headText{flex-direction:column;flex:1;gap:2px;min-width:0;display:flex;overflow:hidden}.q9TcFa_name{color:var(--dsw-alias-label-primary);white-space:nowrap;text-overflow:ellipsis;font-weight:600;overflow:hidden}.q9TcFa_description{color:var(--dsw-alias-label-tertiary);white-space:nowrap;text-overflow:ellipsis;font-size:12px;overflow:hidden}.q9TcFa_pending{color:var(--dsw-alias-state-warn-primary);white-space:nowrap;flex:none;font-size:12px}.q9TcFa_chevron{color:var(--dsw-alias-label-tertiary);flex:none;font-size:13px;transition:transform .12s}.q9TcFa_chevronOpen{transform:rotate(180deg)}.q9TcFa_body{flex-direction:column;gap:14px;padding:0 14px 14px;display:flex}.q9TcFa_readOnly{color:var(--dsw-alias-label-tertiary);margin:0;font-size:12px}.q9TcFa_notExposed{color:var(--dsw-alias-state-warn-primary);margin:0;font-size:12px;line-height:1.5}.q9TcFa_footer{justify-content:flex-end;align-items:center;gap:8px;display:flex}.q9TcFa_failed{color:var(--dsw-alias-state-error-primary);margin:0 auto 0 0;font-size:12px}.q9TcFa_discard,.q9TcFa_save{font:inherit;cursor:pointer;border-radius:6px;padding:5px 12px;font-size:13px;transition:background-color .13s,border-color .13s,color .13s}.q9TcFa_discard{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);background:0 0}.q9TcFa_discard:hover:not(:disabled){color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-label-dimmed);background:var(--dsw-alias-interactive-bg-hover)}.q9TcFa_discard:active:not(:disabled){color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-label-dimmed);background:var(--dsw-alias-interactive-bg-active)}.q9TcFa_discard:focus-visible,.q9TcFa_save:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px}.q9TcFa_save{border:1px solid var(--dsw-alias-button-info-fill);background:var(--dsw-alias-button-info-fill);color:var(--dsw-alias-label-primary-foreground)}.q9TcFa_save:hover:not(:disabled),.q9TcFa_save:active:not(:disabled){border-color:var(--dsw-alias-button-info-hover);background:var(--dsw-alias-button-info-hover)}.q9TcFa_discard:disabled,.q9TcFa_save:disabled{opacity:.5;cursor:default}.q9TcFa_field{flex-direction:column;gap:4px;min-width:0;display:flex}.q9TcFa_head{align-items:center;gap:8px;display:flex}.q9TcFa_label{color:var(--dsw-alias-label-primary);font-size:13px;font-weight:500}.q9TcFa_badges{flex:none;align-items:center;gap:6px;min-width:0;margin-left:auto;display:flex}.q9TcFa_badge{background:var(--dsw-alias-interactive-bg-hover-accent);color:var(--dsw-alias-state-business-primary);white-space:nowrap;border-radius:999px;flex:none;padding:1px 6px;font-size:11px}.q9TcFa_reset{color:var(--dsw-alias-state-business-primary);cursor:pointer;white-space:nowrap;background:0 0;border:0;flex:none;padding:0;font-size:11px}.q9TcFa_reset:hover:not(:disabled){color:var(--dsw-alias-label-primary);text-decoration:underline}.q9TcFa_reset:active:not(:disabled){color:var(--dsw-alias-state-business-primary)}.q9TcFa_reset:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:2px;border-radius:2px}.q9TcFa_reset:disabled{opacity:.5;cursor:default}.q9TcFa_input,.q9TcFa_select{border:1px solid var(--dsw-alias-border-l2);font:inherit;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-primary);background:var(--dsw-specific-input-major);border-radius:6px;padding:6px 8px;font-size:13px;transition:border-color .13s,box-shadow .13s}.q9TcFa_input:hover:not(:disabled),.q9TcFa_select:hover:not(:disabled){border-color:var(--dsw-alias-label-dimmed)}.q9TcFa_input:focus-visible,.q9TcFa_select:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:1px}.q9TcFa_inputInvalid{border:1px solid var(--dsw-alias-state-error-primary);font:inherit;font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-primary);border-radius:6px;padding:6px 8px;font-size:13px;transition:border-color .13s,box-shadow .13s}.q9TcFa_inputInvalid:hover:not(:disabled){border-color:var(--dsw-alias-state-error-primary)}.q9TcFa_inputInvalid:focus-visible{outline:2px solid var(--dsw-alias-state-error-primary);outline-offset:1px}.q9TcFa_input:disabled,.q9TcFa_select:disabled{opacity:.6;cursor:default}.q9TcFa_hint{color:var(--dsw-alias-label-secondary);margin:0;font-size:12px}.q9TcFa_invalid{color:var(--dsw-alias-state-error-primary);margin:0;font-size:12px}@media (prefers-reduced-motion:reduce){.q9TcFa_card,.q9TcFa_chevron,.q9TcFa_discard,.q9TcFa_save,.q9TcFa_input,.q9TcFa_select,.q9TcFa_inputInvalid{transition:none}}";
		const tagId = "@linxin666/dsh-live-stats/settings-card.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@linxin666/dsh-live-stats";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var settings_card_module_css_default = {
			"badge": "q9TcFa_badge",
			"badges": "q9TcFa_badges",
			"body": "q9TcFa_body",
			"card": "q9TcFa_card",
			"cardOpen": "q9TcFa_cardOpen",
			"chevron": "q9TcFa_chevron",
			"chevronOpen": "q9TcFa_chevronOpen",
			"description": "q9TcFa_description",
			"discard": "q9TcFa_discard",
			"failed": "q9TcFa_failed",
			"field": "q9TcFa_field",
			"footer": "q9TcFa_footer",
			"head": "q9TcFa_head",
			"headText": "q9TcFa_headText",
			"header": "q9TcFa_header",
			"hint": "q9TcFa_hint",
			"input": "q9TcFa_input",
			"inputInvalid": "q9TcFa_inputInvalid",
			"invalid": "q9TcFa_invalid",
			"label": "q9TcFa_label",
			"name": "q9TcFa_name",
			"notExposed": "q9TcFa_notExposed",
			"pending": "q9TcFa_pending",
			"readOnly": "q9TcFa_readOnly",
			"reset": "q9TcFa_reset",
			"save": "q9TcFa_save",
			"select": "q9TcFa_select"
		};
		//#endregion
		//#region src/client/PluginSettingsCard.tsx
		/**
		* Shared chrome for the plugin settings card: a disclosure header naming the
		* plugin and what its settings govern, the controls inside, and the save that
		* writes them. Renders nothing while the namespace is unavailable — a
		* deployment that does not compose the owning plugin should show no trace of
		* it. Mirrors the official ui-plugin-config PluginCard in a self-contained
		* slice (this package must not depend on a sibling UI package).
		*/
		/**
		* Render one plugin settings card.
		* @param props - the plugin's copy keys, its form state, and its controls.
		* @returns the card, or nothing while the namespace is still loading.
		*/
		function PluginSettingsCard(props) {
			const [open, setOpen] = (0, react.useState)(false);
			const { state } = props;
			if (!state.available) return null;
			const title = props.t(props.titleKey);
			const blocked = !state.dirty || state.invalid || state.saving;
			const cardClass = open ? `${settings_card_module_css_default.cardOpen} ${settings_card_module_css_default.card}` : settings_card_module_css_default.card;
			const description = props.t(props.descriptionKey);
			if (!state.exposed) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
				className: cardClass,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: settings_card_module_css_default.header,
					"aria-expanded": open,
					"aria-label": `${props.t(open ? "settings.collapse" : "settings.expand")}: ${title}`,
					title: description,
					onClick: () => {
						setOpen(!open);
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: settings_card_module_css_default.headText,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: settings_card_module_css_default.name,
							title,
							children: title
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: settings_card_module_css_default.description,
							children: description
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: open ? settings_card_module_css_default.chevronOpen : settings_card_module_css_default.chevron,
						children: "▾"
					})]
				}), open ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: settings_card_module_css_default.body,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: settings_card_module_css_default.notExposed,
						role: "status",
						children: props.t("settings.notExposed")
					})
				}) : null]
			});
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
				className: cardClass,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: settings_card_module_css_default.header,
					"aria-expanded": open,
					"aria-label": `${props.t(open ? "settings.collapse" : "settings.expand")}: ${title}`,
					title: description,
					onClick: () => {
						setOpen(!open);
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: settings_card_module_css_default.headText,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: settings_card_module_css_default.name,
								title,
								children: title
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: settings_card_module_css_default.description,
								children: description
							})]
						}),
						state.dirty ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: settings_card_module_css_default.pending,
							title: props.t("settings.unsaved"),
							children: props.t("settings.unsaved")
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: open ? settings_card_module_css_default.chevronOpen : settings_card_module_css_default.chevron,
							children: "▾"
						})
					]
				}), open ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: settings_card_module_css_default.body,
					children: [
						!state.writable ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: settings_card_module_css_default.readOnly,
							role: "status",
							children: props.t("settings.readOnly")
						}) : null,
						props.children,
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: settings_card_module_css_default.footer,
							children: [
								state.failed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: settings_card_module_css_default.failed,
									role: "status",
									children: props.t("settings.saveFailed")
								}) : null,
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: settings_card_module_css_default.discard,
									disabled: !state.dirty || state.saving,
									onClick: props.onDiscard,
									children: props.t("settings.discard")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: settings_card_module_css_default.save,
									disabled: blocked,
									onClick: props.onSave,
									children: props.t(!state.saving ? "settings.save" : "settings.saving")
								})
							]
						})
					]
				}) : null]
			});
		}
		/** A staged value field. `numeric` only hints the keypad: which drafts a field accepts is decided by its spec. */
		function ValueField(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: settings_card_module_css_default.field,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: settings_card_module_css_default.head,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
							className: settings_card_module_css_default.label,
							htmlFor: props.id,
							children: props.label
						}), props.overridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: settings_card_module_css_default.badges,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: settings_card_module_css_default.badge,
								children: props.overriddenLabel
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: settings_card_module_css_default.reset,
								disabled: props.disabled,
								onClick: props.onReset,
								children: props.resetLabel
							})]
						}) : null]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						id: props.id,
						className: props.invalid ? settings_card_module_css_default.inputInvalid : settings_card_module_css_default.input,
						type: "text",
						...props.numeric === true ? { inputMode: "numeric" } : {},
						...props.invalid ? { "aria-invalid": true } : {},
						value: props.text,
						placeholder: props.placeholder ?? "",
						disabled: props.disabled,
						onChange: (event) => {
							props.onEdit(event.target.value);
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: props.invalid ? settings_card_module_css_default.invalid : settings_card_module_css_default.hint,
						children: props.invalid ? props.invalidLabel : props.hint
					})
				]
			});
		}
		/** A staged boolean field: 继承 / 开 / 关. */
		function BooleanField(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: settings_card_module_css_default.field,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: settings_card_module_css_default.head,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
							className: settings_card_module_css_default.label,
							htmlFor: props.id,
							children: props.label
						}), props.overridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: settings_card_module_css_default.badges,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: settings_card_module_css_default.badge,
								children: props.overriddenLabel
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: settings_card_module_css_default.reset,
								disabled: props.disabled,
								onClick: props.onReset,
								children: props.resetLabel
							})]
						}) : null]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
						id: props.id,
						className: settings_card_module_css_default.select,
						value: props.text,
						disabled: props.disabled,
						onChange: (event) => {
							props.onEdit(event.target.value);
						},
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "",
								children: props.inheritLabel
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "true",
								children: props.onLabel
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "false",
								children: props.offLabel
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: settings_card_module_css_default.hint,
						children: props.hint
					})
				]
			});
		}
		//#endregion
		//#region src/client/settings-form.ts
		/** A whole- or decimal-number field. An empty draft clears the field; any other draft that is not a finite number within the constraints blocks the save. */
		function numberField(field, constraints = {}) {
			const { integer = false, min } = constraints;
			return {
				field,
				format: (value) => typeof value === "number" ? String(value) : "",
				parse: (text) => {
					const trimmed = text.trim();
					if (trimmed === "") return { kind: "clear" };
					const parsed = Number(trimmed);
					if (!Number.isFinite(parsed)) return void 0;
					if (integer && !Number.isInteger(parsed)) return void 0;
					if (min !== void 0 && parsed < min) return void 0;
					return {
						kind: "set",
						value: parsed
					};
				}
			};
		}
		/** A boolean field, edited through true/false draft text. */
		function booleanField(field) {
			return {
				field,
				format: (value) => typeof value === "boolean" ? String(value) : "",
				parse: (text) => {
					const trimmed = text.trim();
					if (trimmed === "") return { kind: "clear" };
					if (trimmed === "true") return {
						kind: "set",
						value: true
					};
					if (trimmed === "false") return {
						kind: "set",
						value: false
					};
				}
			};
		}
		/**
		* Stages one card's edits over one settings namespace and writes them on save.
		*
		* The Host is the only authority on whether a value was accepted — its
		* validators own the constraints no schema can express — so the outcome is
		* read back from the section rather than predicted here. A save that did not
		* land keeps its drafts, so the user can correct them instead of retyping.
		*/
		var CardForm = class {
			scope;
			specs;
			staged = /* @__PURE__ */ new Map();
			listeners = /* @__PURE__ */ new Set();
			saving = false;
			failed = false;
			/** @param scope - the bound settings scope for this card's namespace. */
			constructor(scope, specs) {
				this.scope = scope;
				this.specs = new Map(specs.map((spec) => [spec.field, spec]));
				scope.subscribe(() => {
					this.publish();
				});
			}
			/** Publish a projection of this form, rebuilt whenever the scope or a draft changes. */
			bind(project) {
				const store = (0, _deepseek_ai_dsh_client_runtime_client.createSnapshotStore)(project());
				this.listeners.add(() => {
					store.set(project());
				});
				return store;
			}
			/** Read the card-level state: what the Host serves, and what a save would do. */
			shell() {
				const snapshot = this.scope.getSnapshot();
				const plan = this.plan();
				return {
					available: snapshot.status !== "loading",
					exposed: snapshot.status === "ready",
					writable: snapshot.writable,
					dirty: plan.length > 0,
					invalid: plan.some((item) => item.run === void 0),
					saving: this.saving,
					failed: this.failed
				};
			}
			/** Read one field's state from the effective section and its staged draft. */
			field(field) {
				const spec = this.specOf(field);
				const staged = this.staged.get(field);
				if (staged === void 0) return {
					text: spec.format(this.sectionValue(field)),
					overridden: this.stored(field),
					invalid: false
				};
				const write = staged.clear ? { kind: "clear" } : spec.parse(staged.text);
				return {
					text: staged.text,
					overridden: write?.kind === "set",
					invalid: write === void 0
				};
			}
			/** The actions the card's slot registration injects. */
			actions() {
				return {
					edit: (field, text) => {
						this.stage(field, {
							text,
							clear: false
						});
					},
					resetField: (field) => {
						this.stage(field, {
							text: this.specOf(field).format(this.baseValue(field)),
							clear: true
						});
					},
					save: () => {
						this.save();
					},
					discard: () => {
						if (this.staged.size === 0 && !this.failed) return;
						this.staged.clear();
						this.failed = false;
						this.publish();
					}
				};
			}
			/**
			* Write every staged edit, then re-seed from what the Host accepted.
			* @returns settlement after every write and the read-back.
			*/
			async save() {
				const plan = this.plan();
				const writes = plan.flatMap((item) => item.run === void 0 ? [] : [item.run]);
				if (plan.length === 0 || this.saving || writes.length !== plan.length) return;
				const fields = new Set(plan.map((item) => item.field));
				this.saving = true;
				this.failed = false;
				this.publish();
				let landed = true;
				for (const write of writes) landed = await write() && landed;
				if (landed) for (const field of fields) this.staged.delete(field);
				this.saving = false;
				this.failed = !landed;
				this.publish();
			}
			/**
			* Every staged edit a save would write. An entry whose draft is not a value
			* its field accepts carries no write: the form is still dirty, and the save
			* refuses rather than dropping the edit. A staged edit that matches the
			* effective section is not a write at all.
			* @returns the planned writes, in the order the fields were staged.
			*/
			plan() {
				const plan = [];
				for (const [field, staged] of this.staged) {
					const spec = this.specOf(field);
					if (staged.clear) {
						if (this.stored(field)) plan.push({
							field,
							run: () => this.clear(field)
						});
						continue;
					}
					if (staged.text === spec.format(this.sectionValue(field))) continue;
					const write = spec.parse(staged.text);
					if (write === void 0) plan.push({
						field,
						run: void 0
					});
					else if (write.kind === "clear") plan.push({
						field,
						run: () => this.clear(field)
					});
					else plan.push({
						field,
						run: () => this.store(field, write.value)
					});
				}
				return plan;
			}
			async clear(field) {
				await this.scope.unset(field);
				return !this.stored(field);
			}
			async store(field, value) {
				await this.scope.set(field, value);
				return this.userLayer()?.[field] === value;
			}
			stage(field, edit) {
				this.staged.set(field, edit);
				this.failed = false;
				this.publish();
			}
			specOf(field) {
				const spec = this.specs.get(field);
				if (spec === void 0) throw new Error(`settings card has no field ${field}`);
				return spec;
			}
			snapshotOf() {
				return this.scope.getSnapshot();
			}
			sectionValue(field) {
				return this.snapshotOf().value?.[field];
			}
			baseValue(field) {
				return this.snapshotOf().base?.[field];
			}
			userLayer() {
				return this.snapshotOf().user;
			}
			stored(field) {
				const user = this.userLayer();
				return user !== void 0 && Object.hasOwn(user, field);
			}
			publish() {
				for (const listener of this.listeners) listener();
			}
		};
		//#endregion
		//#region src/client/LiveStatsSettingsCard.tsx
		/** Bridges the `live-stats` scope onto the card's staged form. */
		var LiveStatsSettingsCardController = class {
			form;
			store;
			/** @param scope - the bound settings scope for the `live-stats` namespace. */
			constructor(scope) {
				this.form = new CardForm(scope, [
					booleanField("enabled"),
					numberField("charsPerToken", { min: .01 }),
					numberField("blockOverhead", {
						integer: true,
						min: 0
					}),
					numberField("roleOverhead", {
						integer: true,
						min: 0
					})
				]);
				this.store = this.form.bind(() => this.projection());
			}
			projection() {
				return {
					...this.form.shell(),
					enabled: this.form.field("enabled"),
					charsPerToken: this.form.field("charsPerToken"),
					blockOverhead: this.form.field("blockOverhead"),
					roleOverhead: this.form.field("roleOverhead")
				};
			}
			/**
			* Build the face the card's slot registration injects.
			* @returns the card's snapshot and its form actions.
			*/
			inject() {
				return {
					hooks: { liveStatsSettingsCard: this.store },
					...this.form.actions()
				};
			}
		};
		/**
		* Render the live-stats card.
		* @param props - locale copy, the card snapshot, and its form actions.
		* @returns the card.
		*/
		function LiveStatsSettingsCard(props) {
			const { t } = props;
			const state = props.useLiveStatsSettingsCard((snapshot) => snapshot);
			const disabled = !state.writable;
			const fieldProps = {
				overriddenLabel: t("settings.overridden"),
				resetLabel: t("settings.reset"),
				invalidLabel: t("settings.invalidNumber"),
				disabled
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(PluginSettingsCard, {
				t,
				titleKey: "settings.title",
				descriptionKey: "settings.description",
				state,
				onSave: props.save,
				onDiscard: props.discard,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BooleanField, {
						id: "settings-live-stats-enabled",
						label: t("settings.enabled"),
						hint: t("settings.enabledHint"),
						inheritLabel: t("settings.inherit"),
						onLabel: t("settings.on"),
						offLabel: t("settings.off"),
						...fieldProps,
						...state.enabled,
						onEdit: (text) => {
							props.edit("enabled", text);
						},
						onReset: () => {
							props.resetField("enabled");
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ValueField, {
						id: "settings-live-stats-chars",
						label: t("settings.charsPerToken"),
						hint: t("settings.charsPerTokenHint"),
						numeric: true,
						...fieldProps,
						...state.charsPerToken,
						onEdit: (text) => {
							props.edit("charsPerToken", text);
						},
						onReset: () => {
							props.resetField("charsPerToken");
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ValueField, {
						id: "settings-live-stats-block",
						label: t("settings.blockOverhead"),
						hint: t("settings.blockOverheadHint"),
						numeric: true,
						...fieldProps,
						...state.blockOverhead,
						onEdit: (text) => {
							props.edit("blockOverhead", text);
						},
						onReset: () => {
							props.resetField("blockOverhead");
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ValueField, {
						id: "settings-live-stats-role",
						label: t("settings.roleOverhead"),
						hint: t("settings.roleOverheadHint"),
						numeric: true,
						...fieldProps,
						...state.roleOverhead,
						onEdit: (text) => {
							props.edit("roleOverhead", text);
						},
						onReset: () => {
							props.resetField("roleOverhead");
						}
					})
				]
			});
		}
		//#endregion
		//#region src/client/TpsLine.tsx
		/** Format throughput with one decimal below 100 tok/s. */
		function formatTokensPerSecond(value) {
			return String(value < 100 ? Math.round(value * 10) / 10 : Math.round(value));
		}
		const STYLE = {
			boxSizing: "border-box",
			color: "var(--dsw-alias-label-tertiary)",
			fontSize: "12px",
			fontVariantNumeric: "tabular-nums",
			lineHeight: "20px",
			margin: "0 auto",
			maxWidth: "var(--dsh-chat-content-width)",
			overflow: "hidden",
			padding: "0 var(--dsh-composer-side-clearance)",
			textAlign: "center",
			textOverflow: "ellipsis",
			whiteSpace: "nowrap",
			width: "100%"
		};
		/** Second composer-status line for active or latest response throughput. */
		const TpsLine = (0, react.memo)(function TpsLine({ useProjection }) {
			const rate = useProjection("liveTokenUsage")?.tokensPerSecond;
			if (rate === void 0) return null;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: STYLE,
				children: [
					"TPS ",
					formatTokensPerSecond(rate),
					" tok/s"
				]
			});
		});
		/**
		* Composer-dock entry: adapts the session-scoped `conversation.composer.dock`
		* runtime share to the TPS line. The dock is the shipped stats-line seat, and
		* its standard kit supplies `useProjection` (the fifth framework hook seat),
		* which reads the host's `liveTokenUsage` projection. Registering here makes
		* the live TPS row actually mount — previously the TpsLine was only exported
		* and never mounted on rc.6 (issue #56).
		*/
		const TpsLineDockEntry = (0, react.memo)(function TpsLineDockEntry(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TpsLine, { useProjection: props.useProjection });
		});
		//#endregion
		//#region src/client/locales.ts
		/**
		* The `live-stats` namespace dictionaries: copy for the plugin settings card
		* (the `settings.plugin.item` seat) that edits the token-estimator parameters.
		*/
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"settings.title": "实时令牌估算",
			"settings.description": "生成吞吐量与令牌估算参数。",
			"settings.enabled": "启用实时统计",
			"settings.enabledHint": "关闭后停止统计令牌估算与生成吞吐。",
			"settings.charsPerToken": "每令牌字符数",
			"settings.charsPerTokenHint": "约多少个文本字符折算为 1 个令牌；支持小数。",
			"settings.blockOverhead": "内容块开销（令牌）",
			"settings.blockOverheadHint": "每个内容块固定的框架令牌数。",
			"settings.roleOverhead": "消息角色开销（令牌）",
			"settings.roleOverheadHint": "每条消息或助手响应固定的框架令牌数。",
			"settings.overridden": "已覆盖",
			"settings.reset": "恢复默认",
			"settings.notExposed": "当前 DSH 版本未向设置页暴露本插件的配置命名空间，表单不可用。可编辑 ~/.dsh/settings.yaml 直接配置，或为 dsh-host-apiproxy 的 WEB_SETTINGS_NAMESPACES 白名单补充本命名空间后重启。",
			"settings.readOnly": "当前部署的设置只读。",
			"settings.inherit": "继承",
			"settings.on": "开",
			"settings.off": "关",
			"settings.expand": "展开设置",
			"settings.collapse": "收起设置",
			"settings.save": "保存",
			"settings.saving": "保存中…",
			"settings.discard": "放弃",
			"settings.unsaved": "未保存",
			"settings.saveFailed": "部署未接受这些值，已保留供你修改。",
			"settings.invalidNumber": "请输入数字，留空则使用默认值。"
		};
		/** English dictionary, checked complete against the zh key set. */
		const en = {
			"settings.title": "Live token estimation",
			"settings.description": "Generation throughput and token estimation parameters.",
			"settings.enabled": "Enable live stats",
			"settings.enabledHint": "When off, token estimation and throughput tracking stop.",
			"settings.charsPerToken": "Characters per token",
			"settings.charsPerTokenHint": "Roughly how many text characters one token represents; a decimal is allowed.",
			"settings.blockOverhead": "Block overhead (tokens)",
			"settings.blockOverheadHint": "Fixed framing tokens assigned to each content block.",
			"settings.roleOverhead": "Role overhead (tokens)",
			"settings.roleOverheadHint": "Fixed framing tokens assigned to each message or assistant response.",
			"settings.overridden": "Overridden",
			"settings.reset": "Reset to default",
			"settings.notExposed": "This DSH version does not expose this plugin's settings namespace to the configuration page, so the form is unavailable. Edit ~/.dsh/settings.yaml directly, or add the namespace to dsh-host-apiproxy's WEB_SETTINGS_NAMESPACES allowlist and restart.",
			"settings.readOnly": "This deployment stores settings read-only.",
			"settings.inherit": "Inherit",
			"settings.on": "On",
			"settings.off": "Off",
			"settings.expand": "Show settings",
			"settings.collapse": "Hide settings",
			"settings.save": "Save",
			"settings.saving": "Saving…",
			"settings.discard": "Discard",
			"settings.unsaved": "Unsaved",
			"settings.saveFailed": "The deployment did not accept these values; they were left for you to correct.",
			"settings.invalidNumber": "Enter a number, or leave blank to use the default."
		};
		//#endregion
		//#region src/client/index.ts
		/** Dictionary namespace owned by this plugin. */
		const NS = "live-stats";
		/** Settings namespace the live-stats card edits (the Host plugin registers it). */
		const LIVE_STATS_NS = "live-stats";
		/** Services required by this plugin. */
		const inject = [
			"slots",
			"locale",
			"connection",
			"settingsScope",
			"remote"
		];
		/**
		* Register the live-stats surface: the generation-throughput TPS group lives
		* in the ui-conversation stats line (read directly from the `liveTokenUsage`
		* projection), and this build of the browser half mounts the plugin settings
		* card over the `live-stats` namespace.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "live-stats: dictionaries");
			const liveStatsSettings = new LiveStatsSettingsCardController(ctx.settingsScope.bind({ namespace: LIVE_STATS_NS }));
			ctx.slots.inject("web-ui.plugin.item", () => ctx.slots.register({
				name: "web-ui.plugin.item",
				id: "live-stats",
				order: 110,
				locale: NS,
				inject: () => liveStatsSettings.inject()
			}, LiveStatsSettingsCard));
			ctx.slots.inject("conversation.composer.dock", () => ctx.slots.register({
				name: "conversation.composer.dock",
				id: "live-stats",
				order: 100,
				inject: () => ({})
			}, TpsLineDockEntry));
		}
		//#endregion
		exports.TpsLine = TpsLine;
		exports.apply = apply;
		exports.formatTokensPerSecond = formatTokensPerSecond;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map