/**
 * 管理员会话回归用例。
 *
 * 覆盖上一轮验收发现的两类问题：
 * 1. 会话版本保护：退出（204 成功与 401 已失效）必须让在途的 me 结果作废。
 * 2. 过期 me 不能覆盖之后成功的登录身份。
 *
 * 另外附带恢复去重与各失败分支的回归，全部使用可控 Promise，不依赖真实后端与路由守卫。
 */
/* eslint-disable no-unused-vars -- 函数类型签名里的形参名只用于说明参数含义 */

import { ApiError } from '/@/utils/request';
import type { AdminIdentity } from '/@/types/admin';
import { createHarness } from './harness';
import { calls, mock, resetMocks } from './mockApi';

interface Deferred<T> {
	promise: Promise<T>;
	resolve: (value: T) => void;
	reject: (reason: unknown) => void;
}

function deferred<T>(): Deferred<T> {
	let resolve!: (value: T) => void;
	let reject!: (reason: unknown) => void;
	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});
	return { promise, resolve, reject };
}

/** 让在途的微任务（store 内的 await 续体）全部执行完 */
function flush(): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, 0));
}

function identity(id: number, email: string): AdminIdentity {
	return { id, email, display_name: `验收管理员${id}`, role: 'admin' };
}

function expect(condition: boolean, message: string): void {
	if (!condition) throw new Error(message);
}

async function caseLogoutInvalidatesInFlightRestore(): Promise<void> {
	resetMocks();
	const harness = await createHarness();
	const stale = identity(1, 'stale-admin@example.com');
	const pendingMe = deferred<AdminIdentity>();
	mock.me = () => pendingMe.promise;

	const restoring = harness.auth.restore();
	mock.logout = () => Promise.reject(new ApiError('未认证', 401));

	await harness.logout.logout();
	expect(harness.auth.status === 'unauthenticated', '退出返回 401 后应为未登录');
	expect(harness.auth.admin === null, '退出返回 401 后身份应为空');
	expect(harness.router.currentRoute.value.name === 'login', '退出返回 401 后应跳转登录页');
	expect(harness.logout.error.value === null, '401 不应显示为退出失败');

	// 旧 me 迟到并返回成功，必须被会话版本保护丢弃
	pendingMe.resolve(stale);
	await flush();
	await restoring;
	expect(harness.auth.status === 'unauthenticated', '迟到的成功 me 不能把状态改回已登录');
	expect(harness.auth.admin === null, '迟到的成功 me 不能写回身份');
}

async function caseLogout204InvalidatesInFlightRestore(): Promise<void> {
	resetMocks();
	const harness = await createHarness();
	const stale = identity(2, 'late-admin@example.com');
	const pendingMe = deferred<AdminIdentity>();
	mock.me = () => pendingMe.promise;

	const restoring = harness.auth.restore();
	mock.logout = () => Promise.resolve(); // 204

	await harness.logout.logout();
	expect(harness.auth.status === 'unauthenticated', '退出 204 后应为未登录');
	expect(harness.auth.admin === null, '退出 204 后身份应为空');

	pendingMe.resolve(stale);
	await flush();
	await restoring;
	expect(harness.auth.status === 'unauthenticated', '退出 204 后迟到的 me 不能写回登录态');
	expect(harness.auth.admin === null, '退出 204 后迟到的 me 不能写回身份');
}

async function caseStaleMeFailureKeepsNewLogin(): Promise<void> {
	resetMocks();
	const harness = await createHarness();
	const pendingMe = deferred<AdminIdentity>();
	mock.me = () => pendingMe.promise;

	const restoring = harness.auth.restore();

	const fresh = identity(3, 'fresh-admin@example.com');
	mock.login = () => Promise.resolve(fresh);
	harness.login.email.value = 'fresh-admin@example.com';
	harness.login.password.value = 'secret';
	await harness.login.submit();

	expect(harness.auth.status === 'authenticated', '新登录应成功');
	expect(harness.auth.admin?.email === fresh.email, '新登录身份应生效');

	// 旧 me 之后失败（401），不能把已确认的身份清掉
	pendingMe.reject(new ApiError('未认证', 401));
	await flush();
	await restoring;
	expect(harness.auth.status === 'authenticated', '旧 me 失败不能覆盖新登录状态');
	expect(harness.auth.admin?.email === fresh.email, '旧 me 失败不能覆盖新登录身份');
}

async function caseStaleMeSuccessKeepsNewLogin(): Promise<void> {
	resetMocks();
	const harness = await createHarness();
	const pendingMe = deferred<AdminIdentity>();
	mock.me = () => pendingMe.promise;

	const restoring = harness.auth.restore();

	const fresh = identity(4, 'current-admin@example.com');
	mock.login = () => Promise.resolve(fresh);
	harness.login.email.value = 'current-admin@example.com';
	harness.login.password.value = 'secret';
	await harness.login.submit();

	// 旧 me 之后返回另一份身份，同样不能覆盖新登录结果
	pendingMe.resolve(identity(9, 'previous-admin@example.com'));
	await flush();
	await restoring;
	expect(harness.auth.admin?.email === fresh.email, '旧 me 的成功结果不能覆盖新登录身份');
	expect(harness.auth.status === 'authenticated', '旧 me 的成功结果不能推翻新登录状态');
}

async function caseConcurrentRestoreDeduplicated(): Promise<void> {
	resetMocks();
	const harness = await createHarness();
	const me = identity(5, 'restore-admin@example.com');
	mock.me = () => Promise.resolve(me);

	const first = harness.auth.restore();
	const second = harness.auth.restore();
	// 可观测的去重结果：并发发起后只会有一次 me 请求。
	// Pinia 开发模式会给 action 套一层 Promise，因此不比较返回的 Promise 是否同一个对象。
	expect(calls.filter((name) => name === 'me').length === 1, '并发恢复期间只应请求一次 me');
	await Promise.all([first, second]);
	expect(calls.filter((name) => name === 'me').length === 1, '并发恢复全程只应请求一次 me');
	expect(harness.auth.status === 'authenticated', '并发恢复成功后应为已登录');
	expect(harness.auth.admin?.email === me.email, '并发恢复应写入正确的身份');
}

async function caseLogoutServiceErrorKeepsIdentity(): Promise<void> {
	resetMocks();
	const harness = await createHarness();
	const me = identity(6, 'online-admin@example.com');
	mock.me = () => Promise.resolve(me);
	await harness.auth.restore();
	expect(harness.auth.status === 'authenticated', '前置条件：应已登录');

	mock.logout = () => Promise.reject(new ApiError('服务暂时不可用，请稍后重试', 500));
	await harness.logout.logout();

	expect(harness.auth.status === 'authenticated', '退出失败应保留登录状态');
	expect(harness.auth.admin?.email === me.email, '退出失败应保留身份');
	expect(harness.router.currentRoute.value.name === 'overview', '退出失败不应跳转登录页');
	expect(!!harness.logout.error.value, '退出失败应给出可见错误');
}

async function caseRestoreFailureStates(): Promise<void> {
	resetMocks();
	const harness = await createHarness();
	mock.me = () => Promise.reject(new ApiError('未认证', 401));
	await harness.auth.restore();
	expect(harness.auth.status === 'unauthenticated', 'me 401 应为未登录');
	expect(harness.auth.admin === null, 'me 401 不应保留身份');

	await createHarness().then(async (fresh) => {
		mock.me = () => Promise.reject(new ApiError('需要管理员权限', 403));
		await fresh.auth.restore();
		expect(fresh.auth.status === 'no-permission', 'me 403 应为无管理权限');
		expect(!!fresh.auth.restoreError, 'me 403 应给出说明');
	});

	const recovered = await createHarness();
	mock.me = () => Promise.reject(new ApiError('服务暂时不可用，请稍后重试', 503));
	await recovered.auth.restore();
	expect(recovered.auth.status === 'restore-error', 'me 503 应是可重试的恢复失败');

	const me = identity(7, 'retry-admin@example.com');
	mock.me = () => Promise.resolve(me);
	await recovered.auth.restore();
	expect(recovered.auth.status === 'authenticated', '重试成功后应恢复身份');
	expect(recovered.auth.admin?.email === me.email, '重试成功应写入身份');
}

const cases: Array<[string, () => Promise<void>]> = [
	['退出返回 401 时在途 me 的结果被丢弃', caseLogoutInvalidatesInFlightRestore],
	['退出 204 后迟到的 me 不写回身份', caseLogout204InvalidatesInFlightRestore],
	['旧 me 失败不覆盖之后成功的新登录', caseStaleMeFailureKeepsNewLogin],
	['旧 me 成功不覆盖之后成功的新登录', caseStaleMeSuccessKeepsNewLogin],
	['并发恢复去重且只请求一次 me', caseConcurrentRestoreDeduplicated],
	['退出遇到 500 保留身份并给出可重试错误', caseLogoutServiceErrorKeepsIdentity],
	['恢复失败各分支（401/403/503/重试）', caseRestoreFailureStates],
];

export async function runCases(): Promise<void> {
	let failed = 0;
	for (const [name, run] of cases) {
		try {
			await run();
			console.log(`  [通过] ${name}`);
		} catch (err) {
			failed += 1;
			console.log(`  [失败] ${name}`);
			console.log(`         ${(err as Error).message}`);
		}
	}
	console.log(`管理员会话回归：${cases.length - failed} 通过，${failed} 失败`);
	if (failed > 0) process.exitCode = 1;
}
