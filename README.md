# 译伴管理端 · yiban-admin

译伴双语电子书生成系统的独立管理端，基于教师提供的 Vue Next Admin Template 起步项目开发。

[当前范围](#当前范围) · [仓库分工](#仓库分工) · [本地运行](#本地运行) · [开发流程](#开发流程) · [文档](#文档)

## 当前范围

截至 2026-10-22，已完成教师模板原样导入、本机构建验证、Gitee/GitHub 同步，以及 `master`、`develop` 分支初始化。首次提交为 [`9e633cd`](https://gitee.com/jin-xinfu/yiban-admin/commit/9e633cdc571232d8475894ae4531b1e9d98b44b9)。

当前源码仍是教师的学生管理示例，译伴管理业务尚未接入。模板的登录、演示角色和学生 CRUD 不代表译伴的真实鉴权、任务管理已经实现。

首个真实里程碑的管理端范围：管理员独立登录与退出，只读查看任务列表、阶段、进度及失败信息，实际权限由服务端校验。完整用户管理、用量统计和举报审核属于后续里程碑。第三方登录按课堂说明属于加分项，后续单独评估。

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

2026-10-22 执行成功：安装 374 个包，构建转换 2110 个模块。该记录只证明模板可安装、可构建；登录、真实 API、译伴业务与浏览器验收尚未完成。

需要启动开发服务器时运行 `npm run dev`。模板默认开发端口为 `8888`，通常访问 `http://localhost:8888/`，实际地址以终端输出为准。生产资源路径仍为模板的 `/vue-next-admin-preview/`，正式部署前按部署位置调整。

### 接口配置现状

`.env`、`.env.development` 和 `vite.config.ts` 中仍有教师教学接口 `http://api.experiment.ncepu.edu.cn/api_1`。联调前统一核对环境配置、`src/utils/request.ts` 与 Vite 的 `/api` 代理；使用绝对地址的请求不会经过该代理。本批保留配置，未调用教师登录或学生数据写入接口。

后续使用译伴自己的后端或明确标识的模拟接口，并在验收记录写清数据来源。`VITE_*` 是浏览器侧可见配置，不能保存翻译服务密钥、会话签名密钥等服务端秘密。

## 代码结构

| 位置 | 用途 |
|---|---|
| `src/views/` | 页面与交互，现有学生管理示例待后续适配 |
| `src/api/` | 按业务模块封装请求及请求、响应类型 |
| `src/utils/request.ts` | 共享请求、鉴权及错误处理适配入口 |
| `src/router/`、`src/stores/` | 路由与 Pinia 状态管理 |
| `src/components/`、`src/layout/` | 公共组件与管理端布局 |
| `src/theme/`、`src/i18n/` | 样式与国际化资源 |
| `docs/` | 来源、原始说明及开发记录 |

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
