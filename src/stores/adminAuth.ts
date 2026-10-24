/**
 * 管理员会话状态。
 *
 * 会话凭据保存在后端下发的 HttpOnly Cookie 中，本 store 只保存用于展示的身份，
 * 不读写任何令牌、不依赖浏览器持久化。
 *
 * 借鉴用户端已验收的会话版本保护：登录/退出成功后递增版本号（`markSessionInvalid` 也递增），
 * 恢复请求若在此期间被新的登录/退出覆盖，其返回的过期结果会被丢弃。
 */

import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { adminLogin, adminLogout, adminMe } from '/@/api/adminAuth';
import { isForbidden, isUnauthorized } from '/@/utils/request';
import type { AdminIdentity, AdminLoginInput } from '/@/types/admin';

/**
 * - `initializing`：身份尚未确认（恢复中或尚未开始）
 * - `authenticated`：me 成功，已确认管理员身份
 * - `unauthenticated`：me 返回 401，明确未登录
 * - `no-permission`：me 返回 403，已登录但无管理员权限，不展示管理内容
 * - `restore-error`：恢复遇到网络/服务异常，可重试，不当作未登录
 */
export type AdminAuthStatus = 'initializing' | 'authenticated' | 'unauthenticated' | 'no-permission' | 'restore-error';

export const useAdminAuthStore = defineStore('adminAuth', () => {
	const admin = ref<AdminIdentity | null>(null);
	const status = ref<AdminAuthStatus>('initializing');
	const restoreError = ref<string | null>(null);

	/** 并发恢复请求去重：进行中的恢复共享同一个 Promise。 */
	let restorePromise: Promise<void> | null = null;
	/** 会话版本号：登录/退出成功后递增，用于丢弃过期的 me 结果。 */
	let sessionVersion = 0;

	const isAuthenticated = computed(() => status.value === 'authenticated');
	const isInitializing = computed(() => status.value === 'initializing');
	/** 恢复失败的网络/服务错误，不作为“游客”处理，可重试。 */
	const hasRestoreFailure = computed(() => status.value === 'restore-error');

	async function doRestore(): Promise<void> {
		status.value = 'initializing';
		restoreError.value = null;
		// 重新确认期间身份属于未知状态，清空展示数据避免残留上一份身份
		admin.value = null;
		const version = sessionVersion;
		try {
			const me = await adminMe();
			if (version !== sessionVersion) return;
			admin.value = me;
			status.value = 'authenticated';
		} catch (err) {
			if (version !== sessionVersion) return;
			admin.value = null;
			if (isUnauthorized(err)) {
				status.value = 'unauthenticated';
			} else if (isForbidden(err)) {
				status.value = 'no-permission';
				restoreError.value = '当前账号没有管理员权限，请联系系统管理员';
			} else {
				status.value = 'restore-error';
				restoreError.value = (err as Error).message;
			}
		}
	}

	function restore(): Promise<void> {
		if (restorePromise) return restorePromise;
		restorePromise = doRestore().finally(() => {
			restorePromise = null;
		});
		return restorePromise;
	}

	/**
	 * 会话失效：清理身份并递增会话版本。
	 *
	 * 退出成功、以及退出时确认会话已经无效（401）都必须走这里，
	 * 让在此之前的恢复请求失效，避免旧结果写回身份。
	 */
	function markSessionInvalid(): void {
		sessionVersion += 1;
		admin.value = null;
		status.value = 'unauthenticated';
		restoreError.value = null;
	}

	async function login(input: AdminLoginInput): Promise<void> {
		const me = await adminLogin(input);
		sessionVersion += 1;
		admin.value = me;
		status.value = 'authenticated';
		restoreError.value = null;
	}

	async function logout(): Promise<void> {
		await adminLogout();
		markSessionInvalid();
	}

	/** 显示用角色文案。角色由后端返回，前端不推断默认角色。 */
	const roleLabel = computed(() => {
		if (!admin.value) return '';
		return admin.value.role === 'admin' ? '管理员' : admin.value.role;
	});

	return {
		admin,
		status,
		restoreError,
		isAuthenticated,
		isInitializing,
		hasRestoreFailure,
		roleLabel,
		restore,
		login,
		logout,
		markSessionInvalid,
	};
});
