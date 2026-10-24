/**
 * 管理员会话回归入口（不改动工程的 Vue / Vite / TypeScript 基线）。
 *
 * 工程没有测试运行器，这里直接用 vite 已有的 esbuild 把 store / composable 打包成单文件，
 * 再用 Node 执行：
 * - `/@/*` 映射到 `src/*`，与实际 vite alias 保持一致；
 * - `/@/api/adminAuth` 替换为可控替身，把真实接口换成用例驱动的 Promise；
 * - Vue 的特性开关与环境变量用 define 注入，避免打包产物依赖浏览器上下文。
 *
 * 运行：`npm run test:auth`
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import esbuild from 'esbuild';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const MOCK_API = path.join(here, 'mockApi.ts');

/** 补齐扩展名：直接返回路径时 esbuild 不做后缀查找 */
function withExtension(target) {
	for (const candidate of [`${target}.ts`, `${target}.js`, path.join(target, 'index.ts')]) {
		if (fs.existsSync(candidate)) return candidate;
	}
	return target;
}

/** 与 vite.config.ts 的 alias 保持一致，`/@/api/adminAuth` 单独指向替身 */
const aliasPlugin = {
	name: 'yiban-admin-alias',
	setup(build) {
		build.onResolve({ filter: /^\/@\// }, (args) => {
			if (args.path === '/@/api/adminAuth') return { path: MOCK_API };
			return { path: withExtension(path.join(root, 'src', args.path.slice(3))) };
		});
	},
};

// 输出 CJS：axios 内部 require Node 内建模块，打成 ESM 会失去 require 支持
const outfile = path.join(root, 'node_modules/.cache/admin-auth-regression.cjs');

await esbuild.build({
	entryPoints: [path.join(here, 'cases.ts')],
	bundle: true,
	platform: 'node',
	format: 'cjs',
	target: 'node18',
	outfile,
	plugins: [aliasPlugin],
	define: {
		'import.meta.env.VITE_API_BASE_URL': '"http://localhost:8001"',
		'process.env.NODE_ENV': '"development"',
		__VUE_OPTIONS_API__: 'true',
		__VUE_PROD_DEVTOOLS__: 'false',
		__VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
		__DEV__: 'true',
	},
	logLevel: 'warning',
});

const bundle = await import(`${pathToFileURL(outfile).href}?t=${Date.now()}`);
await bundle.runCases();
