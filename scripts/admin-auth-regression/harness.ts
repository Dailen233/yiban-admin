/**
 * 无浏览器环境下驱动 store / composable 的最小运行环境。
 *
 * Vue 3.2 还没有 `app.runWithContext`，因此用一次 SSR 渲染进入真实的注入上下文，
 * 让 `useRouter()`、`useAdminAuthStore()` 拿到与浏览器一致的依赖，之后在 Node 侧驱动用例。
 * 只依赖工程已有的 vue / vue-router / pinia / @vue/server-renderer，不引入新依赖。
 */

import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';
import { createMemoryHistory, createRouter } from 'vue-router';
import type { Router } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import type { Pinia } from 'pinia';
import { useAdminAuthStore } from '/@/stores/adminAuth';
import { useAdminLogin } from '/@/composables/useAdminLogin';
import { useAdminLogout } from '/@/composables/useAdminLogout';

type AdminAuthStore = ReturnType<typeof useAdminAuthStore>;

const routes = [
	{ path: '/login', name: 'login', component: { render: () => null } },
	{ path: '/403', name: 'forbidden', component: { render: () => null } },
	{ path: '/', redirect: { name: 'overview' } },
	{ path: '/overview', name: 'overview', component: { render: () => null } },
];

export interface Harness {
	router: Router;
	pinia: Pinia;
	auth: AdminAuthStore;
	login: ReturnType<typeof useAdminLogin>;
	logout: ReturnType<typeof useAdminLogout>;
}

export async function createHarness(): Promise<Harness> {
	const pinia = createPinia();
	const router = createRouter({ history: createMemoryHistory(), routes });
	const captured: Partial<Harness> = {};

	const app = createSSRApp({
		setup() {
			// 在 setup 中获取注入依赖，捕获后即可在 Node 侧驱动这些对象
			captured.auth = useAdminAuthStore();
			captured.login = useAdminLogin();
			captured.logout = useAdminLogout();
			return () => null;
		},
	});
	app.use(pinia);
	app.use(router);
	setActivePinia(pinia);

	await router.push('/overview');
	await router.isReady();
	await renderToString(app);

	return {
		router,
		pinia,
		auth: captured.auth as AdminAuthStore,
		login: captured.login as ReturnType<typeof useAdminLogin>,
		logout: captured.logout as ReturnType<typeof useAdminLogout>,
	};
}
