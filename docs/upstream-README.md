# Vue Next Admin Template

<div align="center">

![Vue](https://img.shields.io/badge/vue-v3.2.37-brightgreen.svg)
![Element Plus](https://img.shields.io/badge/element--plus-v2.2.9-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-v4.8.3-blue.svg)
![Vite](https://img.shields.io/badge/vite-v2.9.14-yellow.svg)
![Pinia](https://img.shields.io/badge/pinia-v2.0.16-green.svg)
![License](https://img.shields.io/badge/license-MIT-success.svg)

</div>

## 📖 项目介绍

这是一个基于 Vue 3 + TypeScript + Vite 的现代化后台管理系统模板，是一个VUE项目的教学范例项目，为设计开发基于以上技术栈的管理后台。项目采用最新的前端技术栈，提供完整的学生信息 CRUD 操作、用户权限管理、多布局支持等功能。

这个项目基于源码仓库 [vue-next-admin](https://github.com/chuzhixin/vue-admin-beautiful) 进行了二次开发和定制修改，旨在提供一个更加简洁、易用的后台管理解决方案。

如果需要，可以参考源码仓库中的文档和代码，了解如何使用和定制这个项目。

### ✨ 核心特性

- 🚀 **最新技术栈**: Vue 3 + TypeScript + Vite + Element Plus + Pinia
- 📱 **响应式设计**: 完美适配桌面端、平板、手机等多设备
- 🎨 **多布局支持**: 经典布局、默认布局、横向布局、分栏布局
- 🌍 **国际化**: 支持中文、英文、繁体中文多语言切换
- 🔐 **权限管理**: 完整的用户权限控制系统
- 🎭 **主题定制**: 支持亮色/暗色主题，丰富的主题配置
- 📊 **数据可视化**: 集成 ECharts 图表组件
- 🔄 **路由缓存**: 智能的页面缓存机制
- 📝 **代码规范**: ESLint + Prettier 代码格式化

### 🎯 核心功能

- **学生信息管理**: 完整的学生信息增删改查功能
- **学院班级管理**: 支持学院和班级的层级管理
- **用户认证**: 登录、登出、权限验证
- **数据展示**: 多种数据展示模式和组件
- **布局配置**: 实时布局切换和主题定制
- **错误页面**: 404、401 等错误页面处理

## �️ 技术栈

### 核心框架
- **Vue 3.2.37** - 渐进式 JavaScript 框架
- **TypeScript 4.8.3** - 静态类型检查
- **Vite 2.9.14** - 现代化构建工具

### UI 组件库
- **Element Plus 2.2.9** - Vue 3 组件库
- **@element-plus/icons-vue** - Element Plus 图标库

### 状态管理
- **Pinia 2.0.16** - Vue 状态管理库
- **Vue Router 4.1.2** - 官方路由管理器

### 工具库
- **Axios 0.27.2** - HTTP 请求库
- **Vue I18n 9.1.10** - 国际化插件
- **ECharts 5.3.3** - 数据可视化图表
- **SCSS** - CSS 预处理器
- **Mitt** - 事件总线

## 📁 项目结构
```
vue-next-admin-template/
├── public/                     # 静态资源目录
│   └── favicon.ico            # 网站图标
├── src/                       # 源码目录
│   ├── api/                   # API 接口管理
│   │   ├── class/             # 班级相关 API
│   │   ├── college/           # 学院相关 API
│   │   ├── login/             # 登录相关 API
│   │   ├── menu/              # 菜单相关 API
│   │   └── students/          # 学生相关 API
│   ├── assets/                # 静态资源
│   │   ├── logo-mini.svg      # 小版本 Logo
│   │   └── login-icon-two.svg # 登录图标
│   ├── components/            # 全局组件
│   │   ├── auth/              # 权限组件
│   │   ├── cropper/           # 图片裁剪组件
│   │   ├── editor/            # 富文本编辑器
│   │   ├── iconSelector/      # 图标选择器
│   │   ├── noticeBar/         # 通知栏组件
│   │   └── svgIcon/           # SVG 图标组件
│   ├── i18n/                  # 国际化配置
│   │   ├── lang/              # 语言包
│   │   │   ├── en.ts          # 英文语言包
│   │   │   ├── zh-cn.ts       # 简体中文语言包
│   │   │   └── zh-tw.ts       # 繁体中文语言包
│   │   └── pages/             # 页面级国际化
│   ├── layout/                # 布局组件
│   │   ├── component/         # 布局子组件
│   │   │   ├── aside.vue      # 侧边栏
│   │   │   ├── header.vue     # 头部
│   │   │   └── main.vue       # 主内容区
│   │   ├── footer/            # 页脚组件
│   │   ├── lockScreen/        # 锁屏组件
│   │   ├── logo/              # Logo 组件
│   │   ├── main/              # 主布局模板
│   │   │   ├── classic.vue    # 经典布局
│   │   │   ├── columns.vue    # 分栏布局
│   │   │   ├── defaults.vue   # 默认布局
│   │   │   └── transverse.vue # 横向布局
│   │   ├── navBars/           # 导航栏相关
│   │   │   ├── breadcrumb/    # 面包屑导航
│   │   │   └── tagsView/      # 标签页视图
│   │   ├── navMenu/           # 导航菜单
│   │   └── routerView/        # 路由视图
│   ├── router/                # 路由配置
│   │   ├── backEnd.ts         # 后端路由控制
│   │   ├── frontEnd.ts        # 前端路由控制
│   │   ├── index.ts           # 路由主文件
│   │   └── route.ts           # 路由定义
│   ├── stores/                # Pinia 状态管理
│   │   ├── keepAliveNames.ts  # 缓存页面状态
│   │   ├── routesList.ts      # 路由列表状态
│   │   ├── tagsViewRoutes.ts  # 标签页路由状态
│   │   ├── themeConfig.ts     # 主题配置状态
│   │   ├── userInfo.ts        # 用户信息状态
│   │   └── interface/         # 状态类型定义
│   ├── theme/                 # 样式主题
│   │   ├── app.scss           # 应用主样式
│   │   ├── dark.scss          # 暗色主题
│   │   ├── element.scss       # Element Plus 样式覆盖
│   │   ├── common/            # 公共样式
│   │   ├── media/             # 媒体查询样式
│   │   └── mixins/            # SCSS 混入
│   ├── utils/                 # 工具函数
│   │   ├── arrayOperation.ts  # 数组操作工具
│   │   ├── authDirective.ts   # 权限指令
│   │   ├── authFunction.ts    # 权限函数
│   │   ├── commonFunction.ts  # 通用函数
│   │   ├── customDirective.ts # 自定义指令
│   │   ├── directive.ts       # 指令注册
│   │   ├── formatTime.ts      # 时间格式化
│   │   ├── formDataFormat.ts  # 表单数据格式化
│   │   ├── loading.ts         # 加载状态管理
│   │   ├── other.ts           # 其他工具
│   │   ├── request.ts         # HTTP 请求封装
│   │   ├── storage.ts         # 本地存储工具
│   │   ├── theme.ts           # 主题工具
│   │   ├── toolsValidate.ts   # 验证工具
│   │   └── wartermark.ts      # 水印工具
│   ├── views/                 # 页面视图
│   │   ├── error/             # 错误页面
│   │   ├── home/              # 首页
│   │   ├── login/             # 登录页面
│   │   ├── student/           # 学生管理页面
│   │   ├── studentModel2/     # 学生管理模式2
│   │   ├── studentModel3/     # 学生管理模式3
│   │   └── test/              # 测试页面
│   ├── App.vue                # 根组件
│   ├── main.ts                # 应用入口文件
│   └── axios.d.ts             # Axios 类型声明
├── index.html                 # HTML 模板
├── package.json               # 项目配置
├── vite.config.ts             # Vite 配置
├── tsconfig.json              # TypeScript 配置
├── README.md                  # 项目说明
└── LICENSE                    # 开源协议
```

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 14.0.0
- **npm**: >= 6.0.0 或 **yarn**: >= 1.22.0
- **现代浏览器**: Chrome >= 64, Firefox >= 78, Safari >= 12, Edge >= 79

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/your-repo/vue-next-admin-template.git
cd vue-next-admin-template
```

2. **安装依赖**
```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm (推荐)
pnpm install
```

3. **启动开发服务器**
```bash
# 使用 npm
npm run dev

# 或使用 yarn
yarn dev

# 或使用 pnpm
pnpm dev
```

4. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建项目

```bash
# 生产环境构建
npm run build

# 预览构建结果
npm run preview
```

## ⚠️ 常见问题

### 百度地图API错误

如果您在运行项目时遇到以下错误：
```
APP被您禁用啦。详情查看：http://lbsyun.baidu.com/apiconsole/key#
```

**解决方案：**
1. **不使用地图功能**（推荐）：错误已通过移除相关脚本解决
2. **使用地图功能**：需要申请有效的百度地图API密钥并在 `index.html` 中配置
3. **详细说明**：请查看 `docs/third-party-services.md` 文档

### 环境配置
复制 `.env.example` 为对应环境的配置文件并修改：
```bash
cp .env.example .env.development  # 开发环境
cp .env.example .env.production   # 生产环境
```

## 📋 功能特性

### 🔐 用户认证
- 用户登录/登出
- 权限验证和路由守卫
- Token 自动刷新

### 👥 学生信息管理
- **学生列表**: 支持分页、搜索、筛选
- **学生信息 CRUD**: 完整的增删改查操作
- **批量操作**: 支持批量删除、导出
- **多种视图模式**: 列表视图、卡片视图等

### 🏫 学院班级管理
- 学院信息管理
- 班级信息管理
- 层级关系维护

### 🎨 界面与主题
- **多布局支持**: 4种预设布局模式
- **主题切换**: 亮色/暗色主题
- **响应式设计**: 完美适配各种设备
- **个性化配置**: 实时预览配置效果

### 🌍 国际化
- 中文简体 (zh-cn)
- 英文 (en)
- 中文繁体 (zh-tw)

### 📊 数据可视化
- ECharts 图表集成
- 多种图表类型支持
- 响应式图表设计

## 🔧 配置说明

### 环境配置

项目支持多环境配置，在根目录创建对应的环境文件：

```bash
.env.development    # 开发环境
.env.production     # 生产环境
```
### 接口配置
  本范例项目，使用的接口地址为：'http://api.experiment.ncepu.edu.cn/api_1'
  如需修改，请修改：
   .env.development    # 开发环境
   .env.production     # 生产环境
   当中的VITE_API_URL项的值

### 主要配置项

```typescript
// src/stores/themeConfig.ts
interface ThemeConfig {
  layout: 'defaults' | 'classic' | 'transverse' | 'columns'
  theme: 'light' | 'dark'
  isTagsview: boolean
  isCollapse: boolean
  // ... 更多配置
}
```

## 🎯 核心功能说明

### 学生管理系统

本项目的核心功能是学生信息管理，包含以下特性：

1. **学生信息维护**
   - 基本信息录入和编辑
   - 头像上传和裁剪
   - 学院班级关联

2. **数据操作**
   - 实时搜索和筛选
   - 分页展示
   - 数据导入导出

3. **多种展示模式**
   - `src/views/student/` - 基础学生管理
   - `src/views/studentModel2/` - 增强版学生管理
   - `src/views/studentModel3/` - 扩展版学生管理

### API 接口设计

项目采用模块化的 API 设计：

```typescript
// 学生相关 API
src/api/students/
├── index.ts    # API 方法定义
└── type.ts     # 类型定义

// 学院相关 API  
src/api/college/
├── index.ts
└── type.ts

// 班级相关 API
src/api/class/
├── index.ts
└── type.ts
```

## 🔍 开发指南

### 添加新页面

1. 在 `src/views/` 下创建页面组件
2. 在 `src/router/route.ts` 中添加路由配置
3. 如需权限控制，在路由 meta 中添加权限信息

### 添加新的 API

1. 在 `src/api/` 下创建对应模块文件夹
2. 定义 TypeScript 类型
3. 实现 API 方法
4. 在页面中调用

### 主题定制

1. 修改 `src/theme/` 下的 SCSS 文件
2. 在 `src/stores/themeConfig.ts` 中添加新的主题配置
3. 通过布局设置面板实时预览效果

## 📱 浏览器支持

| Chrome | Firefox | Safari | Edge |
|--------|---------|--------|------|
| >= 64  | >= 78   | >= 12  | >= 79|

## � License

本项目基于 [MIT](LICENSE) 协议开源

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## � 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 [Issue](https://github.com/your-repo/vue-next-admin-template/issues)
- 发送邮件到 your-email@example.com

---

<div align="center">

**如果这个项目对你有帮助，请给它一个 ⭐ Star 支持一下！**

</div>
