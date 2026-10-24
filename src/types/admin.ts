/**
 * 管理员身份类型与请求/响应契约，对应 `yiban-api` 的 `/api/v1/admin/auth/*`。
 * 登录与 me 成功直接返回身份对象，无 data 外层；退出返回 204，无响应体。
 */

export interface AdminIdentity {
	id: string;
	email: string;
	display_name: string;
	role: string;
}

export interface AdminLoginInput {
	email: string;
	password: string;
}
