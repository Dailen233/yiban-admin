// 路由 meta 类型补充。
// `requiresAuth` 仅供路由守卫做界面引导；真实管理员权限始终由 `yiban-api` 校验。

import 'vue-router';

declare module 'vue-router' {
	// 这里是 declaration merging：类型名不会被直接引用，禁用未使用检查
	// eslint-disable-next-line no-unused-vars
	interface RouteMeta {
		/** 是否需要已确认的管理员身份才能进入 */
		requiresAuth?: boolean;
		/** 浏览器标签标题后缀 */
		title?: string;
	}
}
