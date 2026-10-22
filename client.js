window.__ModuleLoader__.load({
  id: '@local/runtime-overview',
  factory(require) {
    'use strict'
    const React = require('react')
    const h = React.createElement

    /** Panel id shared by the sidebar row and the keyed `main` occupant. */
    const PANEL_ID = 'runtime-overview'
    /** Cards per page: a 2x2 grid, one card per quarter of the panel. */
    const PAGE_SIZE = 4
    /** Row order after the shipped panels and the task board. */
    const PANEL_ORDER = 30
    /** How often the grid re-renders so relative times and durations stay honest. */
    const TICK_MS = 10000
    /** How often the optional task-board enrichment refreshes. */
    const BOARD_MS = 15000

    const ZH = {
      'entry.label': '运行总览',
      'page.title': '运行总览',
      'mode.active': '活跃',
      'mode.all': '全部',
      'stats.pending': '待处理 {n}',
      'stats.running': '运行中 {n}',
      'stats.unread': '未读 {n}',
      'nav.prev': '上一页',
      'nav.next': '下一页',
      'nav.page': '{page} / {pages}',
      'state.pending': '需要你处理',
      'state.running': '运行中',
      'state.unread': '已完成未查看',
      'state.seen': '空闲',
      'card.board': '看板任务',
      'card.enter': '进入',
      'goal.label': '目标',
      'goal.blocked': '受阻',
      'goal.paused': '暂停',
      'goal.complete': '完成',
      'goal.active': '进行中',
      'todo.progress': '待办 {done}/{total}',
      'fact.context': '上下文',
      'fact.cost': '费用',
      'fact.costTip': '含子智能体会话；DeepSeek 峰时按 2 倍挂牌价、非峰按挂牌价估算',
      'fact.tokens': 'Token',
      'fact.elapsed': '运行时长',
      'fact.activity': '最近活动',
      'quote.label': '最近输入',
      'break.label': '上下文构成',
      'break.system': '系统',
      'break.tools': '工具',
      'break.messages': '消息',
      'card.enter': '进入',
      'card.pendingEnter': '点击处理',
      'card.open': '进入会话',
      'empty.active': '没有需要关注的会话',
      'empty.activeHint': '运行中、完成未查看、等待处理的会话会出现在这里',
      'empty.all': '还没有会话',
      'empty.allHint': '随便开一个对话就会出现在这里',
      'idle.slot': '暂无',
      'return.label': '返回运行总览',
      'return.short': '总览',
      'time.justNow': '刚刚',
      'time.unknown': '未知',
      'time.seconds': '{n} 秒前',
      'time.minutes': '{n} 分钟前',
      'time.hours': '{n} 小时前',
      'time.days': '{n} 天前',
      'duration.underMinute': '不到 1 分钟',
      'duration.minutes': '{n} 分钟',
      'duration.hours': '{h} 小时 {m} 分'
    }

    const EN = {
      'entry.label': 'Runtime Overview',
      'page.title': 'Runtime Overview',
      'mode.active': 'Active',
      'mode.all': 'All',
      'stats.pending': 'Needs you {n}',
      'stats.running': 'Running {n}',
      'stats.unread': 'Unread {n}',
      'nav.prev': 'Previous page',
      'nav.next': 'Next page',
      'nav.page': '{page} / {pages}',
      'state.pending': 'Needs you',
      'state.running': 'Running',
      'state.unread': 'Finished, unread',
      'state.seen': 'Idle',
      'card.board': 'Board task',
      'goal.label': 'Goal',
      'goal.blocked': 'blocked',
      'goal.paused': 'paused',
      'goal.complete': 'done',
      'goal.active': 'active',
      'todo.progress': 'To-do {done}/{total}',
      'fact.context': 'Context',
      'fact.cost': 'Cost',
      'fact.costTip': 'Includes subagent sessions; DeepSeek peak at 2x list, off-peak at list',
      'fact.tokens': 'Tokens',
      'fact.elapsed': 'Elapsed',
      'fact.activity': 'Active',
      'quote.label': 'Latest input',
      'break.label': 'Context makeup',
      'break.system': 'System',
      'break.tools': 'Tools',
      'break.messages': 'Messages',
      'card.enter': 'Open',
      'card.pendingEnter': 'Resolve',
      'card.open': 'Open session',
      'empty.active': 'Nothing needs attention',
      'empty.activeHint': 'Running, finished-unread, and pending sessions show up here',
      'empty.all': 'No sessions yet',
      'empty.allHint': 'Start a conversation and it shows up here',
      'idle.slot': 'Empty',
      'return.label': 'Back to Runtime Overview',
      'return.short': 'Overview',
      'time.justNow': 'just now',
      'time.unknown': 'unknown',
      'time.seconds': '{n}s ago',
      'time.minutes': '{n}m ago',
      'time.hours': '{n}h ago',
      'time.days': '{n}d ago',
      'duration.underMinute': 'under a minute',
      'duration.minutes': '{n} min',
      'duration.hours': '{h} h {m} min'
    }

    const STYLE = [
      '.ro-panel{display:flex;flex-direction:column;box-sizing:border-box;width:100%;height:100%;min-width:0;min-height:0;padding:16px 18px 18px;gap:12px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);}',
      '.ro-head{display:flex;align-items:center;gap:10px;flex:none;min-width:0;}',
      '.ro-title{font-size:16px;font-weight:650;letter-spacing:0.02em;white-space:nowrap;}',
      '.ro-brandMark{display:flex;align-items:center;color:var(--dsw-alias-brand-primary);flex:none;}',
      '.ro-live{font-size:9.5px;letter-spacing:0.12em;font-weight:600;color:var(--dsw-alias-state-success-primary);border:1px solid color-mix(in srgb,var(--dsw-alias-state-success-primary) 40%,transparent);border-radius:4px;padding:2px 6px;line-height:1;flex:none;}',
      '.ro-sub{font-size:11.5px;color:var(--dsw-alias-state-idle-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
      '.ro-stats{display:flex;align-items:center;gap:6px;min-width:0;overflow:hidden;}',
      '.ro-stat{display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 9px;border-radius:6px;border:1px solid var(--dsw-alias-border-l1);font-size:11.5px;color:var(--dsw-alias-label-secondary);white-space:nowrap;background:transparent;}',
      '.ro-stat i{width:6px;height:6px;border-radius:50%;display:inline-block;flex:none;}',
      '.ro-stat--pending i{background:var(--dsw-alias-state-warn-primary);}',
      '.ro-stat--running i{background:var(--dsw-alias-state-success-primary);}',
      '.ro-stat--unread i{background:var(--dsw-alias-brand-primary);}',
      '.ro-tools{margin-left:auto;display:flex;align-items:center;gap:8px;flex:none;}',
      '.ro-seg{display:inline-flex;border:1px solid var(--dsw-alias-border-l1);border-radius:7px;overflow:hidden;}',
      '.ro-seg button{height:26px;padding:0 11px;border:0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;line-height:1;cursor:pointer;white-space:nowrap;}',
      '.ro-seg button.ro-on{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);}',
      '.ro-seg button:hover{color:var(--dsw-alias-label-primary);}',
      '.ro-nav{width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--dsw-alias-border-l1);border-radius:7px;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;cursor:pointer;padding:0;}',
      '.ro-nav:disabled{opacity:0.35;cursor:default;}',
      '.ro-nav:not(:disabled):hover{color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-border-l2);}',
      '.ro-pageinfo{font-size:12px;color:var(--dsw-alias-label-secondary);min-width:34px;text-align:center;}',
      '.ro-rule{height:1px;background:var(--dsw-alias-border-l1);opacity:0.7;flex:none;}',
      '.ro-grid{flex:1 1 auto;min-height:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));gap:12px;}',
      '.ro-card{--ro-state:var(--dsw-alias-state-idle-primary);position:relative;display:flex;flex-direction:column;box-sizing:border-box;min-width:0;min-height:0;overflow:hidden;text-align:left;padding:14px 16px 12px 20px;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background-color:var(--dsw-alias-bg-layer-1);background-image:linear-gradient(180deg,color-mix(in srgb,var(--ro-state) 10%,transparent) 0%,transparent 46%);color:inherit;font:inherit;cursor:pointer;transition:border-color 150ms ease,background-color 150ms ease,transform 150ms ease,box-shadow 150ms ease;animation:ro-in 220ms cubic-bezier(0.2,0,0,1) both;}',
      '@keyframes ro-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}',
      '@media (prefers-reduced-motion: reduce){.ro-card{animation:none;}.ro-card--running .ro-dot{animation:none;}}',
      '.ro-card::before{content:"";position:absolute;left:0;top:14px;bottom:14px;width:3px;border-radius:0 2px 2px 0;background:var(--ro-state);opacity:0.9;}',
      '.ro-card:hover{border-color:color-mix(in srgb,var(--ro-state) 55%,var(--dsw-alias-border-l2));background-color:var(--dsw-alias-bg-layer-2);transform:translateY(-2px);box-shadow:0 8px 24px -18px color-mix(in srgb,var(--ro-state) 60%,transparent);}',
      '.ro-card:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px;}',
      '.ro-card--pending{--ro-state:var(--dsw-alias-state-warn-primary);}',
      '.ro-card--running{--ro-state:var(--dsw-alias-state-success-primary);}',
      '.ro-card--unread{--ro-state:var(--dsw-alias-brand-primary);}',
      '.ro-card--seen{--ro-state:var(--dsw-alias-state-idle-primary);}',
      '.ro-empty{border-style:dashed;background:transparent;cursor:default;align-items:center;justify-content:center;text-align:center;gap:8px;}',
      '.ro-empty::before{display:none;}',
      '.ro-empty:hover{background:transparent;border-color:var(--dsw-alias-border-l1);transform:none;box-shadow:none;}',
      '.ro-emptyGlyph{color:var(--dsw-alias-label-secondary);opacity:0.32;}',
      '.ro-emptyTitle{font-size:13px;color:var(--dsw-alias-label-secondary);}',
      '.ro-emptyHint{font-size:11.5px;color:var(--dsw-alias-state-idle-primary);max-width:240px;line-height:1.55;}',
      '.ro-status{display:flex;align-items:center;gap:7px;font-size:11.5px;color:var(--dsw-alias-label-secondary);flex:none;min-width:0;}',
      '.ro-dot{width:7px;height:7px;border-radius:50%;background:var(--ro-state);flex:none;}',
      '.ro-card--running .ro-dot{animation:ro-pulse 1.9s ease-in-out infinite;}',
      '@keyframes ro-pulse{0%,100%{box-shadow:0 0 0 0 transparent;opacity:1}50%{box-shadow:0 0 0 4px var(--dsw-alias-bg-layer-1);opacity:0.55}}',
      '.ro-stateLabel{color:var(--ro-state);font-weight:600;white-space:nowrap;padding:2px 7px;border-radius:4px;border:1px solid color-mix(in srgb,var(--ro-state) 32%,transparent);background:color-mix(in srgb,var(--ro-state) 12%,transparent);}',
      '.ro-tag{font-size:10.5px;line-height:1;padding:3px 6px;border-radius:4px;border:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);white-space:nowrap;}',
      '.ro-tag.ro-brand{color:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary);}',
      '.ro-name{margin-top:8px;font-size:17px;font-weight:620;line-height:1.32;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;word-break:break-word;flex:none;}',
      '.ro-project{margin-top:6px;font-size:12px;color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:none;}',
      '.ro-task{margin-top:4px;font-size:11.5px;color:var(--dsw-alias-brand-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:none;}',
      '.ro-goal{margin-top:8px;padding:7px 9px;border:1px solid var(--dsw-alias-border-l1);border-radius:6px;background:var(--dsw-alias-bg-base);font-size:11px;line-height:1.45;color:var(--dsw-alias-label-secondary);flex:none;min-height:0;overflow:hidden;}',
      '.ro-goalRow{display:flex;align-items:center;gap:7px;min-width:0;}',
      '.ro-goalTag{color:var(--dsw-alias-brand-primary);font-weight:600;white-space:nowrap;flex:none;}',
      '.ro-goal--blocked .ro-goalTag{color:var(--dsw-alias-state-warn-primary);}',
      '.ro-goalPhase{font-size:10.5px;color:var(--dsw-alias-state-idle-primary);white-space:nowrap;flex:none;}',
      '.ro-goalText{margin-top:4px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;word-break:break-word;}',
      '.ro-progress{margin-top:9px;display:flex;align-items:center;gap:9px;font-size:11.5px;color:var(--dsw-alias-label-secondary);flex:none;}',
      '.ro-bar{flex:1 1 auto;height:4px;border-radius:2px;background:var(--dsw-alias-border-l1);overflow:hidden;min-width:40px;}',
      '.ro-bar i{display:block;height:100%;background:var(--ro-state);opacity:0.85;}',
      '.ro-facts{display:grid;grid-template-columns:1fr 1fr;gap:8px 14px;margin-top:10px;flex:none;}',
      '.ro-fact{display:flex;flex-direction:column;gap:2px;min-width:0;}',
      '.ro-factLabel{font-size:10.5px;color:var(--dsw-alias-state-idle-primary);letter-spacing:0.04em;}',
      '.ro-factValue{font-size:15px;font-weight:620;line-height:1.2;color:var(--dsw-alias-label-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-variant-numeric:tabular-nums;}',
      '.ro-meter{height:3px;border-radius:2px;background:var(--dsw-alias-border-l1);overflow:hidden;margin-top:3px;}',
      '.ro-meter i{display:block;height:100%;background:var(--ro-state);}',
      '.ro-quote{margin-top:8px;display:flex;align-items:baseline;gap:7px;min-width:0;flex:none;}',
      '.ro-quoteLabel{font-size:10px;letter-spacing:0.06em;color:var(--dsw-alias-state-idle-primary);flex:none;}',
      '.ro-quoteText{padding-left:8px;border-left:2px solid var(--ro-state);font-size:11.5px;line-height:1.45;color:var(--dsw-alias-label-secondary);overflow:hidden;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;word-break:break-word;opacity:0.92;flex:1 1 auto;min-width:0;}',
      '.ro-break{margin-top:10px;flex:none;}',
      '.ro-breakHead{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:10px;letter-spacing:0.05em;color:var(--dsw-alias-state-idle-primary);}',
      '.ro-breakBar{display:flex;height:5px;border-radius:3px;overflow:hidden;background:var(--dsw-alias-border-l1);margin-top:5px;}',
      '.ro-breakBar i{height:100%;background:var(--dsw-alias-brand-primary);}',
      '.ro-breakBar i.b1{opacity:0.95;}',
      '.ro-breakBar i.b2{opacity:0.58;}',
      '.ro-breakBar i.b3{opacity:0.28;}',
      '.ro-breakLegend{display:flex;gap:11px;margin-top:5px;font-size:10px;color:var(--dsw-alias-state-idle-primary);flex:none;}',
      '.ro-breakLegend span{display:inline-flex;align-items:center;gap:4px;white-space:nowrap;}',
      '.ro-breakLegend i{width:5px;height:5px;border-radius:50%;background:var(--dsw-alias-brand-primary);display:inline-block;}',
      '.ro-breakLegend i.b1{opacity:0.95;}',
      '.ro-breakLegend i.b2{opacity:0.58;}',
      '.ro-breakLegend i.b3{opacity:0.28;}',
      '.ro-grow{flex:1 1 auto;min-height:6px;}',
      '.ro-mark{position:absolute;right:18px;bottom:52px;opacity:0.1;color:var(--ro-state);pointer-events:none;}',
      '.ro-path{margin-top:3px;font-size:11px;color:var(--dsw-alias-state-idle-primary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:none;}',
      '.ro-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;flex:none;padding-top:10px;margin-top:auto;}',
      '.ro-id{font-size:10.5px;color:var(--dsw-alias-state-idle-primary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
      '.ro-enter{font-size:11.5px;font-weight:550;color:var(--ro-state);flex:none;white-space:nowrap;padding:4px 10px;border-radius:6px;border:1px solid color-mix(in srgb,var(--ro-state) 35%,transparent);background:color-mix(in srgb,var(--ro-state) 10%,transparent);}'
    ].join('\n')

    const EMPTY_LIST = { ids: [], byId: {}, phase: 'pending', projectionsBySession: {} }
    const EMPTY_WORKSPACES = { items: [] }
    const EMPTY_STATUS = new Map()

    /** First moment this plugin observed each session running, for a live duration. */
    const startedAt = new Map()
    /** Browser-local ledger so a reload does not restart every elapsed clock. */
    const START_LEDGER = 'runtime-overview:started-at'

    /** Restore the observed start instants saved by an earlier page load. */
    function loadStarted() {
      try {
        const raw = localStorage.getItem(START_LEDGER)
        if (!raw) return
        const data = JSON.parse(raw)
        if (!data || typeof data !== 'object') return
        for (const id of Object.keys(data)) {
          const value = Number(data[id])
          if (Number.isFinite(value) && value > 0) startedAt.set(id, value)
        }
      } catch (error) { /* storage unavailable: durations start fresh */ }
    }

    /** Persist the observed start instants. */
    function saveStarted() {
      try {
        const data = {}
        startedAt.forEach(function (value, id) { data[id] = value })
        localStorage.setItem(START_LEDGER, JSON.stringify(data))
      } catch (error) { /* storage unavailable: durations stay in memory */ }
    }

    loadStarted()

    /** Read an optional client service without failing plugin activation. */
    function optional(ctx, name) {
      try {
        const service = ctx.get(name)
        return service === undefined ? undefined : service
      } catch (error) {
        return undefined
      }
    }

    /** Last path segment of a POSIX or Windows directory path. */
    function baseName(path) {
      if (typeof path !== 'string' || path === '') return ''
      const parts = path.split(/[\\/]+/).filter(function (part) { return part !== '' })
      return parts.length === 0 ? path : parts[parts.length - 1]
    }

    /** Short session identity for a card footer. */
    function shortId(id) {
      return typeof id === 'string' && id.length > 10 ? id.slice(0, 8) : String(id || '')
    }

    /** Current session/workspace directory title map. */
    function workspaceTitles(snapshot) {
      const map = {}
      const items = snapshot && Array.isArray(snapshot.items) ? snapshot.items : []
      for (const item of items) {
        if (item && typeof item.path === 'string') map[item.path] = typeof item.title === 'string' ? item.title : ''
      }
      return map
    }

    /** Localized dictionary for the active GUI locale. */
    function dictionaryFor(ctx) {
      let id = ''
      const locale = optional(ctx, 'locale')
      try {
        const snapshot = locale && typeof locale.getSnapshot === 'function' ? locale.getSnapshot() : undefined
        id = (snapshot && (snapshot.id || snapshot.locale)) || ''
      } catch (error) {
        id = ''
      }
      if (!id && typeof document !== 'undefined' && document.documentElement) id = document.documentElement.lang || ''
      if (!id && typeof navigator !== 'undefined') id = navigator.language || ''
      return String(id).toLowerCase().indexOf('zh') === 0 ? ZH : EN
    }

    /** Translate one key, substituting `{name}` placeholders. */
    function translate(dict, key, values) {
      let text = Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : key
      if (values) {
        for (const name of Object.keys(values)) text = text.split('{' + name + '}').join(String(values[name]))
      }
      return text
    }

    /** Relative activity label. */
    function ago(dict, now, time) {
      if (typeof time !== 'number' || !isFinite(time) || time <= 0) return translate(dict, 'time.unknown')
      const delta = Math.max(0, now - time)
      if (delta < 45000) return translate(dict, 'time.justNow')
      const minutes = Math.floor(delta / 60000)
      if (minutes < 60) return translate(dict, 'time.minutes', { n: minutes })
      const hours = Math.floor(minutes / 60)
      if (hours < 24) return translate(dict, 'time.hours', { n: hours })
      return translate(dict, 'time.days', { n: Math.floor(hours / 24) })
    }

    /** Human duration label. */
    function duration(dict, ms) {
      if (typeof ms !== 'number' || !isFinite(ms) || ms < 60000) return translate(dict, 'duration.underMinute')
      const minutes = Math.floor(ms / 60000)
      if (minutes < 60) return translate(dict, 'duration.minutes', { n: minutes })
      return translate(dict, 'duration.hours', { h: Math.floor(minutes / 60), m: minutes % 60 })
    }

    /** Subscribe to a SnapshotStore; re-render on every published change. */
    function useSnapshot(store, fallback) {
      const [snapshot, setSnapshot] = React.useState(function () {
        return store && typeof store.getSnapshot === 'function' ? store.getSnapshot() : fallback
      })
      React.useEffect(function () {
        if (!store) return undefined
        const read = function () { setSnapshot(store.getSnapshot()) }
        read()
        return store.subscribe(read)
      }, [store])
      return snapshot
    }

    /** Re-render on a fixed cadence while the panel is mounted. */
    function useTick(ms) {
      const [, setVersion] = React.useState(0)
      React.useEffect(function () {
        const timer = window.setInterval(function () { setVersion(function (value) { return value + 1 }) }, ms)
        return function () { window.clearInterval(timer) }
      }, [ms])
    }

    /** Re-render when the GUI language changes. */
    function useLocaleVersion(ctx) {
      const [, setVersion] = React.useState(0)
      React.useEffect(function () {
        const locale = optional(ctx, 'locale')
        if (!locale || typeof locale.subscribe !== 'function') return undefined
        return locale.subscribe(function () { setVersion(function (value) { return value + 1 }) })
      }, [ctx])
    }

    /**
     * List prices per 1M tokens, in USD, for the DeepSeek models this deployment
     * routes; they mirror the models.dev entries dsh-context prices against.
     * Unknown models simply show no cost instead of an invented number.
     */
    const MODEL_PRICES = {
      'deepseek-flash': { input: 0.15, output: 0.6, cacheRead: 0.003, cacheWrite: 0.15 },
      'deepseek-v4-pro': { input: 0.66, output: 1.98, cacheRead: 0.022, cacheWrite: 0.66 }
    }

    /** Model id the session's context timeline or selection names. */
    function modelIdOf(timeline, modelSelection) {
      if (timeline && typeof timeline.model === 'string' && timeline.model !== '') return timeline.model
      const selection = modelSelection && (modelSelection.lastUsed || modelSelection.next)
      return selection && typeof selection.model === 'string' ? selection.model : ''
    }

    /**
     * Cost in USD from the billed-token totals dsh-context already folded.
     * DeepSeek prices its peak windows at twice the models.dev list rate and
     * off-peak at the list rate; other providers book everything at list.
     */
    function costUsdOf(timeline, modelSelection) {
      const cost = timeline && timeline.cost
      if (!cost) return undefined
      const rates = MODEL_PRICES[modelIdOf(timeline, modelSelection)]
      if (!rates) return undefined
      let usd = 0
      let priced = false
      for (const provider of Object.keys(cost)) {
        const models = cost[provider]
        if (!models || typeof models !== 'object') continue
        const deepseek = String(provider).toLowerCase().indexOf('deepseek') !== -1
        for (const model of Object.keys(models)) {
          const entry = models[model]
          if (!entry || typeof entry !== 'object') continue
          for (const bucket of ['peak', 'off']) {
            const totals = entry[bucket]
            if (!totals || typeof totals !== 'object') continue
            priced = true
            const factor = bucket === 'peak' && deepseek ? 2 : 1
            usd += factor * (
              (totals.uncached || 0) * rates.input +
              (totals.cacheRead || 0) * rates.cacheRead +
              (totals.cacheWrite || 0) * rates.cacheWrite +
              (totals.output || 0) * rates.output
            ) / 1e6
          }
        }
      }
      return priced ? usd : undefined
    }

    /** Compact money label in the active display currency. */
    function moneyText(usd, chinese) {
      if (typeof usd !== 'number' || !isFinite(usd)) return '\u2014'
      const value = chinese ? usd / 0.15 : usd
      const symbol = chinese ? '\u00a5' : '$'
      return symbol + (value >= 0.01 ? value.toFixed(2) : value.toFixed(3))
    }

    /** Compact token count. */
    function tokensText(count) {
      if (typeof count !== 'number' || !isFinite(count) || count <= 0) return '\u2014'
      if (count >= 1e6) return (count / 1e6).toFixed(1) + 'M'
      if (count >= 1e3) return (count / 1e3).toFixed(1) + 'K'
      return String(Math.round(count))
    }

    /** Large, faint state glyph in a card corner. */
    function stateGlyph(state) {
      const common = {
        width: 86,
        height: 86,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.4,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true'
      }
      if (state === 'pending') {
        return h('svg', common,
          h('path', { d: 'M12 3l9 16H3z' }),
          h('path', { d: 'M12 9v4' }),
          h('path', { d: 'M12 16.5v.01' })
        )
      }
      if (state === 'unread') {
        return h('svg', common,
          h('path', { d: 'M4 6h16v12H4z' }),
          h('path', { d: 'M4 7l8 6 8-6' })
        )
      }
      if (state === 'running') {
        return h('svg', common,
          h('circle', { cx: 12, cy: 12, r: 8 }),
          h('path', { d: 'M12 8v4l3 2' })
        )
      }
      return h('svg', common, h('circle', { cx: 12, cy: 12, r: 8 }))
    }

    /**
     * Optional enrichment: a task-board card title for sessions the board is
     * currently executing. A missing board, a foreign origin or a changed
     * payload all degrade to "no enrichment" instead of blocking the grid.
     */
    function useTaskBoard() {
      const [snapshot, setSnapshot] = React.useState(null)
      React.useEffect(function () {
        let alive = true
        const load = function () {
          let request
          try {
            request = fetch('/api/task-board/state', { cache: 'no-store', credentials: 'same-origin', headers: { accept: 'application/json' } })
          } catch (error) {
            return
          }
          request.then(function (response) {
            return response.ok ? response.json() : null
          }).then(function (value) {
            if (alive) setSnapshot(value)
          }).catch(function () { /* board absent: keep the previous enrichment */ })
        }
        load()
        const timer = window.setInterval(load, BOARD_MS)
        const onVisibility = function () { if (document.visibilityState === 'visible') load() }
        document.addEventListener('visibilitychange', onVisibility)
        return function () {
          alive = false
          window.clearInterval(timer)
          document.removeEventListener('visibilitychange', onVisibility)
        }
      }, [])
      return snapshot
    }

    /** Map of sessionId -> task title for open task-board executions. */
    function boardRunningTasks(board) {
      const map = {}
      const tasks = board && Array.isArray(board.tasks) ? board.tasks : []
      for (const task of tasks) {
        if (!task || typeof task.title !== 'string') continue
        const executions = Array.isArray(task.executions) ? task.executions : []
        for (const execution of executions) {
          if (execution && execution.endedAt === undefined && typeof execution.sessionId === 'string') {
            map[execution.sessionId] = task.title
          }
        }
      }
      return map
    }

    /** Read one session status from the UI status map. */
    function statusOf(statusMap, id) {
      if (!statusMap || typeof statusMap.get !== 'function') return undefined
      return statusMap.get(id)
    }

    /**
     * Mount the overview: a sidebar panel row, its center-column page, a
     * "return to overview" session-header action, and the Alt+R shortcut.
     */
    function apply(ctx) {
      const slots = ctx.slots
      if (!slots) return

      /** Remember the moment each session started running. */
      ctx.effect(function () {
        const sessions = optional(ctx, 'sessions')
        const list = sessions && sessions.list
        if (!list || typeof list.subscribe !== 'function') return undefined
        const sync = function () {
          let snapshot
          try { snapshot = list.getSnapshot() } catch (error) { return }
          const ids = snapshot && Array.isArray(snapshot.ids) ? snapshot.ids : []
          const running = new Set()
          for (const id of ids) {
            const row = snapshot && snapshot.byId ? snapshot.byId[id] : undefined
            if (!row || row.running !== true || row.blank === true) continue
            running.add(id)
            if (!startedAt.has(id)) startedAt.set(id, Date.now())
          }
          for (const id of Array.from(startedAt.keys())) {
            if (!running.has(id)) startedAt.delete(id)
          }
          saveStarted()
        }
        sync()
        return list.subscribe(sync)
      }, 'runtime-overview: running start times')

      /** Navigate back to the overview panel. */
      const backToOverview = function () {
        const layout = optional(ctx, 'layout')
        if (layout && typeof layout.selectPanel === 'function') {
          try { layout.selectPanel(PANEL_ID) } catch (error) { /* layout root not mounted yet */ }
        }
      }

      /** Enter one session; selecting it hands the center column to the conversation. */
      const enterSession = function (sessionId) {
        const layout = optional(ctx, 'layout')
        if (layout && typeof layout.selectPanel === 'function') {
          try { layout.selectPanel('conversation') } catch (error) { /* ignore */ }
        }
        const navigation = optional(ctx, 'uiWorkspace')
        if (navigation && typeof navigation.openSession === 'function') {
          try { navigation.openSession(sessionId) } catch (error) { /* unknown/archived id */ }
        }
      }

      function OverviewIcon(props) {
        const size = props && typeof props.size === 'number' ? props.size : 16
        return h('svg', {
          viewBox: '0 0 16 16',
          width: size,
          height: size,
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.3,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
          'aria-hidden': 'true',
          'data-dsh-panel-entry': PANEL_ID
        },
          h('rect', { key: 'a', x: 2, y: 2, width: 5, height: 5, rx: 1 }),
          h('rect', { key: 'b', x: 9, y: 2, width: 5, height: 5, rx: 1 }),
          h('rect', { key: 'c', x: 2, y: 9, width: 5, height: 5, rx: 1 }),
          h('rect', { key: 'd', x: 9, y: 9, width: 5, height: 5, rx: 1 })
        )
      }

      function ReturnAction() {
        useLocaleVersion(ctx)
        const dict = dictionaryFor(ctx)
        const [hover, setHover] = React.useState(false)
        const style = {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          height: 26,
          padding: '0 9px',
          borderRadius: 7,
          border: '1px solid ' + (hover ? 'var(--dsw-alias-border-l2)' : 'var(--dsw-alias-border-l1)'),
          background: hover ? 'var(--dsw-alias-bg-layer-2)' : 'transparent',
          color: hover ? 'var(--dsw-alias-label-primary)' : 'var(--dsw-alias-label-secondary)',
          font: 'inherit',
          fontSize: 12,
          lineHeight: 1,
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }
        return h('button', {
          type: 'button',
          style: style,
          title: translate(dict, 'return.label'),
          'aria-label': translate(dict, 'return.label'),
          onClick: backToOverview,
          onMouseEnter: function () { setHover(true) },
          onMouseLeave: function () { setHover(false) }
        },
          h('svg', { width: 13, height: 13, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinejoin: 'round', 'aria-hidden': 'true' },
            h('rect', { x: 2, y: 2, width: 5, height: 5, rx: 1 }),
            h('rect', { x: 9, y: 2, width: 5, height: 5, rx: 1 }),
            h('rect', { x: 2, y: 9, width: 5, height: 5, rx: 1 }),
            h('rect', { x: 9, y: 9, width: 5, height: 5, rx: 1 })
          ),
          h('span', null, translate(dict, 'return.short'))
        )
      }

      function OverviewPanel(props) {
        useLocaleVersion(ctx)
        useTick(TICK_MS)
        const dict = dictionaryFor(ctx)
        const t = function (key, values) { return translate(dict, key, values) }

        const sessions = optional(ctx, 'sessions')
        const list = sessions && sessions.list ? sessions.list : undefined
        const snapshot = useSnapshot(list, EMPTY_LIST)
        const workspaces = optional(ctx, 'workspaces')
        const workspaceSnapshot = useSnapshot(workspaces && workspaces.list ? workspaces.list : undefined, EMPTY_WORKSPACES)
        const uiSession = optional(ctx, 'uiSession')
        const serviceStatus = useSnapshot(uiSession && uiSession.sessionStatus ? uiSession.sessionStatus : undefined, EMPTY_STATUS)
        const propStatus = props && typeof props.useSessionStatus === 'function'
          ? props.useSessionStatus(function (value) { return value })
          : undefined
        const statusMap = propStatus || serviceStatus
        const board = useTaskBoard()
        const titles = workspaceTitles(workspaceSnapshot)
        const boardTasks = boardRunningTasks(board)
        const now = Date.now()

        const rows = []
        const ids = snapshot && Array.isArray(snapshot.ids) ? snapshot.ids : []
        for (const id of ids) {
          const row = snapshot && snapshot.byId ? snapshot.byId[id] : undefined
          if (row) rows.push(row)
        }
        // The catalog keeps retained subagent rows out of `ids`; cost aggregation
        // still needs them, so walk every byId row separately from display order.
        const catalogRows = snapshot && snapshot.byId
          ? Object.keys(snapshot.byId).map(function (id) { return snapshot.byId[id] }).filter(function (row) { return row !== undefined && row !== null })
          : rows

        const active = []
        const all = []
        let pendingCount = 0
        let runningCount = 0
        let unreadCount = 0
        for (const row of rows) {
          if (row.blank === true || row.origin === 'subagent') continue
          const status = statusOf(statusMap, row.id)
          const isRunning = status && status.running !== undefined ? status.running === true : row.running === true
          const isPending = !!(status && status.pendingInteraction)
          const isUnread = !!(status && status.completionUnread)
          let state = 'seen'
          if (isPending) state = 'pending'
          else if (isRunning) state = 'running'
          else if (isUnread) state = 'unread'
          if (state === 'pending') pendingCount += 1
          else if (state === 'running') runningCount += 1
          else if (state === 'unread') unreadCount += 1
          const entry = { row: row, state: state, status: status }
          all.push(entry)
          if (state !== 'seen') active.push(entry)
        }
        const priority = { pending: 0, running: 1, unread: 2, seen: 3 }
        const byPriority = function (a, b) {
          const delta = priority[a.state] - priority[b.state]
          if (delta !== 0) return delta
          return (b.row.updatedAt || 0) - (a.row.updatedAt || 0)
        }
        active.sort(byPriority)
        all.sort(function (a, b) { return (b.row.updatedAt || 0) - (a.row.updatedAt || 0) })

        const [mode, setMode] = React.useState('active')
        const [page, setPage] = React.useState(0)
        const source = mode === 'active' ? active : all
        const pageCount = Math.max(1, Math.ceil(source.length / PAGE_SIZE))
        const safePage = Math.min(page, pageCount - 1)
        const items = source.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

        const changeMode = function (next) {
          setMode(next)
          setPage(0)
        }
        const go = function (delta) {
          setPage(function (value) {
            return Math.min(Math.max(value + delta, 0), pageCount - 1)
          })
        }

        const stateKey = function (state) {
          if (state === 'pending') return 'state.pending'
          if (state === 'running') return 'state.running'
          if (state === 'unread') return 'state.unread'
          return 'state.seen'
        }

        /**
         * Cost for one session plus every subagent session beneath it, the same
         * family basis the Context Insights card uses. Memoized per render.
         */
        const familyCostMemo = new Map()
        const familyCostOf = function (target, depth) {
          if (depth > 6) return undefined
          if (familyCostMemo.has(target.id)) return familyCostMemo.get(target.id)
          const projection = snapshot && snapshot.projectionsBySession ? snapshot.projectionsBySession[target.id] : undefined
          const values = projection && projection.values ? projection.values : undefined
          let total = costUsdOf(values && values.contextTimeline, values && values.modelSelection)
          for (const child of catalogRows) {
            if (child.parentId !== target.id || child.origin !== 'subagent') continue
            const sub = familyCostOf(child, depth + 1)
            if (sub === undefined) continue
            total = (total === undefined ? 0 : total) + sub
          }
          familyCostMemo.set(target.id, total)
          return total
        }

        const cards = []
        for (let cardIndex = 0; cardIndex < items.length; cardIndex += 1) {
          const entry = items[cardIndex]
          const row = entry.row
          const taskTitle = boardTasks[row.id]
          const project = titles[row.cwd] || baseName(row.cwd)
          const started = startedAt.get(row.id)
          const projection = snapshot && snapshot.projectionsBySession ? snapshot.projectionsBySession[row.id] : undefined
          const values = projection && projection.values ? projection.values : undefined
          const goalView = values && values.goal && values.goal.goal ? values.goal : undefined
          const goal = goalView ? goalView.goal : undefined
          const todos = values && Array.isArray(values.todos) ? values.todos : undefined
          const todoTotal = todos ? todos.length : 0
          const todoDone = todos ? todos.filter(function (item) { return item && item.status === 'completed' }).length : 0
          const goalPhase = goal
            ? (goal.phase === 'blocked' ? t('goal.blocked') : goal.phase === 'paused' ? t('goal.paused') : goal.phase === 'complete' ? t('goal.complete') : t('goal.active'))
            : ''
          const timeline = values && values.contextTimeline ? values.contextTimeline : undefined
          const modelSelection = values && values.modelSelection ? values.modelSelection : undefined
          const tokenUsage = values && values.tokenUsage ? values.tokenUsage : undefined
          const totalTokens = tokenUsage
            ? (tokenUsage.uncachedInputTokens || 0) + (tokenUsage.outputTokens || 0) + (tokenUsage.cacheReadTokens || 0) + (tokenUsage.cacheWriteTokens || 0)
            : undefined
          const pressure = values && values.contextPressure ? values.contextPressure : undefined
          const surfaceTokens = timeline && timeline.current && typeof timeline.current.total === 'number' ? timeline.current.total : undefined
          const windowTokens = timeline && typeof timeline.contextWindow === 'number' && timeline.contextWindow > 0
            ? timeline.contextWindow
            : (pressure && typeof pressure.contextWindow === 'number' && pressure.contextWindow > 0 ? pressure.contextWindow : undefined)
          const pressureTokens = pressure && typeof pressure.pressureTokens === 'number'
            ? pressure.pressureTokens
            : (pressure && typeof pressure.projectedTokens === 'number' ? pressure.projectedTokens : undefined)
          const contextTokens = surfaceTokens !== undefined ? surfaceTokens : pressureTokens
          const contextPercent = contextTokens !== undefined && windowTokens !== undefined
            ? Math.max(0, Math.min(100, Math.round((contextTokens / windowTokens) * 100)))
            : undefined
          const costUsd = familyCostOf(row, 0)
          const lastUser = timeline && typeof timeline.lastUser === 'string' ? timeline.lastUser.trim() : ''
          const timeLabel = entry.state === 'running' && started ? duration(dict, now - started) : ago(dict, now, row.updatedAt)
          const breakdown = values && values.contextBreakdown ? values.contextBreakdown : undefined
          const breakSystem = breakdown && typeof breakdown.systemTokens === 'number' ? breakdown.systemTokens : 0
          const breakTools = breakdown && typeof breakdown.toolsTokens === 'number' ? breakdown.toolsTokens : 0
          const breakMessages = breakdown && typeof breakdown.messageTokens === 'number' ? breakdown.messageTokens : 0
          const breakTotal = breakSystem + breakTools + breakMessages
          const share = function (value) {
            if (breakTotal <= 0 || value <= 0) return 0
            return Math.max(2, Math.round((value / breakTotal) * 100))
          }
          const fact = function (key, label, value, meter, title) {
            return h('div', { key: key, className: 'ro-fact', title: title || undefined },
              h('span', { className: 'ro-factLabel' }, label),
              h('span', { className: 'ro-factValue' }, value),
              meter === undefined ? null : h('div', { className: 'ro-meter' }, h('i', { style: { width: meter + '%' } }))
            )
          }
          cards.push(h('button', {
            key: row.id,
            type: 'button',
            className: 'ro-card ro-card--' + entry.state,
            style: { animationDelay: (cardIndex * 35) + 'ms' },
            title: row.displayTitle || row.id,
            'aria-label': (row.displayTitle || row.id) + ' · ' + t('card.open'),
            onClick: function () { enterSession(row.id) }
          },
            h('div', { className: 'ro-mark' }, stateGlyph(entry.state)),
            h('div', { className: 'ro-status' },
              h('span', { className: 'ro-dot' }),
              h('span', { className: 'ro-stateLabel' }, t(stateKey(entry.state))),
              taskTitle ? h('span', { className: 'ro-tag ro-brand' }, t('card.board')) : null
            ),
            h('div', { className: 'ro-name' }, row.displayTitle || row.id),
            project
              ? h('div', { className: 'ro-project' }, project)
              : (row.cwd ? h('div', { className: 'ro-path', title: row.cwd }, row.cwd) : null),
            taskTitle ? h('div', { className: 'ro-task', title: taskTitle }, taskTitle) : null,
            lastUser ? h('div', { className: 'ro-quote' },
              h('span', { className: 'ro-quoteLabel' }, t('quote.label')),
              h('span', { className: 'ro-quoteText', title: lastUser }, '\u300c' + lastUser + '\u300d')
            ) : null,
            goal ? h('div', { className: 'ro-goal' + (goal.phase === 'blocked' ? ' ro-goal--blocked' : '') },
              h('div', { className: 'ro-goalRow' },
                h('span', { className: 'ro-goalTag' }, t('goal.label')),
                h('span', { className: 'ro-goalPhase' }, goalPhase)
              ),
              h('div', { className: 'ro-goalText' }, goal.objective || '')
            ) : null,
            todos && todoTotal > 0 ? h('div', { className: 'ro-progress' },
              h('span', null, t('todo.progress', { done: todoDone, total: todoTotal })),
              h('div', { className: 'ro-bar' }, h('i', { style: { width: Math.round((todoDone / todoTotal) * 100) + '%' } }))
            ) : null,
            h('div', { className: 'ro-facts' },
              h('div', {
                key: 'context',
                className: 'ro-fact',
                title: breakTotal > 0
                  ? t('break.system') + ' ' + share(breakSystem) + '% · ' + t('break.tools') + ' ' + share(breakTools) + '% · ' + t('break.messages') + ' ' + share(breakMessages) + '%'
                  : undefined
              },
                h('span', { className: 'ro-factLabel' }, t('fact.context')),
                h('span', { className: 'ro-factValue' }, contextPercent === undefined ? '\u2014' : contextPercent + '%'),
                h('div', { className: 'ro-breakBar' },
                  breakTotal > 0 ? [
                    h('i', { key: 's', className: 'b1', style: { width: (share(breakSystem) * (contextPercent || 0) / 100) + '%' } }),
                    h('i', { key: 't', className: 'b2', style: { width: (share(breakTools) * (contextPercent || 0) / 100) + '%' } }),
                    h('i', { key: 'm', className: 'b3', style: { width: (share(breakMessages) * (contextPercent || 0) / 100) + '%' } })
                  ] : h('i', { className: 'b1', style: { width: (contextPercent || 0) + '%' } })
                )
              ),
              fact('cost', t('fact.cost'), moneyText(costUsd, dict === ZH), undefined, t('fact.costTip')),
              fact('tokens', t('fact.tokens'), tokensText(totalTokens)),
              fact('time', entry.state === 'running' ? t('fact.elapsed') : t('fact.activity'), timeLabel)
            ),
            h('div', { className: 'ro-grow' }),
            h('div', { className: 'ro-foot' },
              h('span', { className: 'ro-id' }, '#' + shortId(row.id)),
              h('span', { className: 'ro-enter' }, (entry.state === 'pending' ? t('card.pendingEnter') : t('card.enter')) + ' \u2192')
            )
          ))
        }
        for (let index = items.length; index < PAGE_SIZE; index += 1) {
          const first = index === 0
          const emptyTitle = mode === 'active' ? t('empty.active') : t('empty.all')
          const emptyHint = mode === 'active' ? t('empty.activeHint') : t('empty.allHint')
          cards.push(h('div', { key: 'empty-' + index, className: 'ro-card ro-empty ro-card--seen' },
            h('div', { className: 'ro-emptyGlyph' },
              h('svg', { width: 38, height: 38, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 0.9, strokeLinejoin: 'round', 'aria-hidden': 'true' },
                h('rect', { x: 2, y: 2, width: 5, height: 5, rx: 1 }),
                h('rect', { x: 9, y: 2, width: 5, height: 5, rx: 1 }),
                h('rect', { x: 2, y: 9, width: 5, height: 5, rx: 1 }),
                h('rect', { x: 9, y: 9, width: 5, height: 5, rx: 1 })
              )
            ),
            first ? h('div', { className: 'ro-emptyTitle' }, emptyTitle) : h('div', { className: 'ro-emptyTitle' }, t('idle.slot')),
            first ? h('div', { className: 'ro-emptyHint' }, emptyHint) : null
          ))
        }

        const header = h('div', { className: 'ro-head' },
          h('span', { className: 'ro-brandMark' },
            h('svg', { width: 17, height: 17, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinejoin: 'round', 'aria-hidden': 'true' },
              h('rect', { x: 1.5, y: 1.5, width: 5.6, height: 5.6, rx: 1 }),
              h('rect', { x: 8.9, y: 1.5, width: 5.6, height: 5.6, rx: 1 }),
              h('rect', { x: 1.5, y: 8.9, width: 5.6, height: 5.6, rx: 1 }),
              h('rect', { x: 8.9, y: 8.9, width: 5.6, height: 5.6, rx: 1 })
            )
          ),
          h('div', { className: 'ro-title' }, t('page.title')),
          runningCount > 0 ? h('span', { className: 'ro-live' }, 'LIVE') : null,
          h('div', { className: 'ro-stats' },
            pendingCount > 0 ? h('span', { key: 'p', className: 'ro-stat ro-stat--pending' }, h('i'), t('stats.pending', { n: pendingCount })) : null,
            runningCount > 0 ? h('span', { key: 'r', className: 'ro-stat ro-stat--running' }, h('i'), t('stats.running', { n: runningCount })) : null,
            unreadCount > 0 ? h('span', { key: 'u', className: 'ro-stat ro-stat--unread' }, h('i'), t('stats.unread', { n: unreadCount })) : null
          ),
          h('div', { className: 'ro-tools' },
            h('div', { className: 'ro-seg', role: 'group' },
              h('button', {
                type: 'button',
                className: mode === 'active' ? 'ro-on' : '',
                onClick: function () { changeMode('active') }
              }, t('mode.active') + ' ' + active.length),
              h('button', {
                type: 'button',
                className: mode === 'all' ? 'ro-on' : '',
                onClick: function () { changeMode('all') }
              }, t('mode.all') + ' ' + all.length)
            ),
            pageCount > 1 ? h('button', {
              type: 'button',
              className: 'ro-nav',
              title: t('nav.prev'),
              'aria-label': t('nav.prev'),
              disabled: safePage <= 0,
              onClick: function () { go(-1) }
            }, '\u2039') : null,
            pageCount > 1 ? h('div', { className: 'ro-pageinfo' }, t('nav.page', { page: safePage + 1, pages: pageCount })) : null,
            pageCount > 1 ? h('button', {
              type: 'button',
              className: 'ro-nav',
              title: t('nav.next'),
              'aria-label': t('nav.next'),
              disabled: safePage >= pageCount - 1,
              onClick: function () { go(1) }
            }, '\u203a') : null
          )
        )

        return h('div', { className: 'ro-panel', 'data-dsh-plugin': 'runtime-overview' },
          h('style', null, STYLE),
          header,
          h('div', { className: 'ro-rule' }),
          h('div', { className: 'ro-grid' }, cards)
        )
      }

      const disposers = []
      const add = function (disposer) { if (typeof disposer === 'function') disposers.push(disposer) }

      add(slots.inject('sidebar.panellist', function () {
        return slots.register({
          name: 'sidebar.panellist',
          id: PANEL_ID,
          order: PANEL_ORDER,
          label: function () { return translate(dictionaryFor(ctx), 'entry.label') }
        }, OverviewIcon)
      }))

      add(slots.inject('main', function () {
        return slots.register({ name: 'main', key: PANEL_ID }, OverviewPanel)
      }))

      add(slots.inject('conversation.session.header.actions', function () {
        return slots.register({
          name: 'conversation.session.header.actions',
          id: PANEL_ID + '-return',
          order: 40,
          label: function () { return translate(dictionaryFor(ctx), 'return.label') }
        }, ReturnAction)
      }))

      ctx.effect(function () {
        const onKeyDown = function (event) {
          if (!event.altKey || event.ctrlKey || event.metaKey) return
          if (event.key !== 'r' && event.key !== 'R') return
          event.preventDefault()
          backToOverview()
        }
        window.addEventListener('keydown', onKeyDown)
        return function () { window.removeEventListener('keydown', onKeyDown) }
      }, 'runtime-overview: Alt+R shortcut')

      ctx.effect(function () {
        return function () {
          for (const dispose of disposers.splice(0)) {
            try { dispose() } catch (error) { /* already disposed by the slot owner */ }
          }
        }
      }, 'runtime-overview: slots')
    }

    return { inject: ['slots'], apply: apply }
  }
})
