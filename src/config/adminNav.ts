/**
 * 管理端导航条目。
 *
 * `connected: false` 表示原型中已出现、但后端尚无真实接口的入口。
 * 这些入口保留界面结构，渲染为禁用态并给出说明，不展示任何编造数据。
 */

export interface AdminNavItem {
	label: string;
	/** 有真实页面时的路由地址；未接入时为空 */
	to?: string;
	connected: boolean;
	hint?: string;
}

export const adminNavItems: AdminNavItem[] = [
	{ label: '概览', to: '/overview', connected: true },
	{ label: '任务 / 失败', connected: false, hint: '尚未接入真实接口' },
	{ label: '举报 / 审核', connected: false, hint: '尚未接入真实接口' },
];
