# 译伴管理端 · yiban-admin

译伴双语电子书生成系统的独立管理端，基于教师提供的 Vue Next Admin Template 起步项目开发。

[当前范围](#当前范围) · [仓库分工](#仓库分工) · [本地运行](#本地运行) · [开发流程](#开发流程) · [文档](#文档)

## 当前范围

截至 2026-10-22，已完成教师模板原样导入、本机构建验证、Gitee/GitHub 同步，以及 `master`、`develop` 分支初始化。首次提交为 [`9e633cd`](https://gitee.com/jin-xinfu/yiban-admin/commit/9e633cdc571232d8475894ae4531b1e9d98b44b9)。

首个真实里程碑的管理端范围：管理员独立登录与退出，只读查看任务列表、阶段、进度及失败信息，实际权限由服务端校验。完整用户管理、用量统计和举报审核属于后续里程碑。第三方登录按课堂说明属于加分项，后续单独评估。

### 已实现（feature/admin-account，2026-10-24）

管理员真实登录、身份恢复、路由保护与退出已接入 `yiban-api`：

| 能力 | 说明 |
|---|---|
| 登录 | `POST /api/v1/admin/auth/login`，凭据错误显示原因，非管理员账号明确拒绝 |
| 身份恢复 | 刷新后通过 `GET /api/v1/admin/auth/me` 恢复，并发去重，网络/503 保留为可重试状态 |
| 路由保护 | 未登录转登录页并带站内 `redirect`；管理员访问登录页转管理概览；无权限转 `/403` |
| 退出 | `POST /api/v1/admin/auth/logout`，失败保留身份且可重试，成功清理管理端状态 |
| 会话来源 | 服务端下发的 HttpOnly Cookie `yiban_admin_session`，前端不读写令牌，`localStorage`/`sessionStorage` 不保存任何身份数据 |

界面直接迁移自中央原型 `prototype/v4` 的 `admin-login.html/css` 与 `admin.html/css`（保留结构、配色、排版、品牌标识、间距、响应式与交互）。原型中的任务数量、举报、审核、运行统计与操作日志尚无真实接口，界面保留骨架并标记为「尚未接入」，不展示编造数据。

已解除教师模板在实际运行路径中的活动入口：教学登录、`token` 请求头与返回码、学生 CRUD、固定验证码、手机/扫码登录、教师用户信息与菜单取数，以及指向 `api.experiment.ncepu.edu.cn` 的接口配置与代理。

## 仓库分工

采用三个实现仓库和一个需求、设计与原型入口仓库。本地均放在 `~/projects/` 下，互为同级目录。

| 仓库 | 职责 | Gitee | GitHub |
|---|---|---|---|
| `bilingual-ebook-generator` | 需求、设计、历史原型、课程资料与项目导航 | [入口](https://gitee.com/jin-xinfu/bilingual-ebook-generator) | [镜像](https://github.com/Dailen233/bilingual-ebook-generator) |
| `yiban-web` | 用户端：上传、配置、任务、书库与双语阅读 | [主仓库](https://gitee.com/jin-xinfu/yiban-web) | [镜像](https://github.com/Dailen233/yiban-web) |
| `yiban-admin` | 管理端：管理员入口与运维查看 | [主仓库](https://gitee.com/jin-xinfu/yiban-admin) | [镜像](https://github.com/Dailen233/yiban-admin) |
| `yiban-api` | 共享后端：账号、权限、文件、任务、翻译、成果与下载 | [主仓库](https://gitee.com/jin-xinfu/yiban-api) | [镜像](https://github.com/Dailen233/yiban-api) |

当前 `yiban-web`、`yiban-api` 的远程空仓库已创建，起步代码尚未导入。Gitee 是开发与合并入口，GitHub 同步相同提交。校内 GitLab 留到最终提交阶段处理。

## 本地运行

本机已验证：Ubuntu 24.04.4、Node.js `v22.23.2`、npm `10.9.8`。初始化使用 npm 和现有 `package-lock.json`。

```bash
cd ~/projects/yiban-admin
npm ci --ignore-scripts --no-audit --no-fund
npm run build
```

2026-10-22 执行成功：安装 374 个包，构建转换 2110 个模块。该记录只证明模板可安装、可构建。

2026-10-24 接入真实管理员会话后再次执行成功，构建模块数降至 124（不再打包 Element Plus 与模板示例页面）。除构建外还执行了真实后端 + Playwright 浏览器验收，覆盖登录、刷新恢复、受保护页拦截、退出与退出后拦截、401/403、网络与 503 恢复失败、退出失败反馈、双端会话互不影响，以及桌面与 390px 窄屏布局。验收记录见 PingCode 对应任务，未配置 CI 时不把未建立的检查设为门禁。

开发服务器固定占用 **`http://localhost:5175`**（`strictPort`，端口冲突直接报错而非顺延），避免误占用户端 `5174` 与其他项目的 `5173`：

```bash
npm run dev      # 开发服务器 → http://localhost:5175/
npm run preview  # 预览已构建产物 → http://localhost:5175/
```

本机同时运行多个 Vite 项目时，开发服务器偶会因文件监视资源不足（`EMFILE`）退出；这种情况下改用 `npm run build && npm run preview` 提供预览，端口与访问地址不变。生产资源路径为 `/`，正式部署前按部署位置调整 `VITE_PUBLIC_PATH`。

### 接口配置现状

后端地址为 `VITE_API_BASE_URL`，默认 `http://localhost:8001`（`yiban-api` 本地环境）。已移除指向教师教学接口的配置与 Vite `/api` 代理，管理端只调用 `/api/v1/admin/auth/*`。

所有请求携带 Cookie（`withCredentials`），写请求额外携带 `X-Yiban-Request: 1`，并以 HTTP 状态码判断成败：401 未认证、403 无管理员权限、204 不解析响应体。`VITE_*` 是浏览器侧可见配置，不能保存翻译服务密钥、会话签名密钥等服务端秘密。

管理员账号在本地开发库中用 `yiban-api` 的既有命令创建，密码只在本机输入、不进入代码、命令行参数与日志：

```bash
cd ~/projects/yiban-api && uv run python -m scripts.create_admin
```

管理端没有公开注册接口；普通账号即使登录成功也会在后端被拒为无管理权限。

## 代码结构

| 位置 | 用途 |
|---|---|
| `src/views/login/`、`src/views/overview/`、`src/views/forbidden/`、`src/views/notFound/` | 登录、管理概览、无权限与未找到页面（界面迁移自 v4 原型） |
| `src/layout/admin/` | 管理端外壳：顶栏、窄屏抽屉与页面出口 |
| `src/config/adminNav.ts` | 管理端菜单，区分已接入与未接入入口 |
| `src/composables/` | 登录与退出的表单/请求编排（防重复提交、错误映射） |
| `src/stores/adminAuth.ts` | 管理员会话状态（含并发去重与会话版本保护） |
| `src/api/adminAuth.ts`、`src/types/admin.ts` | 管理员鉴权接口与类型 |
| `src/utils/request.ts` | 共享请求入口：凭据、`X-Yiban-Request`、HTTP 状态契约 |
| `src/styles/` | 设计令牌、共享样式与登录/概览分页色值覆盖（迁移自 v4） |
| `src/assets/fonts/` | 品牌字体「霞鹜文楷」及 OFL 许可（按原型实际引用迁入） |
| `src/router/guard.ts`、`src/router/index.ts` | 界面引导守卫与路由表 |
| `docs/` | 来源、原始说明及开发记录 |

目录中仍保留教师模板原有示例文件（如 `src/views/student/`、旧 `src/layout/navBars/`），它们不在当前运行链路中，后续按需处理。

前端路由和菜单控制用于界面引导，实际角色与私有文件内容访问权限由 `yiban-api` 校验。

## 开发流程

| 分支 | 用途 |
|---|---|
| `master` | 已验收稳定版本，默认分支并启用基础保护 |
| `develop` | 开发集成分支 |
| `feature/*`、`fix/*`、`docs/*` | 从 `develop` 创建的功能、修复、文档分支 |

变更在 Gitee 发起 PR 合入 `develop`；阶段验收后再通过 Gitee PR 将 `develop` 合入 `master`。拉取 Gitee 合并后的实际提交，再同步至 GitHub 对应分支，GitHub 不另行生成合并提交。

远程名：`origin` 指向 Gitee，`github` 指向 GitHub。单人开发由本人自查改动与验收结果，不要求另一人审批。尚未配置 CI，不将未建立的检查设为合并门禁。

保留原始起步提交。`node_modules/`、`dist/`、本地秘密配置不进入版本控制；任务与验收证据在 PingCode 留痕，任务编号按实际记录填写。

## 文档

- [CODEBUDDY.md](CODEBUDDY.md)：本仓范围与开发约束。
- [模板来源与基线记录](docs/starter-source.md)：来源、校验值、首次提交与验证结果。
- [教师原始 README](docs/upstream-README.md)：按原文保留的历史说明，当前操作以本 README 为准。
- [模板第三方服务说明](docs/third-party-services.md)：模板参考资料，采用前结合当前实现核对。
- [中央需求文档](https://gitee.com/jin-xinfu/bilingual-ebook-generator/blob/main/需求分析与设计文档说明.md)：§3.5 首个真实里程碑、§3.6 后续安排。

## 许可证

保留模板原有 [MIT LICENSE](LICENSE) 及版权声明。来源与译伴后续修改分开记录。
