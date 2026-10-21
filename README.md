# 运行总览

DeepSeek Harness 的 Web GUI 插件。它把当前与最近需要的会话排成四宫格，每格约占面板四分之一，点卡片直接进入会话，标题栏的「总览」按钮或 `Alt+R` 可以回到这一页。

任务看板只显示它自己发起的执行，看不到已经存在的会话。这个插件直接读运行时的会话目录，所以手动开的会话、子智能体之外的其它会话都会自动出现，不需要任务看板配合。

## 功能

- 四宫格视图，每屏 4 个，超出自动分页。
- 会话按状态排序：需要你处理、运行中、已完成未查看，最后是其余会话。
- 运行中的会话实时显示状态点动画；已完成未查看和等待处理的会话保留在页面上，直到你进入看过。
- 子智能体会话不显示，避免网格被派生会话占满。
- 每张卡片显示最近一条用户输入、目标与待办进度，以及上下文占用、费用估算、累计 Token、运行时长或最近活动。
- 点击卡片进入会话；会话标题栏出现「总览」按钮，侧边栏也有「运行总览」入口，`Alt+R` 可随时返回。
- 属于任务看板执行的会话会标注「看板任务」并显示对应卡片标题。

## 数据来源

插件只读，不写会话数据。

| 数据 | 来源 |
| --- | --- |
| 会话列表、运行状态、标题、工作目录 | 客户端会话目录 `sessions.list` |
| 需要你处理、已完成未查看 | `ui-session` 的 `useSessionStatus` |
| 目标、待办、上下文占用、Token、最近输入、计费 Token 桶 | 会话投影 `goal`、`todos`、`contextPressure`、`tokenUsage`、`contextTimeline` |
| 看板任务标题 | 任务看板只读接口 `/api/task-board/state` |

费用不是从事件流重新累计的：它直接使用上下文洞察插件已经折叠好的计费 Token 桶，按 models.dev 的 DeepSeek 挂牌价折算，高峰原价、非高峰半价，人民币按 1 元等于 0.15 美元换算。价格表写在 `client.js` 的 `MODEL_PRICES` 里，遇到未收录的模型会显示「—」而不是编造数字。

## 安装

插件通过本地目录挂进 profile。先克隆仓库，再把它加到正在使用的 profile：

```sh
git clone https://github.com/sandwich-xz/dsh-session-dashboard.git
dsh plugin --profile <你的 profile> add link:$(pwd)/dsh-session-dashboard
```

Windows PowerShell 下把 `$(pwd)` 换成绝对路径。安装后如果页面没有立即出现「运行总览」，刷新一次 DSH 页面或重启 `dsh web`。

卸载：

```sh
dsh plugin --profile <你的 profile> remove @local/runtime-overview
```

## 兼容性

- 需要 DeepSeek Harness 0.2.0-rc.2 或更新版本。
- 费用与最近输入依赖已安装的 `dsh-context`；没有它时这些位置显示「—」，其余功能不受影响。
- 只用主题变量着色，跟随 DSH 的明暗主题和皮肤。

## 开发

插件是纯 JavaScript，没有构建步骤。

```sh
node --check client.js
node --check index.js
```

改了 `client.js` 后，DSH 的客户端热更新会重新加载插件；如果页面没有变化，刷新一次。

## 限制

- 运行时长从插件第一次观察到该会话运行时算起，页面刷新后通过 localStorage 续上，但插件安装前就已经在跑的会话只能从安装时刻算起。
- 费用是估算，只对 `MODEL_PRICES` 收录的模型生效，且不含未上报用量的请求。
- 子智能体刻意不显示。

## 隐私

没有遥测，不向任何服务上传数据。唯一的网络请求是可选的 `/api/task-board/state` 同源读取。

## 许可

MIT
