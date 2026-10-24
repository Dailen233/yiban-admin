/**
 * 管理员登录。
 *
 * - 表单内的错误映射：401 → 凭据错误，403 → 无管理员权限，网络/5xx → 可重试提示。
 * - 提交期间禁止重复提交。
 * - 错误只展示文案，不回显密码，也不落地任何令牌。
 */

import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminAuthStore } from '/@/stores/adminAuth';
import { isForbidden, isServiceError, isUnauthorized, toApiError } from '/@/utils/request';
import type { AdminLoginInput } from '/@/types/admin';

/** 只接受站内安全目标：单个 `/` 开头、不以 `//` 或协议开头。 */
export function isSafeRedirect(target: unknown): target is string {
	if (typeof target !== 'string' || target === '') return false;
	if (target.startsWith('//')) return false;
	if (!target.startsWith('/')) return false;
	return !target.includes('\\');
}

export function useAdminLogin() {
	const auth = useAdminAuthStore();
	const router = useRouter();
	const route = useRoute();

	const email = ref('');
	const password = ref('');
	const pending = ref(false);
	const error = ref<string | null>(null);

	const canSubmit = computed(() => !pending.value && email.value.trim() !== '' && password.value !== '');

	function resolveRedirect(): string {
		const target = route.query.redirect;
		return isSafeRedirect(target) ? target : '/';
	}

	function messageFor(err: unknown): string {
		if (isUnauthorized(err)) return '邮箱或密码不正确';
		if (isForbidden(err)) return '该账号没有管理员权限，无法进入管理端';
		if (isServiceError(err)) return toApiError(err).message;
		return '登录失败，请稍后重试';
	}

	async function submit(): Promise<void> {
		if (pending.value) return;
		pending.value = true;
		error.value = null;
		const input: AdminLoginInput = {
			// 邮箱按后端约定去除首尾空格并统一小写（与后端 validator 保持一致）
			email: email.value.trim().toLowerCase(),
			// 密码原样提交，不做 trim/大小写转换
			password: password.value,
		};
		try {
			await auth.login(input);
			const redirect = resolveRedirect();
			// 登录成功后立刻丢弃内存里的明文口令，不做任何持久化
			password.value = '';
			await router.push(redirect);
		} catch (err) {
			error.value = messageFor(err);
		} finally {
			pending.value = false;
		}
	}

	return { email, password, pending, error, canSubmit, submit };
}
