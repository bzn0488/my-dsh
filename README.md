# DSH Personal Workstation

个人 DeepSeek Harness 工作站。目标是：**除 pnpm/Node 等底层工具外，所有数据与配置都封闭在 `E:\Deepseek Harness` 内**，本仓库对该目录做版本管理。**开箱即用**：新机器上运行 `setup.cmd` 一键重建（依赖 + 插件 + 补丁），记忆与历史随仓库走。

## 目录地图

| 路径 | 内容 | 是否入库 |
|---|---|---|
| `package.json` / `package-lock.json` / `.npmrc` | 宿主依赖（`@deepseek-ai/dsh`）与 npm 配置 | ✅ |
| `启动 Web UI.cmd` / `setup.cmd` | Web 启动器 / 新机器引导脚本 | ✅ |
| `.credentials.yaml.example` | 密钥模板（真实密钥在 `.dsh/.credentials.yaml`，忽略） | ✅ |
| `vendor/plugins/` | 本地化插件源码：`dshmarket` + `@linxin666` web-ui 全家桶（pnpm workspace 优先链接） | ✅ |
| `patches/` | distill 补丁（`distill-whitelist.patch`，pnpm `patchedDependencies` 安装时自动应用） | ✅ |
| `.dsh/` | DSH 数据家目录（`profiles`、`sessions`、`storages`、`settings.yaml`） | 配置 ✅ / 状态 ✅ |
| `.dsh/sessions/` | 持久化会话记录（zstd 日志）——**随仓库走** | ✅ |
| `.dsh/storages/` | 记忆/状态（workspace.json 等）——**随仓库走** | ✅ |
| `.agents/skills/` | 技能（手写 + distill 蒸馏产物）——**随仓库走** | ✅ |
| `.dsh/profiles/web/` | Web profile：`package.json`（插件清单）、`pnpm-workspace.yaml`（store/cache 固定 + vendor + 补丁）、`pnpm-lock.yaml`、`cordis.patch.yml` | ✅ |
| `.dsh/profiles/web/node_modules/` | 已安装插件（pnpm 可重建） | ❌ |
| `.pnpm-store/` / `.pnpm-cache/` / `.pnpm-state/` | pnpm 内容寻址仓库与缓存 | ❌ 可重建 |
| `node_modules/` | 宿主运行时依赖（npm ci 可重建） | ❌ 可重建 |

## 版本控制策略

- **入库**：全部配置、launcher、插件清单与锁文件、`vendor/plugins/`、`patches/`、会话记录（`.dsh/sessions/`）、记忆状态（`.dsh/storages/`）、技能（`.agents/skills/`）、`pet.json`。
- **忽略**：所有 `node_modules/`、pnpm store/cache、日志（`*.log`）、密钥（`.dsh/.credentials.yaml`）。
- **敏感信息**：会话与技能可能包含对话内容与工具输出，仓库必须保持私有（不要推送到公开 remote）。
- **会话归档阈值**：会话日志持续增长（每个约 1–2 MB）。当 `.dsh/sessions/` 总量超过 **100 MB** 时，将最老的会话移出仓库并（可选）用 `git filter-repo` 重写历史，控制 clone 体积。
- **插件更新**：`vendor/plugins/` 内的插件上游发布新版本后，把新版本拷入 vendor 并提交（或改回 registry 引用）；distill 更新后若补丁不再匹配，用 `git diff --no-index` 重新生成 `patches/distill-whitelist.patch`。

## 环境变量（用户级 + 启动脚本双保险）

- `DSH_HOME=E:\Deepseek Harness\.dsh` — 数据家目录
- `DSH_AGENTS_HOME=E:\Deepseek Harness\.agents` — 技能根目录（`dsh-skill-filesystem` 的 user-agents 根）

## pnpm 封闭（重要）

pnpm 11 的默认 store 位置是**运行时探测**的（从盘符根试硬链接），不同进程上下文（管理员/沙箱）会解析到不同位置，导致 `ERR_PNPM_UNEXPECTED_STORE`。已在 `pnpm-workspace.yaml` 固定：

```yaml
storeDir: E:/Deepseek Harness/.pnpm-store
cacheDir: E:/Deepseek Harness/.pnpm-cache
stateDir: E:/Deepseek Harness/.pnpm-state
```

注意：pnpm 11 **忽略项目 `.npmrc` 里的 store-dir**（安全设计），必须写在 `pnpm-workspace.yaml`。

## 常用操作

```sh
# 新机器/重装后一键重建（依赖 + 插件 + 补丁 + 密钥模板）
setup.cmd

# 启动 Web
启动 Web UI.cmd

# 安装/卸载/更新插件（profile 级）
dsh plugin --profile web add <npm包名|github:owner/repo>
dsh plugin --profile web remove <包名>

# 组合层变更（装插件）后必须重启 dsh web 进程才生效
```

## Skills 说明

技能（`.agents/skills/`）**已入库**：手写技能与 distill 自动蒸馏产物都随仓库版本化。distill 会在反省后更新/新增技能，产生新的提交——这是预期行为，提交前留意 diff 内容即可。
