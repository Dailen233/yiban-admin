/**
 * 管理员退出。
 *
 * - 成功清理管理端身份并跳转登录页；失败保留登录态并给出可重试提示，不把失败显示为成功。
 * - 只调用管理端 logout，不触碰用户端会话。
 * - 身份与会话版本统一由 store 维护，本层不直接改写身份状态。
 */

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminAuthStore } from '/@/stores/adminAuth';
import { isServiceError, toApiError } from '/@/utils/request';

export function useAdminLogout() {
	const auth = useAdminAuthStore();
	const router = useRouter();

	const pending = ref(false);
	const error = ref<string | null>(null);

	async function logout(): Promise<void> {
		if (pending.value) return;
		pending.value = true;
		error.value = null;
		try {
			await auth.logout();
			await router.push({ name: 'login' });
		} catch (err) {
			// 401 说明会话已无效：按已退出处理，避免卡在“退出失败”的假状态。
			// 走 store 的统一入口，顺便让在途的恢复请求失效。
			if (toApiError(err).status === 401) {
				auth.markSessionInvalid();
				await router.push({ name: 'login' });
				return;
			}
			error.value = isServiceError(err) ? toApiError(err).message : '退出失败，请稍后重试';
		} finally {
			pending.value = false;
		}
	}

	return { pending, error, logout };
}
