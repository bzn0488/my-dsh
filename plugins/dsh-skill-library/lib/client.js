window.__ModuleLoader__.load({
  id: '@workstation/dsh-client-ui-skill-library',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })

    const ACTIVE_ATTR = 'data-dsh-skill-library-active'
    const VIEW_SELECTOR = '[data-dsh-skill-library-view]'
    const ENTRY_SELECTOR = '[data-dsh-skill-library-entry]'
    const ACTIVATE_EVENT = 'dsh-panel-activate'
    const PANEL_NAME = 'skill-library'
    const API = '/api/skill-library/skills'
    const STYLE_ID = 'dsh-skill-library-styles'

    const ICON = '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 2.5h7.5L13 5v8.5H3z"/><path d="M10.5 2.5V5H13M5.2 7.5h5.6M5.2 10h5.6"/></svg>'

    const CSS = `
[data-pane='conversation'] { position: relative; }
[data-dsh-skill-library-view] { position:absolute; inset:0; display:none; z-index:62; }
html[data-dsh-skill-library-active] [data-dsh-skill-library-view] { display:block; }
html[data-dsh-skill-library-active] [data-pane='conversation'] > :not([data-dsh-skill-library-view]) { display:none !important; }
.dsh-skill-library-entry { display:flex; align-items:center; gap:8px; width:100%; height:32px; padding:0 12px; background:transparent; border:none; border-radius:8px; color:var(--dsw-alias-label-secondary); cursor:pointer; font-size:13px; white-space:nowrap; }
.dsh-skill-library-entry:hover { background:var(--dsw-specific-sidebar-nav-item-hover); color:var(--dsw-alias-label-primary); }
.dsh-skill-library-entry[data-active] { background:var(--dsw-specific-sidebar-nav-item-active); color:var(--dsw-alias-label-primary); font-weight:600; }
.dsh-skill-library-entry-icon { display:inline-flex; align-items:center; justify-content:center; flex:none; }
.dsh-skill-library-entry-label { overflow:hidden; text-overflow:ellipsis; }
[data-dsh-frame][data-sidebar-collapsed] .dsh-skill-library-entry { justify-content:center; padding:0; width:100%; }
[data-dsh-frame][data-sidebar-collapsed] .dsh-skill-library-entry-label { display:none; }
.dsh-skill-library { height:100%; min-width:0; min-height:0; display:flex; flex-direction:column; padding:18px 20px; gap:14px; box-sizing:border-box; color:var(--dsw-alias-label-primary); background:var(--dsw-alias-bg-base); font-family:var(--dsw-font-family,system-ui,sans-serif); }
.dsh-skill-library-header { display:flex; align-items:center; gap:12px; flex:none; }
.dsh-skill-library-title-wrap { flex:1; min-width:0; }
.dsh-skill-library-title { margin:0; font-size:18px; line-height:1.25; font-weight:700; }
.dsh-skill-library-subtitle { margin:4px 0 0; font-size:12px; color:var(--dsw-alias-label-tertiary); }
.dsh-skill-library-search { width:min(38vw,360px); padding:8px 10px; border:1px solid var(--dsw-alias-border-l2); border-radius:8px; color:var(--dsw-alias-label-primary); background:var(--dsw-specific-input-major); font:inherit; font-size:13px; outline:none; }
.dsh-skill-library-refresh { padding:8px 11px; border:1px solid var(--dsw-alias-border-l2); border-radius:8px; background:var(--dsw-alias-bg-layer-2); color:var(--dsw-alias-label-primary); cursor:pointer; font:inherit; font-size:13px; }
.dsh-skill-library-main { min-height:0; flex:1; display:grid; grid-template-columns:minmax(255px,0.9fr) minmax(380px,1.7fr); gap:14px; }
.dsh-skill-library-list,.dsh-skill-library-detail { min-height:0; overflow:auto; border:1px solid var(--dsw-alias-border-l1); border-radius:12px; background:var(--dsw-alias-bg-layer-2); }
.dsh-skill-library-list { padding:8px; display:flex; flex-direction:column; gap:6px; }
.dsh-skill-library-card { width:100%; padding:10px 11px; box-sizing:border-box; border:1px solid transparent; border-radius:9px; background:transparent; color:inherit; text-align:left; cursor:pointer; font:inherit; }
.dsh-skill-library-card:hover { background:var(--dsw-specific-sidebar-nav-item-hover); }
.dsh-skill-library-card[data-selected] { border-color:var(--dsw-alias-border-l2); background:var(--dsw-specific-sidebar-nav-item-active); }
.dsh-skill-library-card-name { font-size:13px; font-weight:650; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.dsh-skill-library-card-description { margin-top:4px; color:var(--dsw-alias-label-secondary); font-size:12px; line-height:1.45; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.dsh-skill-library-tags { display:flex; flex-wrap:wrap; gap:4px; margin-top:7px; }
.dsh-skill-library-tag { display:inline-flex; padding:2px 6px; border-radius:999px; background:var(--dsw-alias-interactive-bg-hover); color:var(--dsw-alias-label-secondary); font-size:11px; }
.dsh-skill-library-detail { padding:20px; box-sizing:border-box; }
.dsh-skill-library-empty { height:100%; display:flex; align-items:center; justify-content:center; color:var(--dsw-alias-label-tertiary); text-align:center; padding:24px; box-sizing:border-box; font-size:13px; }
.dsh-skill-library-detail-name { margin:0; font-size:20px; line-height:1.3; }
.dsh-skill-library-detail-description { margin:8px 0 18px; color:var(--dsw-alias-label-secondary); line-height:1.55; font-size:14px; }
.dsh-skill-library-meta { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; margin-bottom:18px; }
.dsh-skill-library-meta-item { padding:9px 10px; border-radius:8px; background:var(--dsw-alias-bg-base); border:1px solid var(--dsw-alias-border-l1); min-width:0; }
.dsh-skill-library-meta-label { color:var(--dsw-alias-label-tertiary); font-size:11px; margin-bottom:3px; }
.dsh-skill-library-meta-value { font-size:12px; line-height:1.4; overflow-wrap:anywhere; }
.dsh-skill-library-section { margin:18px 0 0; }
.dsh-skill-library-section-title { margin:0 0 8px; font-size:13px; font-weight:700; }
.dsh-skill-library-when { margin:0; padding:10px 12px; border-left:3px solid var(--dsw-alias-state-business-primary); background:var(--dsw-alias-bg-base); color:var(--dsw-alias-label-secondary); font-size:13px; line-height:1.55; white-space:pre-wrap; }
.dsh-skill-library-body { margin:0; padding:12px; border-radius:8px; background:var(--dsw-alias-bg-base); border:1px solid var(--dsw-alias-border-l1); color:var(--dsw-alias-label-secondary); font-family:ui-monospace,SFMono-Regular,Consolas,monospace; font-size:12px; line-height:1.6; white-space:pre-wrap; overflow-wrap:anywhere; }
.dsh-skill-library-reference { margin:5px 0; padding:8px 10px; width:100%; text-align:left; border:1px solid var(--dsw-alias-border-l2); border-radius:7px; background:var(--dsw-alias-bg-base); color:var(--dsw-alias-label-primary); font:inherit; font-size:12px; cursor:pointer; }
.dsh-skill-library-reference:hover { background:var(--dsw-specific-sidebar-nav-item-hover); }
.dsh-skill-library-reference-content { margin:7px 0 0; padding:10px; border-radius:7px; background:var(--dsw-alias-bg-base); border:1px solid var(--dsw-alias-border-l1); white-space:pre-wrap; overflow-wrap:anywhere; color:var(--dsw-alias-label-secondary); font:12px/1.5 ui-monospace,SFMono-Regular,Consolas,monospace; }
@media(max-width:760px) { .dsh-skill-library { padding:12px; } .dsh-skill-library-header { flex-wrap:wrap; } .dsh-skill-library-search { order:3; width:100%; } .dsh-skill-library-main { grid-template-columns:1fr; grid-template-rows:minmax(160px,0.7fr) minmax(250px,1.3fr); } .dsh-skill-library-meta { grid-template-columns:1fr; } }
`

    function ensureStyle() {
      if (document.getElementById(STYLE_ID)) return
      const style = document.createElement('style')
      style.id = STYLE_ID
      style.textContent = CSS
      document.head.appendChild(style)
    }

    function create(tag, className, text) {
      const element = document.createElement(tag)
      if (className) element.className = className
      if (text !== undefined) element.textContent = text
      return element
    }

    function sidebarRoot() {
      const column = document.querySelector('[data-pane="sidebar"], [class*="sidebarCol"]')
      if (!column) return undefined
      const owner = column.querySelector('[class*="logoRow"]')?.parentElement
      return owner || column.firstElementChild || undefined
    }

    function newSessionButton(root) {
      return root.querySelector('button[class*="newSession"]') || Array.from(root.children).find(child => child.tagName === 'BUTTON')
    }

    function placeEntry(root, entry) {
      const button = newSessionButton(root)
      if (!button) return false
      if (entry.parentElement !== root) {
        const row = button.closest('[class*="logoRow"]')
        const base = row && row.parentElement === root ? row : button
        const family = Array.from(root.children).filter(el => el instanceof HTMLElement && el.matches('[data-dsh-taskboard-entry], [data-dsh-ssh-entry], [data-dsh-skill-library-entry]'))
        const anchor = family.length ? family[family.length - 1].nextElementSibling : base.nextElementSibling
        root.insertBefore(entry, anchor)
      }
      return true
    }

    function mount(app) {
      ensureStyle()
      const entry = document.createElement('button')
      entry.type = 'button'
      entry.dataset.dshSkillLibraryEntry = ''
      entry.className = 'dsh-skill-library-entry'
      entry.setAttribute('aria-label', '技能库')
      entry.title = '技能库'
      entry.innerHTML = '<span class="dsh-skill-library-entry-icon">' + ICON + '</span><span class="dsh-skill-library-entry-label">技能库</span>'
      entry.addEventListener('click', () => app.toggle())

      let sidebar
      const rootObserver = new MutationObserver(() => {
        if (!sidebar || !sidebar.isConnected) { sidebar = undefined }
        if (!sidebar) sidebar = sidebarRoot()
        if (sidebar && !sidebar.contains(entry)) placeEntry(sidebar, entry)
      })
      const bodyObserver = new MutationObserver(() => {
        if (!sidebar || !sidebar.isConnected) sidebar = sidebarRoot()
        if (sidebar) placeEntry(sidebar, entry)
      })
      bodyObserver.observe(document.body, { childList:true, subtree:true })
      sidebar = sidebarRoot()
      if (sidebar && placeEntry(sidebar, entry)) rootObserver.observe(sidebar, { childList:true, subtree:true })

      let container
      const ensureView = () => {
        if (container?.isConnected) return
        container?.remove()
        const column = document.querySelector('[data-pane="conversation"]')
        if (!column) return
        container = create('div')
        container.dataset.dshSkillLibraryView = ''
        column.appendChild(container)
        app.render(container)
      }
      const viewObserver = new MutationObserver(ensureView)
      viewObserver.observe(document.body, { childList:true, subtree:true })
      ensureView()

      const update = () => {
        if (app.open) entry.dataset.active = 'true'
        else delete entry.dataset.active
        if (app.open) {
          document.documentElement.removeAttribute('data-dsh-taskboard-active')
          document.documentElement.removeAttribute('data-dsh-ssh-active')
          document.documentElement.setAttribute(ACTIVE_ATTR, '')
          document.dispatchEvent(new CustomEvent(ACTIVATE_EVENT, { detail:PANEL_NAME }))
        } else document.documentElement.removeAttribute(ACTIVE_ATTR)
      }
      const onOther = event => { if (event.detail !== PANEL_NAME && app.open) app.close() }
      // The central panel is single-occupant. Selecting any conversation,
      // workspace, search result, or New Session item must hand it back to the
      // native conversation UI — including clicks on the already active session.
      const SIDEBAR_CONTEXT_SELECTOR = '[class*="sessionRow"], [class*="projectRow"], [class*="searchResultRow"], [class*="searchResultWorkspace"], [class*="newSession"]'
      const onSidebarContextClick = event => {
        if (!app.open) return
        const target = event.target instanceof Element ? event.target : null
        if (target?.closest(SIDEBAR_CONTEXT_SELECTOR)) app.close()
      }
      document.addEventListener(ACTIVATE_EVENT, onOther)
      document.addEventListener('click', onSidebarContextClick, true)
      app.subscribe(update)
      update()

      return () => {
        bodyObserver.disconnect(); rootObserver.disconnect(); viewObserver.disconnect()
        document.removeEventListener(ACTIVATE_EVENT, onOther)
        document.removeEventListener('click', onSidebarContextClick, true)
        document.documentElement.removeAttribute(ACTIVE_ATTR)
        entry.remove(); container?.remove()
      }
    }

    class SkillLibraryApp {
      constructor() { this.open = false; this.listeners = new Set(); this.skills = []; this.selected = undefined; this.query = ''; this.loading = false; this.error = undefined; this.root = undefined }
      subscribe(listener) { this.listeners.add(listener); return () => this.listeners.delete(listener) }
      emit() { for (const listener of this.listeners) listener() }
      toggle() { this.open ? this.close() : this.show() }
      show() { this.open = true; this.emit(); if (!this.skills.length && !this.loading) this.load() }
      close() { this.open = false; this.emit() }
      async load() {
        this.loading = true; this.error = undefined; this.render(this.root); 
        try {
          const response = await fetch(API, { cache:'no-store' })
          const payload = await response.json()
          if (!response.ok) throw new Error(payload.error || '无法读取技能库')
          this.skills = Array.isArray(payload.skills) ? payload.skills : []
          if (!this.selected || !this.skills.some(skill => skill.id === this.selected.id)) this.selected = this.skills[0]
        } catch (error) { this.error = error instanceof Error ? error.message : String(error) }
        finally { this.loading = false; this.render(this.root) }
      }
      visibleSkills() {
        const query = this.query.trim().toLowerCase()
        if (!query) return this.skills
        return this.skills.filter(skill => [skill.name, skill.description, skill.whenToUse, skill.category, ...(skill.tags || []), ...(skill.triggers || [])].join(' ').toLowerCase().includes(query))
      }
      async openReference(skill, file, button) {
        button.disabled = true; button.textContent = '正在加载 ' + file + '…'
        try {
          const response = await fetch('/api/skill-library/reference?skill=' + encodeURIComponent(skill.id) + '&file=' + encodeURIComponent(file), { cache:'no-store' })
          const payload = await response.json()
          if (!response.ok) throw new Error(payload.error || '无法读取参考资料')
          const content = create('pre', 'dsh-skill-library-reference-content', payload.content)
          button.after(content)
          button.remove()
        } catch (error) { button.disabled = false; button.textContent = '读取失败：' + (error instanceof Error ? error.message : String(error)) }
      }
      render(root) {
        if (!root) return
        this.root = root
        root.replaceChildren()
        const frame = create('section', 'dsh-skill-library')
        const header = create('header', 'dsh-skill-library-header')
        const titleWrap = create('div', 'dsh-skill-library-title-wrap')
        titleWrap.append(create('h1', 'dsh-skill-library-title', '技能库'), create('p', 'dsh-skill-library-subtitle', this.loading ? '正在读取工作站技能…' : `只读浏览 · ${this.skills.length} 个技能卡片`))
        const search = document.createElement('input')
        search.className = 'dsh-skill-library-search'; search.type = 'search'; search.placeholder = '搜索名称、摘要、场景、标签…'; search.value = this.query
        search.addEventListener('input', () => { this.query = search.value; this.render(root) })
        const refresh = create('button', 'dsh-skill-library-refresh', '刷新')
        refresh.type = 'button'; refresh.disabled = this.loading; refresh.addEventListener('click', () => this.load())
        header.append(titleWrap, search, refresh)
        const main = create('div', 'dsh-skill-library-main')
        const list = create('div', 'dsh-skill-library-list')
        if (this.error) list.append(create('div', 'dsh-skill-library-empty', '读取技能库失败：' + this.error))
        else {
          const visible = this.visibleSkills()
          if (!visible.length) list.append(create('div', 'dsh-skill-library-empty', this.loading ? '读取中…' : '没有匹配的技能卡片'))
          for (const skill of visible) {
            const card = create('button', 'dsh-skill-library-card')
            card.type = 'button'; if (this.selected?.id === skill.id) card.dataset.selected = ''
            card.append(create('div', 'dsh-skill-library-card-name', skill.name), create('div', 'dsh-skill-library-card-description', skill.description || '未填写摘要'))
            const tags = [...(skill.tags || []), skill.status && skill.status !== 'active' ? skill.status : ''].filter(Boolean)
            if (tags.length) { const tagWrap = create('div', 'dsh-skill-library-tags'); tags.slice(0,5).forEach(tag => tagWrap.append(create('span', 'dsh-skill-library-tag', tag))); card.append(tagWrap) }
            card.addEventListener('click', () => { this.selected = skill; this.render(root) })
            list.append(card)
          }
        }
        const detail = create('article', 'dsh-skill-library-detail')
        const skill = this.selected
        if (!skill) detail.append(create('div', 'dsh-skill-library-empty', this.loading ? '正在读取技能库…' : '选择一张技能卡片查看详情'))
        else {
          detail.append(create('h2', 'dsh-skill-library-detail-name', skill.name), create('p', 'dsh-skill-library-detail-description', skill.description || '未填写摘要。'))
          const meta = create('div', 'dsh-skill-library-meta')
          const metaItem = (label, value) => { const item = create('div', 'dsh-skill-library-meta-item'); item.append(create('div', 'dsh-skill-library-meta-label', label), create('div', 'dsh-skill-library-meta-value', value || '—')); return item }
          meta.append(metaItem('状态', skill.status || 'active'), metaItem('分类', skill.category), metaItem('版本', skill.version), metaItem('模型调用', skill.disableModelInvocation ? '已停用' : '可调用'), metaItem('标签', (skill.tags || []).join(' · ')), metaItem('触发词', (skill.triggers || []).join(' · ')))
          detail.append(meta)
          if (skill.whenToUse) { const section = create('section', 'dsh-skill-library-section'); section.append(create('h3', 'dsh-skill-library-section-title', '使用场景提示'), create('p', 'dsh-skill-library-when', skill.whenToUse)); detail.append(section) }
          const bodySection = create('section', 'dsh-skill-library-section'); bodySection.append(create('h3', 'dsh-skill-library-section-title', '实践手册'), create('pre', 'dsh-skill-library-body', skill.body || '（技能正文为空）')); detail.append(bodySection)
          if (skill.references?.length) { const referenceSection = create('section', 'dsh-skill-library-section'); referenceSection.append(create('h3', 'dsh-skill-library-section-title', '参考资料')); skill.references.forEach(file => { const button = create('button', 'dsh-skill-library-reference', '打开 ' + file); button.type = 'button'; button.addEventListener('click', () => this.openReference(skill, file, button)); referenceSection.append(button) }); detail.append(referenceSection) }
        }
        main.append(list, detail); frame.append(header, main); root.append(frame)
      }
    }

    const inject = []
    function apply() {
      const app = new SkillLibraryApp()
      const dispose = mount(app)
      return dispose
    }
    exports.apply = apply
    exports.inject = inject
    return module.exports
  }
})
