/**
 * 管理端鉴权接口，对接 `yiban-api` 的 `/api/v1/admin/auth/*`。
 *
 * - 登录/me 成功返回 `{id, email, display_name, role}`，并以 HttpOnly Cookie 维持会话。
 * - 退出返回 204，无响应体。
 * - 凭据错误 → 401；非管理员凭据 → 403。管理端没有公开注册接口。
 */

import { apiRequest } from '/@/utils/request';
import type { AdminIdentity, AdminLoginInput } from '/@/types/admin';

export function adminLogin(input: AdminLoginInput): Promise<AdminIdentity> {
	return apiRequest<AdminIdentity>('/admin/auth/login', { method: 'POST', body: input });
}

export function adminMe(): Promise<AdminIdentity> {
	return apiRequest<AdminIdentity>('/admin/auth/me');
}

export function adminLogout(): Promise<void> {
	return apiRequest<void>('/admin/auth/logout', { method: 'POST' });
}
