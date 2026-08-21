# 知识库开发方案（PLAN）

> 状态：基于已确认体系说明书的开发基线  
> 日期：2026-02-16  
> 工作站：`E:\Deepseek Harness`  
> 体系说明书：[`KNOWLEDGE-BASE.md`](./KNOWLEDGE-BASE.md)

---

## 1. 目标、边界与完成定义

### 1.1 目标

建设本地、可追溯、可版本化、Obsidian-compatible 的知识库，作为 agent 的语义记忆。它让 agent 正确理解基础知识、用户长期工作语境和项目特化语义；实际执行仍由技能库负责。

首个可用版本必须能够：

1. 将 `knowledge/` 作为可直接用 Obsidian 打开的 Markdown/YAML Vault；
2. 保存并浏览基础知识、工作语境、项目知识三类文档与语义条目；
3. 导入外部 Markdown/纯文本资料，保存原件、manifest、来源与章节锚点；
4. 查询术语、概念、实体和来源片段，展示状态、authority、scope 与冲突；
5. 在用户明确解释未知术语后，直接沉淀 `verified + user-defined` 定义；
6. 根据当前会话/工作区/项目/领域自主消歧，无法可靠判定时澄清；
7. 在现有 Web GUI 中浏览、导入、审阅和治理知识；
8. 从 Git 跟踪真源重建索引和图数据。

### 1.2 非目标

- 不把知识库变成执行 runbook、命令库或技能库替代品；
- 不将 agent 推测、临场总结或外部资料自动升级为用户本地定义；
- 不在首期依赖独立图数据库、云同步或必须使用外部 embedding API；
- 不在导入时自动批量创建 `verified` 条目；
- 不让清洁或关系分析静默改写 Markdown/YAML 真源；
- 不保存凭据、密钥、令牌等敏感机密。

---

## 2. 已确认架构决策

| 主题 | 决策 |
|---|---|
| 与技能库边界 | KB 是语义记忆，理解“这是什么”；技能库是程序记忆，指导“怎样做” |
| 知识空间 | `foundations`、`shared-context`、`projects/<project-id>` 并列；项目特化不覆盖基础/工作语境定义 |
| 真源 | 文档骨架 + 原子语义条目 + 来源证据锚点；所有真源兼容 Obsidian Vault |
| 语义身份 | `id + kind + scope`；路径仅用于人类导航，不能替代 scope |
| 项目路径 | 项目文档和导入资料按项目路径组织；原子条目可按类型/空间组织但必须显式 scope |
| KG | 文档树、scope、relations、锚点和实体为可读真源；派生轻量图索引，不上独立图数据库 |
| 入库 | 外部导入；用户明确、可复用的会话定义或修订 |
| 会话写入 | 明确定义直接 `verified + user-defined`；暂定内容进 `draft` / Inbox；agent 推测不入库 |
| 检索 | Context Capsule → 候选召回 → scope 硬过滤 → authority/status 重排 → 高置信采用或澄清 |
| 清洁 | `kb_audit` 只读报告 → 用户审阅 → `kb_review` 仅执行选定 finding；不自动合并 |
| Git | 真源跟踪；分块、OCR、索引、缓存和派生图不跟踪、可重建 |

---

## 3. 数据与目录模型

```text
E:\Deepseek Harness\
├─ knowledge/                                      # Git 跟踪；Vault 真源
│  ├─ README.md
│  ├─ documents/
│  │  ├─ authored/
│  │  │  ├─ foundations/
│  │  │  ├─ shared-context/
│  │  │  └─ projects/<project-id>/
│  │  ├─ imported/
│  │  │  ├─ foundations/
│  │  │  ├─ shared-context/
│  │  │  └─ projects/<project-id>/
│  │  └─ manifests/
│  ├─ entries/
│  │  ├─ entities/projects/
│  │  ├─ concepts/{foundations,shared-context,projects/<project-id>}/
│  │  ├─ terms/{foundations,shared-context,projects/<project-id>}/
│  │  └─ taxonomies/
│  ├─ inbox/
│  └─ governance/                                  # 审计决定、抑制与复审规则（Git 跟踪）
│
└─ .dsh\storages\knowledge-base\                   # 不跟踪、可重建
   ├─ index/
   ├─ chunks/
   ├─ ocr/
   └─ cache/
```

`knowledge/` 中的原件、必要规范化副本、manifest、条目、关系、版本链、Inbox 与 governance 决定均为可迁移资产。实现时在 `.gitignore` 精确忽略 `.dsh/storages/knowledge-base/`，并用 `git status` 验证边界。

### 3.1 条目与文档 schema

原子条目是 Markdown + YAML frontmatter，至少具备：`id`、`name`、`kind`、`scope`、`status`、`authority`、时间、`sources`、`relations`。`scope.space` 必须是 `foundations`、`shared-context` 或 `projects`；`projects` 条目必须有 `scope.project`，基础和工作语境条目不应伪造项目归属。项目/系统/领域也是实体条目，以便 Context Capsule 映射可靠 scope。

文档 manifest 至少具备稳定 `documentId`、路径/来源、导入时间、作者/所有者（若已知）、版本/日期、格式、哈希、知识空间、适用范围、敏感性标记和解析状态；并可用受治理的 `documentRelations` 声明 `references`、`supplements`、`replaces`、`conflicts-with`、`belongs-to-project`。普通 Obsidian 链接只是候选，只有 manifest/条目中的带类型关系进入权威 KG。来源关系使用：

```yaml
relations:
  - type: sourced-from
    target: document:<documentId>#<stable-anchor>
```

稳定锚点重解析后若失效，必须保留映射或列为待修复 finding。

### 3.2 关系与状态

关系：`alias-of`、`broader-than`、`narrower-than`、`related-to`、`applies-to`、`sourced-from`、`commonly-confused-with`、`supersedes`、`conflicts-with`、`implemented-by-skill`。

状态：`draft`、`imported`、`verified`、`stale`、`superseded`、`disputed`。`draft` 和 `superseded` 不作为当前可靠定义；`stale`、`disputed`、`imported` 命中时必须展示限制。新/canonical 条目以 `supersedes` 指向旧条目，旧条目标为 `superseded`。

---

## 4. 插件与服务设计

知识库与技能库是同一 DSH/Cordis 宿主中的独立领域插件组，不做“记忆大一统”插件。

| 插件 | 端 | 职责 |
|---|---|---|
| `dsh-knowledge-base` | server | 真源/schema、导入、索引、轻量 KG、检索消歧、会话写入、审计、审核、`/knowledge-base/*` 与 `kb_*` 工具 |
| `dsh-client-ui-knowledge-base` | client | 侧边栏与概览/浏览/导入/详情/治理队列 |

服务端包内部按 source、import、index、graph、retrieval、definition、audit、review、tool、HTTP 模块组织；它们共享 schema、索引和一致性边界，首期不拆成多个可安装业务插件。文件 watcher 对 Obsidian 的人工编辑采用“变更后校验再索引”：YAML 半写/非法 schema/重复 ID/重命名迁移失败时保留最近有效索引快照、将问题送入治理队列并阻止受影响条目参与可靠检索；修复后自动 reconcile，绝不以损坏文件覆盖有效语义。

技能库仅通过窄契约协作：技能遇到业务术语时按需 `kb_get`；技能端使用 `metadata.knowledgeRefs` 指向知识，知识端使用 `implemented-by-skill` 指向技能，GUI 从这两种真源关系派生导航列表。KB 不负责技能注入和执行。

---

## 5. Agent 工具与检索协议

### 5.1 工具契约

| 工具 | 输入/输出摘要 | 写入规则 |
|---|---|---|
| `kb_search` | query + 推断/显式 scope；返回候选、状态、authority、来源、冲突、解释分数 | 只读 |
| `kb_get` | entry ID 或 document ID + anchor；返回完整条目或可追溯片段 | 只读 |
| `kb_import` | 文件/目录/文本与来源描述；保存原件/manifest，发起解析 | 需用户导入操作与敏感检查 |
| `kb_upsert_definition` | 用户原话、术语、scope、别名、来源、关系；查重/冲突/版本化 | 仅用户明确、可复用定义或修订 |
| `kb_create_draft` | 暂定表达或候选 | 仅 Inbox / `draft` |
| `kb_link` | 源、关系类型、目标、证据 | 校验关系、目标和溯源 |
| `kb_audit` | 只读扫描；返回 `CleanupReport` | 永不写入真源 |
| `kb_review` | 用户选定 finding ID、审核动作与 GUI approval token | token 必须绑定审计快照、finding 和拟议 diff；只能改已确认范围 |

### 5.2 Context Capsule、召回与重排

出现不明、歧义、内部特有或专业语境依赖的术语/实体时，构造 Context Capsule：

1. 用户本轮显式项目、知识空间、领域、系统、对象；
2. 当前任务/工作区可靠关联的项目；
3. 当前会话已确认且未失效的项目/主题锚点；
4. 最近实体、子系统、领域词；
5. 别名、上下位概念和一跳图邻居；
6. 默认全局语境与文本相似度。

候选来自名称/别名、同 scope 条目、文档/章节/片段、一跳邻居。先硬过滤与明确 scope 冲突的候选，再按下列顺序重排：

```text
用户显式查询范围
  > 查询意图（基础 / 工作语境 / 项目特化）
  > project / scope 一致性
  > verified + user-defined 权威性与状态
  > 实体 / 子系统一致性
  > 术语精确匹配
  > KG 邻近度
  > BM25（P3 可叠加向量）
```

首名高置信且显著领先时自主使用；候选 scope 不同且接近、仅有低权威材料、或证据不足时必须澄清。用户显式限定覆盖自动判断。

---

## 6. GUI 与核心流程

### 6.1 五个视图

| 视图 | 核心能力 |
|---|---|
| 概览 | 近期导入、会话定义、Inbox、冲突、过期与健康摘要 |
| 知识浏览 | 文档树/条目列表、基础/工作语境/项目空间、统一搜索与筛选 |
| 导入中心 | 文件/目录/文本、manifest、解析进度、候选、原文证据 |
| 条目详情 | 原话、定义、scope、别名、关系、版本链、来源、相关技能 |
| 治理队列 | Inbox、候选、冲突、过期、整理知识库、归档、受控删除 |

搜索必须清楚区分文档/条目和 imported/user-defined/draft/superseded/disputed 状态。

### 6.2 导入与会话写入

```text
导入：选择资料 → 敏感检查 → 原件/manifest → 本地解析/索引
     → 文档骨架、片段和候选证据 → 用户确认条目

会话：未知概念 → kb_search → 无可靠定义则澄清
     → 用户明确说明 → kb_upsert_definition（verified + user-defined）
```

导入不会批量创建 verified 条目。对“可能/暂时/我猜”等内容请求确认或写入 Inbox；agent 推测不入库。

### 6.3 整理知识库：审计优先

```text
点击整理知识库
  → kb_audit 只读快照、扫描真源/索引
  → CleanupReport：确定性问题 + 语义建议
  → 逐项对比、忽略、保留不同概念、稍后审阅或确认
  → kb_review 仅应用选定 finding
  → 重建索引、审计记录、Git diff 与回退
```

`CleanupReport` finding 必含稳定 ID、类别、严重度、置信度、对象、scope、来源证据、建议动作、影响范围与入站引用数。用户的“忽略”“保留不同概念”“稍后审阅”决定写入 `knowledge/governance/`，记录 finding signature、涉及 ID、理由、时间、审计快照和复审条件，用于可审查地抑制重复建议。

- **确定性问题**：schema/重复 ID、非法或悬空关系、scope 缺失、锚点/manifest 失效、替代链循环、完全重复导入、孤儿条目。
- **语义建议**：近重复、同义、关系合理性、潜在冲突、可能过期。相似不等于同一概念；跨项目同名默认不合并。

确认合并前必须选择 canonical 条目并预览完整拟议 diff。canonical 吸收来源、用户原话、aliases、去重关系和可迁移入站引用；旧条目为 `superseded`，由 canonical `supersedes` 指向。合并 verified 条目、改 scope/authority/关系语义、归档、删除均逐项确认。忽略/保留不同概念是可审查治理记录。

---

## 7. 分期实施与验收

### P0：Vault 文件模型、导入闭环与只读浏览

**交付**：`knowledge/` 目录、README、条目/manifest schema；server 扫描/校验；Markdown/纯文本导入和基础抽取；`kb_search`/`kb_get`/`kb_import` 最小版；侧边栏浏览、文档详情、条目详情、导入中心；Git ignore。

**验收**：导入后原件/manifest 属于跟踪真源；删除索引可重建；能显示 imported 文档片段与锚点；能浏览 verified 条目的 scope/关系/来源；GUI 在现有 `http://127.0.0.1:3080` 可用；`git status` 仅显示预期真源。

### P1：语境检索与直接定义捕获

**交付**：本地 BM25 与增量更新；Context Capsule；`kb_upsert_definition`/`kb_create_draft`/`kb_link`；scope 感知查重、冲突与版本链；会话协议；条目编辑与会话来源回溯。

**验收**：定义未知术语后可被后续检索；基础/工作语境/项目特化按查询意图和 scope 正确区分；同名不同 scope 不静默合并；修订可追溯；不把 stale/disputed/imported 伪装为确定定义；agent 推测不持久化。

### P1.5：只读知识健康报告

**交付**：只读 `kb_audit` 和 `CleanupReport` schema；确定性与语义建议检测；治理队列健康摘要、证据视图、忽略/保留/稍后审阅记录。

**验收**：整理按钮不改真源；每个 finding 具完整字段；不同项目同名不列为直接合并；确定性与语义建议清楚区分；`kb_audit` 无任何写入路径。

### P2：导入治理、冲突与关系闭环

**交付**：候选术语/关系及证据；Inbox、候选、冲突、stale 审核；文档重导入差异与锚点修复；关系浏览和派生图接口；受控 PDF/Office 抽取与可选本地 OCR。

**验收**：用户确认后候选才变 verified；从外部资料确认的条目为 `verified + imported-source`，用户明确本地定义时创建/更新 `verified + user-defined` 并保留来源关系；冲突、来源和范围可见并触发澄清；重导入可追踪锚点变化；过期、替代、归档和删除留审计记录。

### P2.5：受控整理与合并

**交付**：CleanupReport 整理计划、对比、canonical 选择、影响引用和 diff 预览；`kb_review` 的逐项变更；有限低风险批量确认；合并事务、审计、索引重建、回退入口。

**验收**：GUI 签发的 approval token 必须绑定当前审计快照、finding ID 与拟议 diff；快照过期、真源已变或 token 不匹配时拒绝 `kb_review`；变更前展示完整拟议 diff；相似不自动合并；合并迁移所有可迁移资料并保留 superseded 链；Git/审计可回退。

### P3：检索与可视化增强

可选：本地或经授权向量检索、关系图可视化、导入导出/备份、质量报告、死链检测、条目使用分析，以及基于知识提出候选技能建议（仍需审查）。

---

## 8. P0 验证事项与风险

| 事项 | 需验证内容 | 原则 |
|---|---|---|
| DSH 接入 | Cordis 工具、文件路由、侧边栏、bundle 入口 | 复用 dsh-ssh/task-board 模式，不改 DSH 核心 |
| UI 部署 | 源码变更何时真正出现在现有 GUI | 遵循 Web 插件集成验证，不把编辑当部署 |
| 文件权限 | 导入/写入真源及审批 | 最小权限，仅工作区 knowledge/ |
| 格式/OCR | 文本提取质量、依赖和本地执行 | 先稳定格式；不隐式上传外部服务 |
| 敏感信息 | 导入与会话可能含私密信息 | 检查、提示、确认；不存凭据；仓库私有 |
| 性能 | 库规模、索引、GUI 首屏 | 派生数据后台增量、可配置限制 |
| 检索准确性 | scope/同名异义/权威排序 | 规则 + BM25，所有不确定性可见 |
| Git 边界 | 真源与派生物分离 | 阶段性 `git status` 验证 |

开发 P0 前需实际确定：首期导入格式和大小上限、敏感信息检测和拒绝规则、PDF/Office/OCR 依赖、导入文件权限交互、Cordis 接入细节、ID/重命名/链接迁移策略、初始 BM25 权重与澄清阈值。
