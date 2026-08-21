# 知识库体系说明书

> 状态：已确认的体系与治理基线  
> 日期：2026-02-16  
> 工作站：`E:\Deepseek Harness`  
> 开发方案：[`PLAN.md`](./PLAN.md)

---

## 1. 定位：语义记忆，而非操作手册

知识库（KB）是本工作站的**语义 / 陈述性记忆**。它保存用户专业世界中的术语、概念、实体、定义、背景资料与关系，使 agent 能回答：

> **“用户此刻说的这个词、对象或约定，在其当前语境中究竟是什么意思？”**

知识库是有效专业沟通的前提，不是通用资料堆，也不默认指导操作。

| 系统 | 记忆类型 | 解决的问题 | 主要内容 |
|---|---|---|---|
| 知识库 | 语义 / 陈述性记忆 | 这是什么、在当前语境中表示什么 | 概念、术语、实体、资料、范围、来源、关系 |
| 技能库 | 程序性记忆 | 已理解任务后，怎样可靠完成工作 | 步骤、判断、检查项、边界、工具约束 |

```text
用户的专业表达
  → 知识库按需完成术语与对象消歧
  → 形成准确任务意图
  → 技能库按当前场景提供程序性指导
  → 具体执行与验证
```

知识库可为技能中的业务术语和边界按需提供解释，但不能在缺少技能时充当临场拼接的 runbook。稳定、可复用的做法应经审查进入 `.agents/skills/`。

---

## 2. 知识空间：基础、工作语境与项目特化

Vault 不是项目资料夹，而是一个本地 Wiki 兼容的语义空间。知识按**适用范围**分为三类，并可通过文档与条目交叉引用：

| 空间 | 回答的问题 | 例子 | 默认检索时机 |
|---|---|---|---|
| 基础知识 `foundations` | 某领域的一般概念或体系是什么 | 正反馈、体验、认知负荷、游戏数值 | 用户明确询问一般概念，或项目知识需要引用通用定义 |
| 工作语境 `shared-context` | 用户长期、稳定的工作术语和约定是什么意思 | “正反馈技法”的用户定义、命名约定 | 用户使用内部表达或工作方法名 |
| 项目知识 `projects` | 概念在某项目中怎样特化、受何约束 | 项目 A 的战斗技能、项目 B 的职业技能 | 当前工作区、会话或用户表达指向具体项目 |

三类不是互相覆盖的层级。项目特化说明“通用概念在此项目中如何采用、限制或重新定义”，不复制通用正文；工作语境定义优先表达用户自己的稳定用法，不会被外部理论静默覆盖。

例如：

```text
基础概念：正反馈
  ├─ 工作语境：正反馈技法（用户定义）
  ├─ 项目 A：战斗反馈中的正反馈约束
  └─ 项目 B：职业成长中的正反馈约束
```

---

## 3. 真源：Obsidian-compatible Vault

`knowledge/` 是唯一知识真源、可直接用 Obsidian 打开的 Vault。Obsidian 与 DSH 读写同一套 Markdown/YAML；不维护双向同步的第二份数据。

- **Obsidian**：面向人类的 Wiki 阅读、编辑、双链、Properties、搜索和图谱浏览；
- **DSH 知识库插件**：面向 agent 的 scope 消歧、来源/状态治理、工具写入、审计和可重建索引；
- 普通 Markdown / Obsidian 链接是关联线索，不能自动成为带权威语义的 `relations`。

### 3.1 三种相连的知识形态

1. **文档骨架**：完整资料、标题层级、叙事、分类与 Wiki 导航；保留体系上下文。
2. **原子语义条目**：需被稳定理解、精确引用、处理别名/范围/冲突/版本的术语、概念和实体。
3. **证据锚点**：条目回溯到文档章节/段落或用户会话的原始定义。

不机械地将全文切成卡片。只有有稳定定义、清晰边界、跨资料复用、或需要语义治理的内容才成为原子条目；其余保留在文档中供全文检索与阅读。

### 3.2 推荐目录

```text
knowledge/                                      # Git 跟踪；Obsidian Vault 根
├─ README.md                                    # 首页、导航、维护约定
├─ documents/                                   # 完整 Wiki / 原始资料
│  ├─ authored/
│  │  ├─ foundations/                           # 跨项目基础知识体系
│  │  ├─ shared-context/                        # 用户工作术语、约定、方法语境
│  │  └─ projects/<project-id>/                 # 项目知识骨架与入口 README
│  ├─ imported/
│  │  ├─ foundations/
│  │  ├─ shared-context/
│  │  └─ projects/<project-id>/                 # 外部资料按其知识空间归档
│  └─ manifests/                                # documentId、来源、版本、解析配置
├─ entries/                                     # 原子语义条目
│  ├─ entities/projects/                        # 项目作为可检索语境节点
│  ├─ concepts/foundations/
│  ├─ concepts/shared-context/
│  ├─ concepts/projects/<project-id>/
│  ├─ terms/foundations/
│  ├─ terms/shared-context/
│  ├─ terms/projects/<project-id>/
│  └─ taxonomies/                               # 受控词表和分类法
├─ raw/                                         # 用户投放的待处理外部原文件；未进入检索
├─ inbox/                                       # 暂定会话捕获和待审导入候选
└─ governance/                                  # Git 跟踪：审计决定与抑制规则

.dsh/storages/knowledge-base/                   # 不跟踪、可重建
├─ index/                                       # 全文 / BM25 / 可选向量索引
├─ chunks/                                      # 解析文本与锚点映射
├─ ocr/                                         # OCR 中间结果
└─ cache/                                       # 缩略图、查询缓存、图索引
```

路径帮助人类浏览；语义身份由 `id + kind + scope` 决定，路径不能替代 scope。项目资料按项目路径组织；共享和基础概念不被项目目录锁死。用户可把大量原文档直接放入 `knowledge/raw/`；它们只作为待处理收件箱，不参与 agent 检索。用户在 GUI 确认处理后，支持的文件移动至 `documents/imported/`、生成 manifest 并成为可检索的 `imported` 文档；失败或未支持文件保留在 raw。

### 3.3 Git 边界

文档原件/必要规范化副本、manifest、条目、关系、版本链、Inbox 与 `governance/` 审计决定是工作站资产，必须跟踪。索引、分块、OCR 和缓存是派生物，不跟踪且必须能从真源重建。若规范化抽取文本是唯一可读材料或用户要求审阅，才将其作为文档真源跟踪。

---

## 4. 语义条目、关系与生命周期

### 4.1 最小条目模型

```yaml
---
id: project-a-combat-skill
name: 技能
kind: concept                         # term | concept | entity | taxonomy
aliases: [战斗技能]
scope:
  space: projects                    # foundations | shared-context | projects；必填
  project: game-project-a            # 仅 projects 空间必填
  domain: gameplay
  subsystem: combat
status: verified                      # draft | imported | verified | stale | superseded | disputed
authority: user-defined               # user-defined | imported-source | derived
createdAt: 2026-02-16T00:00:00Z
updatedAt: 2026-02-16T00:00:00Z
sources:
  - type: conversation
    session: <session-id>
    statedBy: user
    capturedAt: 2026-02-16T00:00:00Z
relations:
  - type: narrower-than
    target: combat-ability
  - type: applies-to
    target: game-project-a
  - type: commonly-confused-with
    target: project-b-role-skill
  - type: implemented-by-skill
    target: game-balance-cooldown-tuning
---
```

条目正文至少说明：它是什么、何时/何范围适用、它不是什么（适用时）、为何可信、关联什么。用户原话与会话来源必须保留；agent 派生标题、别名和摘要必须标明其派生性。

### 4.2 文档关系与轻量 KG

不引入独立图数据库作为真源。文档树、`scope`、带类型的条目关系、带类型的文档关系、来源锚点和项目实体共同组成轻量 KG；服务从这些可读、可 Git 审查的真源增量生成可重建图索引和可视化数据。

每份 manifest 可声明受治理的文档关系：`references`、`supplements`、`replaces`、`conflicts-with`、`belongs-to-project`。普通 Obsidian 链接仅是候选；只有 manifest/条目中的带类型关系才进入权威 KG。

首期关系：

| 类型 | 含义 |
|---|---|
| `alias-of` | 同义、别名或缩写归一 |
| `broader-than` / `narrower-than` | 上下位概念 |
| `related-to` | 有关联但不宜强分类 |
| `applies-to` | 适用的项目、系统、领域或范围 |
| `sourced-from` | 文档及稳定锚点来源 |
| `commonly-confused-with` | 同名异义或常见混淆 |
| `supersedes` | 当前 / canonical 条目替代目标旧条目 |
| `conflicts-with` | 重叠范围中待裁决的冲突 |
| `implemented-by-skill` | 相关程序技能；不复制步骤 |

技能端的唯一反向引用字段是 `metadata.knowledgeRefs`；知识端的唯一反向引用是 `relations: [{ type: implemented-by-skill, target: <skill-name> }]`。不使用 `relatedSkills` 作为真源字段；GUI 如需列表应从上述关系派生。

### 4.3 状态与历史

| 状态 | 语义与检索处理 |
|---|---|
| `draft` | 暂定捕获或候选；不作为可靠定义 |
| `imported` | 外部来源材料；可检索并显示来源，不自动等于本地定义 |
| `verified` | 当前已确认定义；同 scope 内优先 |
| `stale` | 曾有效但可能过时；命中时必须提示 |
| `superseded` | 被替代；默认不用于当前解释，但允许追溯 |
| `disputed` | 重叠范围内未裁决冲突；必须展示冲突并澄清 |

修订或合并不抹除历史。机器级不变量是：canonical 条目声明 `relations: [{ type: supersedes, target: <old-id> }]`；旧条目 `status: superseded`；旧条目不得反向创建同类 `supersedes` 边。撤销或改选 canonical 时须经新的审核 finding：移除旧 canonical 的边、恢复旧条目为 `verified`（或其适当状态）、迁移引用并重新生成审计记录。删除只在用户明确要求且没有需保留的来源或关系时进行；默认使用替代、过期或归档状态。

---

## 5. 入库与治理

### 5.1 外部文档导入

```text
用户选择文件 / 目录 / 文本
  → 敏感信息检查与确认
  → 保存原件或必要规范化副本 + manifest
  → 本地解析、可选 OCR、分块和索引
  → 展示文档骨架、片段、术语/关系候选及原文证据
  → 用户确认后才创建或更新 verified 语义条目
```

导入文档本身保持 `imported` 来源性质，不能自动覆盖本地定义。用户从带证据的导入材料确认某概念时，可创建 `verified + imported-source` 条目；用户随后明确给出本地定义、适用范围或修订时，创建/更新 `verified + user-defined` 条目并保留两者关系，不静默改写外部来源。冲突或重复保留来源并显式呈现。导入时至少记录标题/文件名、来源说明、导入时间、作者/所有者（如已知）、版本/日期、范围和片段锚点。

### 5.2 会话定义捕获

当 agent 无法可靠理解一个术语、命名方法或对象时，先检索 KB；无可靠命中或有冲突则澄清。用户随后给出明确、可复用的定义或修订时，agent 可直接调用 `kb_upsert_definition` 创建/更新 `verified + user-defined` 条目，无需逐次请求保存许可。

写入前必须查找既有条目，记录原话、scope、例外、别名、来源和关系；修订保留版本链；agent 推测不得入库。含“可能”“暂时”“我猜”等不确定表达时，先澄清或进入 `draft` / Inbox。

### 5.3 用户可见治理

所有知识必须可查看、编辑、替代、归档、删除和导出。来源、状态、权威性、冲突和派生性必须可见；敏感凭据不得因导入或会话捕获而进入库。

---

## 6. 自主语境检索与消歧

agent 自主判断语境，但不静默武断选择。每次遇到不明、歧义、内部特有或专业语境依赖的词/实体时，构造 `Context Capsule`：

1. 用户本轮显式的项目、领域、系统、对象；
2. 当前任务或工作区可靠关联的项目元数据；
3. 会话中已确认且未被话题切换推翻的锚点；
4. 近期实体、子系统与领域词；
5. 条目别名、上下位概念和一跳 KG 邻居；
6. 默认全局语境与文本相似度。

用户显式限定始终覆盖自动判断。

### 6.1 召回与重排

1. **候选召回**：`name` / `aliases` 精确匹配、同 scope 条目、文档/章节/片段、命中节点一跳邻居；首期字段加权 BM25，后续可融合本地或经授权的向量检索。
2. **硬过滤**：排除与明确项目、scope、实体或子系统冲突的候选；`draft`、`superseded` 不作为当前可靠定义；`stale`、`disputed`、仅 `imported` 保留风险标记。
3. **重排顺序**：用户显式查询范围 > 当前查询意图（基础/工作语境/项目特化） > project/scope 一致性 > `verified + user-defined` 权威性与状态 > 实体/子系统一致性 > 术语精确度 > KG 邻近度 > BM25/向量相似度。
4. **结果判定**：首名高置信且明显领先时可自主使用；候选 scope 不同且接近、只有低权威材料或证据不足时，展示候选与理由并请求澄清。

因此：问“正反馈是什么”优先基础知识；问“项目 A 的正反馈”优先项目 A 特化；问“正反馈技法”优先工作语境的用户定义。当前工作区属于项目 A 不能把项目 A 的体验目标误当作“体验”的一般定义。

---

## 7. GUI、工具与整理

### 7.1 GUI

独立侧边栏「知识库」包含：

| 视图 | 主要能力 |
|---|---|
| 概览 | 最近导入、会话定义、Inbox、冲突、过期与健康摘要 |
| 知识浏览 | 文档树与条目列表；按空间、kind、scope、状态、来源筛选；统一搜索 |
| 导入中心 | 文件/目录/文本导入、manifest、解析进度、候选和原文证据 |
| 条目详情 | 原话、定义、别名、范围、关系、版本链、文档证据、相关技能 |
| 治理队列 | Inbox、候选、冲突、过期、整理知识库、归档与受控删除 |

搜索结果必须区分文档与条目，以及 `imported`、用户定义、草稿、已替代和冲突状态。

### 7.2 Agent 工具

| 工具 | 用途 |
|---|---|
| `kb_search` / `kb_get` | 按语境检索并读取条目、文档或证据 |
| `kb_import` | 按用户操作导入文件、目录或文本 |
| `kb_upsert_definition` | 写入用户明确的定义/修订，含查重与版本链 |
| `kb_create_draft` | 保存暂定表达和候选至 Inbox |
| `kb_link` | 创建可审查、带类型的关系 |
| `kb_audit` | 只读扫描冗余与质量问题，返回 `CleanupReport` |
| `kb_review` | 仅应用用户确认的审核或整理 finding；必须携带 GUI 签发的 approval token |

知识工具只用于理解与沉淀语义；实际工作仍使用技能库或专门任务工具。

### 7.3 整理知识库：review-first

「整理知识库」不是自动清库：

```text
kb_audit 只读快照与扫描
  → CleanupReport（证据、scope、来源、置信度、影响范围）
  → 用户比较、忽略、保留不同概念、稍后审阅或确认
  → kb_review 仅执行被确认 finding
  → 重建索引、展示 Git diff、保留审计和回退路径
```

- **确定性发现**：schema/重复 ID、非法或悬空关系、scope 缺失、锚点或 manifest 失效、替代链循环、完全重复导入、孤儿条目；真源修复仍须确认。
- **语义建议**：近重复、同义、关系合理性、潜在冲突和可能过期。仅提出候选，绝不自动合并或建立权威关系。
- 每个 finding 有稳定 ID、类别、严重度、置信度、涉及对象、scope、证据、建议动作和影响引用。
- 相似度综合 scope、名称/别名、定义、共同来源、关系邻居和写入语境；scope/authority 差异与 `commonly-confused-with` 是强反证。跨项目同名概念默认不合并。
- 合并、scope/authority/关系语义变更、归档和删除必须逐项确认。canonical 条目吸收来源、别名、去重关系和可迁移引用；旧条目为 `superseded`，由 canonical 条目 `supersedes` 指向。所有变动可通过 Git 与审计记录回退。
- “忽略”“保留为不同概念”“稍后审阅”写入 `knowledge/governance/`，至少记录 finding signature、涉及 ID、用户决定、理由、时间、审计快照和复审条件；它们随 Git 跟踪并抑制同一建议重复出现。
- `kb_review` 必须持有 GUI 在用户确认时签发、绑定审计快照、finding ID 与拟议 diff 的一次性 approval token；快照过期、文件已变或 token 不匹配时拒绝写入，agent 不能自行声称已获确认。

---

## 8. 设计边界

- 首期不依赖独立图数据库、云同步或外部 embedding API；
- 不隐藏不确定性，不把外部材料或 agent 推断伪装成用户定义；
- 不让自动清洁改变 Markdown/YAML 真源；
- 不使用知识库替代技能库；
- 真源随 Git 迁移，派生索引可重建。
