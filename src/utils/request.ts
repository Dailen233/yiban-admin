/**
 * 管理端统一请求入口（对接 yiban-api）。
 *
 * - 所有请求携带 Cookie（`withCredentials`），管理员会话 `yiban_admin_session` 为 HttpOnly，
 *   前端不读取、不落地任何令牌。
 * - 写请求（非 GET）携带 `X-Yiban-Request: 1`；Origin 由浏览器随跨域请求自动发送。
 * - 以 HTTP 状态码判断鉴权与错误类型，不把响应体中的业务 `code` 当作 HTTP 状态。
 * - 204 无响应体，不做任何解析。
 * - 5xx 使用安全通用提示，不展示后端调试异常原文；网络失败归为同一类可重试错误。
 */

import axios, { AxiosError, AxiosInstance } from 'axios';

const DEFAULT_API_BASE_URL = 'http://localhost:8001';

export class ApiError extends Error {
	/** HTTP 状态码；网络失败/无响应时为 0。 */
	status: number;
	/** 响应体中的业务 code（仅诊断用，不作鉴权依据）。 */
	code?: number;
	data?: unknown;

	constructor(message: string, status: number, code?: number, data?: unknown) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.code = code;
		this.data = data;
	}
}

interface ErrorBody {
	code?: number;
	message?: string;
	data?: unknown;
}

interface ApiRequestOptions {
	method?: 'GET' | 'POST';
	body?: unknown;
}

export const apiBaseUrl: string = (import.meta.env.VITE_API_BASE_URL as string | undefined) || DEFAULT_API_BASE_URL;

/**
 * 底层 axios 实例。
 * 模板遗留的示例请求模块（`src/api/class`、`src/api/college`、`src/api/students`）仍在直接复用它，
 * 因此保留导出；它们不在管理端运行链路中，新的译伴请求一律走 `apiRequest`。
 */
const service: AxiosInstance = axios.create({
	baseURL: `${apiBaseUrl.replace(/\/$/, '')}/api/v1`,
	timeout: 20000,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true,
});

service.interceptors.request.use((config) => {
	const method = (config.method || 'get').toLowerCase();
	if (method !== 'get') {
		(config.headers as Record<string, string>)['X-Yiban-Request'] = '1';
	}
	return config;
});

function errorMessage(payload: ErrorBody | null, status: number): string {
	if (status >= 500) return '服务暂时不可用，请稍后重试';
	if (status === 422) return '提交的数据不合法，请检查后重试';
	if (payload && typeof payload.message === 'string' && payload.message) return payload.message;
	return '请求失败，请稍后重试';
}

/** 未认证（401）：会话缺失/失效，明确表示未登录。 */
export function isUnauthorized(err: unknown): boolean {
	return err instanceof ApiError && err.status === 401;
}

/** 已认证但非管理员（403）：停展示管理内容。 */
export function isForbidden(err: unknown): boolean {
	return err instanceof ApiError && err.status === 403;
}

/** 服务异常（网络失败或 5xx）：可重试，不能当作“未登录”。 */
export function isServiceError(err: unknown): boolean {
	return err instanceof ApiError && (err.status === 0 || err.status >= 500);
}

export function toApiError(err: unknown): ApiError {
	if (err instanceof ApiError) return err;
	if (err instanceof AxiosError) {
		const status = err.response?.status ?? 0;
		const payload = (err.response?.data ?? null) as ErrorBody | null;
		// 跨域被拦截、后端未启动等情况没有 response，统一按可重试的网络错误处理
		if (status === 0) return new ApiError('无法连接服务器，请检查网络后重试', 0);
		return new ApiError(errorMessage(payload, status), status, payload?.code, payload?.data);
	}
	return new ApiError('请求失败，请稍后重试', 0);
}

/**
 * 发起管理端接口请求。
 * @param path 以 `/` 开头的接口路径，会自动拼接 `/api/v1`
 * @returns 成功返回响应体；非 2xx 抛 `ApiError`
 */
export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
	const { method = 'GET', body } = options;
	try {
		const response = await service.request<T>({
			url: path,
			method,
			data: body,
		});
		if (response.status === 204) return undefined as T;
		return response.data;
	} catch (err) {
		throw toApiError(err);
	}
}

export default service;
