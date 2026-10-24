/**
 * 管理员会话回归验证的可控后端替身。
 *
 * 用例通过 `mock` 决定每次请求的行为（延迟解决、401、500、204 等），
 * 由 esbuild 在打包时替换到 `/@/api/adminAuth` 的位置，避免改动源码结构。
 */
/* eslint-disable no-unused-vars -- 函数类型签名里的形参名只用于说明参数含义 */

import type { AdminIdentity, AdminLoginInput } from '/@/types/admin';

/** 按发生顺序记录的调用序列，用于验证请求次数与去重。 */
export const calls: string[] = [];

type MeHandler = () => Promise<AdminIdentity>;
type LoginHandler = (input: AdminLoginInput) => Promise<AdminIdentity>;
type LogoutHandler = () => Promise<void>;

const notConfigured = (name: string) => () => Promise.reject(new Error(`用例未配置 ${name} 行为`));

export const mock: {
	me: MeHandler;
	login: LoginHandler;
	logout: LogoutHandler;
} = {
	me: notConfigured('me') as MeHandler,
	login: notConfigured('login') as LoginHandler,
	logout: () => Promise.resolve(),
};

export function resetMocks(): void {
	calls.length = 0;
	mock.me = notConfigured('me') as MeHandler;
	mock.login = notConfigured('login') as LoginHandler;
	mock.logout = () => Promise.resolve();
}

export function adminMe(): Promise<AdminIdentity> {
	calls.push('me');
	return mock.me();
}

export function adminLogin(input: AdminLoginInput): Promise<AdminIdentity> {
	calls.push('login');
	return mock.login(input);
}

export function adminLogout(): Promise<void> {
	calls.push('logout');
	return mock.logout();
}
