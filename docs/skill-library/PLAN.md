# 技能库开发方案（PLAN）

> 状态：已讨论确认，开发基线
> 日期：2026-02-14
> 适用范围：`E:\Deepseek Harness` 工作站的技能生产、统一管理、检索式加载与前端管理 UI

---

## 1. 背景与目标

- 工作站长期积累、更新技能，技能库会增长到数十上百个，且可能在**同一次会话途中**被 CRUD（增删改）。
- 因此技能加载**不能**采用「一次性把全量技能标题摘要注入提示词」的方式，必须支持**召回 + 重排**的按需加载。
- 需要统一的管理路径存放技能，并在 DSH 前端提供技能管理 UI。

### 目标

1. 技能库真源路径确定，统一管理（结构化元数据、git 跟踪、生命周期）。
2. 检索式技能加载：按**当前轮场景**召回 top-K 技能，**只注入当前轮**，替代全量 catalog。
3. 前端技能管理 UI（本机插件热插拔），V0 只读浏览 + 召回调试，逐步扩展写操作。
4. **引用治理闭环**：agent 结构化输出引用的技能卡片 → 用户纠正 → 情景记忆 → 召回/重排越用越准。

### 技能定义共识（用户 2026-02-14 明确）

- **技能 = 抽象知识的实践手册**：抽象知识的定义/理解放在**知识库**（独立规划体系，基线见 `docs/knowledge-base/`），工作时只提供理解、不指导工作；**指导工作的就是技能库**。
  - 例：`正反馈的定义` → 知识库；`如何在设计中加入正反馈（一种技法/技能）` → 技能库。
- **技能形态**：长度短、数量多，每个技能写**一种**技法。
- **每个技能的两个召回依据**（召回/重排完全由它们驱动）：
  1. **使用场景提示**——与当前场景做匹配（`whenToUse` / `triggers`，含适合/不适合语义）；
  2. **摘要**——表达大致意思（`description`）。
- **注入语义**：每个技能**只注入当前轮的提示词，不加入会话上下文**；下一轮场景变了必须重新找技能（每轮 query 驱动动态召回）。
- **引用治理**：agent 查找/使用了技能时，回复需**结构化输出引用了哪些技能卡片**，便于用户纠正引用；纠正反馈沉淀为情景记忆，驱动召回/重排持续进化（不假设一上来就找得对）。

---

## 2. 现状机制还原（已确认的事实链）

### 2.1 技能存储与格式

- 真源目录：`E:\Deepseek Harness\.agents\skills\<技能名>\SKILL.md`（+ 可选 `references/` 子目录）。
- 技能名必须 kebab-case（`^[a-z0-9]+(?:-[a-z0-9]+)*$`）。
- 格式：YAML frontmatter + Markdown 正文。当前示例字段：`name` / `description` / `whenToUse` / `triggers` / `metadata` / `distilled-by`。
- 目录已被 git 跟踪（`workstation-git-governance` 技能明确：skills 属于工作站的沉淀智能，应入版本控制）。

### 2.2 DSH 技能体系（已核实，均位于 node_modules 的 pnpm 包）

| 包 | 职责 |
|---|---|
| `@deepseek-ai/dsh-skill` | 分层技能注册表 `ctx.skills`（cordis Service）：多 provider 合并、摘要/正文分离、按需 `get(name)`、digest/revision 缓存、`skills/change` 事件 |
| `@deepseek-ai/dsh-skill-filesystem` | 文件系统 provider：扫描 5 级根，Chokidar 实时监视，frontmatter 解析 |
| `@deepseek-ai/dsh-tool-skill` | 模型侧 `skill` 加载工具 + **catalog 注入**：`agent/pre-step` 钩子把全量摘要渲染为 `<system-reminder><available_skills>` 注入对话 |

**文件系统扫描根（rank 顺序）**：

| Rank | 来源 | 路径 |
|---|---|---|
| 100 | project-dsh | `<projectRoot>/.dsh/skills` |
| 200 | project-agents | `<projectRoot>/.agents/skills` ← **本方案真源** |
| 300 | custom | `Config.customSkillDirs`（可配置扩展根） |
| 400 | user-dsh | `<dshHome>/skills` |
| 500 | user-agents | `<agentsHome>/skills`（`$DSH_AGENTS_HOME`，restart-web.cmd 已设为 `E:\Deepseek Harness\.agents`） |

**已具备的能力**：
- 会话途中 CRUD 实时生效（Chokidar 监视 + catalog digest 变化 → 自动替换注入）。
- 正文按需加载（摘要/正文分离，模型通过 `skill` 工具 `get()`）。
- 每技能启停：frontmatter `disable-model-invocation` / `user-invocable`（内置策略校验）。
- `customSkillDirs` 可注册额外技能根（未来若独立库发布/开源的扩展点）。

### 2.3 现状痛点（本方案要解决的核心）

`dsh-tool-skill` 的 `agent/pre-step` 钩子调用 `ctx.skills.snapshot()` 拿到**全量**摘要，全量渲染 `<available_skills>` 注入。技能库增长后：
- 每回合全量摘要进上下文，KV cache 膨胀；
- 模型从长列表选技能困难，召回精度低。

→ 需在注入点前插入「按查询召回 top-K」层。

---

## 3. 架构总览

```
技能库真源（.agents/skills/<name>/SKILL.md，git 跟踪）
   │  chokidar 监视 + skills/change 事件
   ▼
【插件 dsh-skill-retrieval（server 端 cordis 服务）】
   ├─ 索引服务：扫描 → 提取结构化字段 → BM25 索引（+ 预留 embedding 槽位）→ 增量更新
   ├─ 召回服务：query → 硬匹配(triggers/name) + BM25 加权 → top-K
   └─ 重排：规则加权（status/version/related/最近使用）→ 有序结果
   ▼
【注入层：替换 dsh-tool-skill 的 pre-step 全量 snapshot】
   │  recall(query) 只注入 top-K 摘要（复用原 digest 机制：结果不变不重复注入）
   ▼
模型看到 top-K 摘要 → 命中则 skill 工具按需加载正文
```

---

## 4. 技能真源与结构化模型

### 4.1 真源

- **唯一真源**：`E:\Deepseek Harness\.agents\skills\`。
- UI、检索索引、蒸馏入库（dsh-distill）均直接读写该目录，零同步、零拷贝。
- git 跟踪，天然版本历史；`INDEX.md`（全库索引，人读 + 冷启动兜底）可选维护。

### 4.2 结构化 frontmatter schema（草案）

```yaml
name: kebab-case            # 必填，DSH 校验
description: 1-3 句触发描述  # 必填，召回/匹配核心
whenToUse: 何时使用          # 可选
triggers: [关键词, 别名]     # 召回重排硬信号（agent-reach 已在用）
tags: [分类标签]             # 发现/过滤/管理
category: 一级分类           # 可选
version: 0.1.0              # 可选，语义版本
status: active|draft|deprecated|archived   # 生命周期
related: [其他技能名]        # 技能间关联，用于召回扩展
provenance: {distilled-by, source-session, author}  # 来源溯源
metadata: {任意扩展}         # DSH 原生保留字段
```

- 启停仍用 DSH 原生字段：`disable-model-invocation: true`、`user-invocable: false`。

### 4.2.1 双召回依据（共识强化）

按技能定义共识，召回/重排**只**由两个字段驱动，UI 与索引都围绕它们设计：

| 字段 | 语义 | 在召回中的角色 |
|---|---|---|
| `whenToUse` + `triggers` | **使用场景提示**：该技能适合/不适合什么场景（可含正反例、关键词、别名） | 与当前场景匹配的主依据：triggers 硬匹配 + whenToUse BM25 加权 |
| `description` | **摘要**：表达技能大致意思 | 语义相似度打分（BM25；未来 embedding） |

技能正文（`SKILL.md` 正文）**不参与**召回打分，仅在命中后按需加载。技能整体保持**轻量**（短、单一技法、数量多）。

### 4.3 两类数据分离

| 数据 | 存放 | 说明 |
|---|---|---|
| 技能自描述字段（上表） | SKILL.md frontmatter | 随文件走、git 跟踪、DSH 解析 |
| 派生数据（BM25 token、usage 统计、索引时间戳、embedding） | 独立索引 `E:\Deepseek Harness\.dsh\storages\skill-index.json`（或 `.agents/skills/.index/`） | 不进 SKILL.md，避免每次使用产生 git diff |

### 4.4 ⚠️ 风险点（P0 必须验证）

`dsh-skill-filesystem` 文档仅声明解析 `name/description/whenToUse/metadata/disable-model-invocation/user-invocable`。**未知字段（triggers/tags/status…）是否被保留需实测**：

- 若保留 → schema 按 4.2 原样使用；
- 若被丢弃 → 管理字段统一收进 `metadata.*` 命名空间（DSH 明确支持开放对象），schema 语义不变。

---

## 5. 检索式加载设计（P1）

### 5.1 Query 构造

- 来源：`agent/pre-step` 钩子的 messages —— 最近一条用户消息 + 会话前几轮主题摘要。
- **每轮都重新召回**：query 随当前轮变化，即使技能库没变，召回结果也会随场景变化；无历史的首轮退化为「默认技能集 + 高优先级技能」的静态 top-K，不打断正常使用。

### 5.2 检索与重排（已确认：先本地 BM25 + 规则重排）

1. **硬匹配**（权重最高）：`triggers` 命中 / `name` 前缀匹配 / 用户显式点名。
2. **BM25 加权打分**：对 `whenToUse` / `description` / `tags` 字段加权（whenToUse 场景提示与 description 摘要为双主依据，见 §4.2.1）。
3. **规则重排**：
   - `status != archived`（archived 仅索引不召回）；
   - `version` 新者优先；
   - `related` 扩散（命中技能的相关技能加成）；
   - **情景记忆加成**（§5.6：相似场景下被用户确认过引用正确的技能加权，被纠正过的降权）。
4. 输出 top-K（默认 10，可配置；库规模 < K 时退化为全量）。

### 5.3 注入语义：每轮动态注入、本轮有效、不持久化（共识）

- **只注入当前轮**：每轮以本轮 query 召回 top-K 技能卡片（摘要级），注入本轮提示词。
- **不加入会话上下文**：注入内容不在会话历史中持久化累积——下一轮场景变了就整体替换为新一轮召回结果。
- **现状机制与差距**（`dsh-tool-skill` pre-step）：
  - ✅ 每步执行 + 结果变化时「移除旧注入消息 → 追加新注入」（filter+append 替换式），天然接近「本轮有效」；
  - ✅ 注入的是**摘要列表**（`- name: description`），正文按需 `get()`，技能正文永不进上下文；
  - ⚠️ 注入位置是 user message（`<system-reminder>` 形式）；若需严格「只在本轮提示词、零历史痕迹」，P1 验证改造成本（注入 system prompt 需 patch 系统提示词构建，可能更贴近语义）。
- **兜底入口**：系统提示词保留 `/skills` 全库浏览/检索入口，避免冷门技能被埋没。

### 5.4 实时性

- 文件 CRUD → chokidar / `skills/change` → 索引增量更新 → digest 变化 → 下回合自动替换 catalog（沿用现机制，不改 host）。

### 5.5 Embedding 升级路径（P3 预留）

- 检索接口预留 embedding 槽位：BM25 与向量分数融合；需选定 embedding 源（本地小模型 / API）后启用。

### 5.6 引用治理闭环（共识新增）

**目标**：agent 引用技能不假设一上来就正确 → 用户可纠正 → 沉淀情景记忆 → 召回/重排越用越准。

1. **结构化引用输出**：agent 在回复中声明使用了哪些技能卡片。
   - 形式待定（§10 决策点）：回复末尾 `[[skill:<name>]]` 标记 / 结构化 JSON 字段 / 专用消息类型。
   - 通过技能注入的提示词约定 + skill 工具调用路径双重保证（加载了技能就要声明）。
2. **反馈捕获**：
   - 用户在聊天区对引用做确认/纠正（如「这个不该用技能A，应该用技能B」）；
   - 技能库页提供对技能的点赞/点踩 + 场景标注。
3. **情景记忆存储**：`E:\Deepseek Harness\.dsh\storages\skill-usage-memory.json`
   - 样本：`{query/场景指纹, 召回列表, agent 引用列表, 用户反馈(确认/纠正/忽略), 时间}`；
   - 独立于技能文件（派生数据，见 §4.3），git 可选跟踪。
4. **反馈回灌重排**（§5.2 规则 3）：
   - 相似场景（query 指纹相近）下，被确认过的技能加权、被纠正过的降权/下压；
   - 纠正可进一步沉淀为**场景-技能正负例**，未来可驱动阈值/embedding 微调。

---

## 6. 前端技能管理 UI

**形态**：独立侧边栏「技能库」页（与 dsh-ssh / task-board 同级），本机 cordis.patch.yml 热插拔，经 `/skill-manager/*` 路由读写 `.agents/skills` 与索引。

### P0 · V0（只读浏览）

- 技能列表：卡片/表格，列 = name / description / tags / category / status / 来源 / git 状态徽标；搜索 + tags/status 筛选。
- 详情预览：frontmatter 结构化渲染（突出**使用场景提示**与**摘要**双召回字段）+ 正文 + references 树。
- **召回调试视图**：输入任意 query → 实时显示召回排序与各字段得分（调 BM25 权重/重排规则的必备工具）。
- **引用反馈视图**：展示 `skill-usage-memory.json` 的情景记忆样本；对单技能查看「被确认/被纠正」历史（治理数据可视化）。

### P2 · 写操作

- 新建（模板向导）/ 编辑（frontmatter 表单 + 正文编辑器）/ 删除（确认）/ 启停（写 `disable-model-invocation`）/ 蒸馏入库（对接 dsh-distill）。
- 引用反馈入口（聊天区纠正 + 技能页点赞/点踩，写入情景记忆）。

### P3 · 增强

- 使用统计、导出/导入（单技能 zip、全库备份）、embedding 向量检索、技能市场（可选）。

---

## 7. 插件技术形态

两个插件，复用 dsh-ssh / task-board 的成熟套路（cordis.patch.yml 热插拔 + profile node_modules symlink，不动 DSH 源码）：

| 插件 | 端 | 职责 |
|---|---|---|
| `dsh-skill-retrieval` | server | 索引 + 召回 + 重排（含情景记忆加权）+ pre-step 注入替换；引用治理（引用记录 + 反馈写入情景记忆）；暴露 `/skill-manager/*` 数据路由 |
| `dsh-client-ui-skill-manager` | client | 侧边栏入口 + 技能库页面（浏览/召回调试/引用反馈）；inject 依赖与 dsh-ssh 相同 |

---

## 8. 阶段路线图

| 阶段 | 内容 | 交付物 |
|---|---|---|
| **P0** | 技能库规范（schema 落地 + 风险点验证）；UI V0 只读浏览 + 召回调试视图 | 插件骨架 + 浏览页可打开 |
| **P1** | 检索内核：索引 + 召回 + 重排 + 每轮动态注入（top-K，本轮有效）；**引用输出约定**（结构化引用格式 + 提示词约定） | 全量 catalog → 每轮 top-K 召回注入；agent 回复带技能引用声明 |
| **P2** | UI 写操作：编辑/新建/删除/启停/蒸馏入库；**引用反馈闭环**（聊天区纠正 + 技能页反馈 → 情景记忆 → 重排加权生效） | 全生命周期管理闭环 + 治理闭环跑通 |
| **P3** | 统计、导入导出、embedding 升级、可选市场 | 增强能力 |

---

## 9. 决策记录

| 决策点 | 结论 |
|---|---|---|
| 技能定义 | 技能 = 抽象知识的实践手册（指导工作）；知识库管理解属于独立规划体系（基线见 `docs/knowledge-base/`） |
| 技能形态 | 短、数量多、单一技法；召回依据 = 使用场景提示（whenToUse/triggers）+ 摘要（description） |
| 注入语义 | 每轮动态召回、只注入当前轮、不进入会话上下文（P1 验证注入位置改造成本） |
| 引用治理 | agent 结构化输出引用技能卡片；反馈 → 情景记忆 → 重排加权（越用越准） |
| 真源路径 | 直接管 `.agents/skills/`（rank 200，git 跟踪，零同步）；技能结构化，多字段支持发现与管理规则 |
| 召回实现 | 先本地 BM25 + 规则重排（含情景记忆加成）；embedding 作为 P3 预留槽位 |
| UI 形态 | 独立侧边栏「技能库」页；V0 只读浏览 + 召回调试 + 引用反馈视图 |
| 部署方式 | 本机插件包直接挂载（cordis.patch.yml），跑通后再决定是否进 web-ui-all 全家桶 |

### 未决/待验证

- 未知 frontmatter 字段保留行为（§4.4，P0 实测）。
- `catalogDescriptionMaxLength` 当前默认值及全量 catalog 的实际体积基线（P0 记录）。
- 默认 top-K 值（先用 10，联调后按召回调试视图调优）。
- query 构造的具体取数范围（最近 N 条消息、是否含工具结果摘要）。
- **引用输出格式**（§5.6）：`[[skill:<name>]]` 标记 vs 结构化 JSON 字段 vs 专用消息类型（P1 定）。
- **注入位置**（§5.3）：user message 替换式（现状，改动小）vs system prompt 每轮重建（更贴合「只在本轮提示词」，改动大），P1 验证。
- **情景记忆生效粒度**：场景指纹怎么定义（query 关键词集合 / 向量 / 手动标注），P2 定。
