/**
 * 管理端路由守卫。
 *
 * 守卫只做界面引导，真实管理员身份与权限始终由 `yiban-api` 校验：
 * - 首次导航等待身份恢复完成（并发共享同一个 Promise，只请求一次 me）。
 * - 受保护页面仅在「明确未登录」时跳登录页；恢复失败（网络/503）放行，
 *   由页面渲染可重试的提示，不误判为游客、不产生跳转循环。
 * - 已确认无管理权限（403）时转无权限页，停止展示管理内容。
 * - 已登录管理员访问登录页直接转管理概览。
 */

import type { NavigationGuard } from 'vue-router';
import { useAdminAuthStore } from '/@/stores/adminAuth';

export const authGuard: NavigationGuard = async (to) => {
	const auth = useAdminAuthStore();

	if (auth.isInitializing) {
		await auth.restore();
	}

	if (to.meta.requiresAuth) {
		if (auth.status === 'unauthenticated') {
			return { name: 'login', query: { redirect: to.fullPath } };
		}
		if (auth.status === 'no-permission') {
			return { name: 'forbidden' };
		}
		// authenticated 与 restore-error 都放行：后者由页面给出可重试状态
		return true;
	}

	if (to.name === 'login' && auth.isAuthenticated) {
		return { name: 'overview' };
	}

	return true;
};
