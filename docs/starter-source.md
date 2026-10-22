# 管理端起步项目来源与基线记录

记录日期：2026-10-22，用于区分教师模板与译伴后续修改。

## 来源

| 项目 | 记录 |
|---|---|
| 教师资料 | 《软件工程实践指南》“3-产品形态与技术选型 / 4 选择一个起步项目开始” |
| 教师仓库 | https://gitee.com/ncepu-bj/vue-next-admin-template |
| 压缩包 | `vue-next-admin-template-master.zip` |
| 包内根目录 | `vue-next-admin-template-master/` |
| SHA-256 | `d53077c428c9e86007d260746025464eb0ec86455e226e48a2addbffbc631fdf` |
| 原始说明 | [upstream-README.md](upstream-README.md)，逐字节保留导入时的根 README |
| 许可证 | 根目录 [LICENSE](../LICENSE)，保留 MIT 许可及版权声明 |

压缩包不含 `.git/`，因此记录来源 URL、压缩包散列和本项目首次提交，不把本项目提交号当成教师上游提交号。模板转引的原始项目来源见原始 README、`package.json` 与 LICENSE，本记录不重新推断作者关系。

原始 README 的标题、功能描述和链接保留原貌，相对路径按模板原目录语境理解；其功能声明不构成译伴验收结论，当前操作以根目录 README 为准。

## 首次导入

| 项目 | 记录 |
|---|---|
| 仓库与本地目录 | `yiban-admin`；`~/projects/yiban-admin` |
| 首次提交 | `9e633cdc571232d8475894ae4531b1e9d98b44b9` |
| 提交说明 | `chore: 导入教师管理端起步模板` |
| 基线 Git tree | `5f14b2073586cfa5d1857650c5be29a2f8ab779c` |
| 跟踪文件数 | 152 |
| Gitee / origin | `git@gitee-course:jin-xinfu/yiban-admin.git` |
| GitHub / github | `git@github.com:Dailen233/yiban-admin.git` |

首次提交保留源码、配置、依赖清单、锁文件、README 和 LICENSE，未加入译伴业务改造。`master`、`develop` 初次推送到两端时均指向该提交，后续改动采用独立提交。

## 基线版本

从导入时的 `package-lock.json` 核对：Vue 3.2.37、TypeScript 4.8.3、Vite 2.9.14、Element Plus 2.2.9、Pinia 2.0.16、Vue Router 4.1.2、Axios 0.27.2。它们是起步版本，不表述为“当前最新版”。

初始化使用 npm 与 `package-lock.json`。同时附带的 `pnpm-lock.yaml` 本批原样保留；包管理器统一、依赖升级另开改动并验证。

## 本机验证记录

依据：用户在 2026-10-22 提供的终端结果。

| 检查 | 实际结果 |
|---|---|
| 环境 | Ubuntu 24.04.4；Node.js v22.23.2；npm 10.9.8 |
| 压缩包校验 | 与上述 SHA-256 一致 |
| `npm ci --ignore-scripts --no-audit --no-fund` | 成功，安装 374 个包 |
| `npm run build` | 成功，转换 2110 个模块并生成 `dist/` |
| 分支推送 | Gitee/GitHub 的 `master`、`develop` 均推送成功 |
| 本地状态 | `develop` 跟踪 `origin/develop`，工作区干净 |

这证明模板可安装、可构建、可追溯，尚未验证真实管理员登录、教学 API、译伴任务数据、浏览器兼容、真实权限或线上管理端部署。

## 后续适配

学生、学院、班级与演示角色属于模板参考。后续按译伴需求替换页面、鉴权与接口适配；原 API 地址、返回码、Token 字段不直接成为译伴契约。

首版管理端仅管理员独立登录及任务、失败信息的只读查看。本批仅修订说明与协作约定，未改源码、配置、依赖、LICENSE 或现有第三方服务文档。
