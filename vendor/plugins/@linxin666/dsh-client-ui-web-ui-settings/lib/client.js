window.__ModuleLoader__.load({
	id: "@linxin666/dsh-client-ui-web-ui-settings",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region \0dsh-css:/home/runner/work/dsh-web-ui/dsh-web-ui/packages/dsh-web-ui-settings/src/client/web-ui-settings.module.css.mjs
		const css = ".sG83Mq_groupCard{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);border-radius:6px;list-style:none;transition:border-color .12s,background .12s;overflow:hidden}.sG83Mq_header{width:100%;color:inherit;font:inherit;text-align:left;cursor:pointer;background:0 0;border:0;justify-content:space-between;align-items:center;padding:12px 14px;transition:background .12s;display:flex}.sG83Mq_header:hover{background:var(--dsw-alias-interactive-bg-hover)}.sG83Mq_header:active{background:var(--dsw-alias-interactive-bg-hover-solid)}.sG83Mq_header:focus-visible{box-shadow:inset 0 0 0 2px var(--dsw-alias-button-info-fill);outline:none}.sG83Mq_headText{flex-direction:column;gap:3px;min-width:0;display:flex}.sG83Mq_name,.sG83Mq_description{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}.sG83Mq_name{color:var(--dsw-alias-label-primary);font-weight:600}.sG83Mq_description{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:1.35}.sG83Mq_chevron,.sG83Mq_chevronOpen{color:var(--dsw-alias-label-tertiary);flex:none;margin-left:10px;font-size:13px;transition:transform .12s,color .12s}.sG83Mq_chevronOpen{transform:rotate(180deg)}.sG83Mq_body{border-top:1px solid var(--dsw-alias-border-l2);padding:2px 12px 12px}.sG83Mq_subcards{flex-direction:column;gap:10px;margin:0;padding:0;display:flex}@media (prefers-reduced-motion:reduce){.sG83Mq_groupCard,.sG83Mq_header,.sG83Mq_chevron,.sG83Mq_chevronOpen{transition:none}}";
		const tagId = "@linxin666/dsh-client-ui-web-ui-settings/web-ui-settings.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@linxin666/dsh-client-ui-web-ui-settings";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var web_ui_settings_module_css_default = {
			"body": "sG83Mq_body",
			"chevron": "sG83Mq_chevron",
			"chevronOpen": "sG83Mq_chevronOpen",
			"description": "sG83Mq_description",
			"groupCard": "sG83Mq_groupCard",
			"headText": "sG83Mq_headText",
			"header": "sG83Mq_header",
			"name": "sG83Mq_name",
			"subcards": "sG83Mq_subcards"
		};
		//#endregion
		//#region src/client/WebUIPluginsCard.tsx
		/**
		* The Web UI plugin group card. Renders as one item in the
		* `settings.plugin.item` list and, when expanded, renders every family
		* plugin card into its own child slot. The card chrome mirrors the official
		* ui-plugin-config PluginCard so the group reads as a sibling of the built-in
		* Shell / Agent loop / Web search cards.
		*/
		/**
		* Render the group card with the child plugin cards inside its body.
		* @param props - locale copy and the child slot renderer.
		* @returns the group card, or nothing when the section does not exist.
		*/
		function WebUIPluginsCard(props) {
			const { t, renderSlot } = props;
			const [open, setOpen] = (0, react.useState)(false);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
				className: web_ui_settings_module_css_default.groupCard,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: web_ui_settings_module_css_default.header,
					"aria-expanded": open,
					"aria-label": `${t(open ? "collapse" : "expand")}: ${t("title")}`,
					onClick: () => {
						setOpen(!open);
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: web_ui_settings_module_css_default.headText,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: web_ui_settings_module_css_default.name,
							title: t("title"),
							children: t("title")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: web_ui_settings_module_css_default.description,
							title: t("description"),
							children: t("description")
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: open ? web_ui_settings_module_css_default.chevronOpen : web_ui_settings_module_css_default.chevron,
						children: "▾"
					})]
				}), open ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: web_ui_settings_module_css_default.body,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
						className: web_ui_settings_module_css_default.subcards,
						children: renderSlot("web-ui.plugin.item", {})
					})
				}) : null]
			});
		}
		//#endregion
		//#region src/client/locales.ts
		/**
		* The `web-ui-plugins` locale dictionaries for the group card.
		*/
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"title": "Web UI 插件",
			"description": "统一管理 dsh-web-ui 全家桶插件的启用与配置。",
			"expand": "展开",
			"collapse": "收起",
			"empty": "没有已安装的 dsh-web-ui 插件。"
		};
		/** English dictionary, checked complete against the zh key set. */
		const en = {
			"title": "Web UI Plugins",
			"description": "Enable and configure the dsh-web-ui family plugins from one place.",
			"expand": "Show plugins",
			"collapse": "Hide plugins",
			"empty": "No dsh-web-ui plugins installed."
		};
		//#endregion
		//#region src/client/index.ts
		/** Required services. */
		const inject = ["slots", "locale"];
		/**
		* Register the Web UI plugin group.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register("web-ui-plugins", {
				zh,
				en
			}), "web-ui-settings: dictionaries");
			ctx.slots.inject("settings.plugin.item", () => ctx.slots.register({
				name: "settings.plugin.item",
				id: "web-ui-plugins",
				order: 90,
				locale: "web-ui-plugins",
				children: { "web-ui.plugin.item": {
					kind: "list",
					scope: "root"
				} }
			}, WebUIPluginsCard));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map