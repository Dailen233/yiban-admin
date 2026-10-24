/**
 * 管理端路由：真实管理员会话由后端 Cookie 维持，路由表不再从教师菜单接口取数，
 * 也不再根据前端角色过滤；菜单入口见 `src/config/adminNav.ts`。
 */

import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { authGuard } from '/@/router/guard';

/**
 * 路由表
 * @description 全部路由在此显式声明，不需要也在浏览器里缓存路由数据
 */
const routes: RouteRecordRaw[] = [
	{
		path: '/login',
		name: 'login',
		component: () => import('/@/views/login/index.vue'),
		meta: { requiresAuth: false, title: '管理员登录' },
	},
	{
		path: '/403',
		name: 'forbidden',
		component: () => import('/@/views/forbidden/index.vue'),
		meta: { requiresAuth: false, title: '无管理权限' },
	},
	{
		path: '/',
		component: () => import('/@/layout/admin/AdminLayout.vue'),
		meta: { requiresAuth: true },
		children: [
			{
				// 显式保留 /overview 路径，保证深链、刷新与登录后的 redirect 都能稳定命中
				path: 'overview',
				name: 'overview',
				component: () => import('/@/views/overview/index.vue'),
				meta: { title: '管理概览' },
			},
			{
				path: '',
				redirect: { name: 'overview' },
			},
		],
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'notFound',
		component: () => import('/@/views/notFound/index.vue'),
		meta: { title: '页面不存在' },
	},
];

export const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeEach(authGuard);

router.afterEach((to) => {
	const title = to.meta.title ? `译伴管理端 · ${to.meta.title}` : '译伴管理端';
	document.title = title;
	NProgress.done();
});

export default router;
