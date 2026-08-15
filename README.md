# DSH Personal Workstation

个人 DeepSeek Harness 工作站。目标是：**除 pnpm/Node 等底层工具外，所有数据与配置都封闭在 `E:\Deepseek Harness` 内**，本仓库对该目录做版本管理。

## 目录地图

| 路径 | 内容 | 是否入库 |
|---|---|---|
| `package.json` / `package-lock.json` / `.npmrc` | 宿主依赖（`@deepseek-ai/dsh`）与 pnpm 配置 | ✅ |
| `启动 Web UI.cmd` | Web 启动器（设置 DSH_HOME / DSH_AGENTS_HOME） | ✅ |
| `.dsh/` | DSH 数据家目录（`profiles`、`sessions`、`storages`、`settings.yaml`） | 配置 ✅ / 状态 ❌ |
| `.dsh/profiles/web/` | Web profile：`package.json`（插件清单）、`pnpm-workspace.yaml`（store/cache 固定）、`pnpm-lock.yaml`、`cordis.patch.yml` | ✅ |
| `.dsh/profiles/web/node_modules/` | 已安装插件（dshmarket、@loserfox/distill…） | ❌ pnpm 可重建 |
| `.pnpm-store/` / `.pnpm-cache/` / `.pnpm-state/` | pnpm 内容寻址仓库与缓存 | ❌ 可重建 |
| `.agents/skills/` | 技能目录（agent-reach 等 + distill 自动蒸馏产物） | ❌ 默认忽略 |
| `node_modules/` | 宿主运行时依赖 | ❌ 可重建 |

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
# 启动 Web
启动 Web UI.cmd

# 安装/卸载/更新插件（profile 级）
dsh plugin --profile web add <npm包名|github:owner/repo>
dsh plugin --profile web remove <包名>

# 组合层变更（装插件）后必须重启 dsh web 进程才生效
```

## Skills 入库策略

`.agents/skills/` 默认忽略：distill 会自动蒸馏技能，全部入库会造成噪音。想要版本化时：

```sh
git add -f .agents/skills/<name>/
```

或调整 `.gitignore` 保留整个目录（同时接受蒸馏产物进入提交历史）。
