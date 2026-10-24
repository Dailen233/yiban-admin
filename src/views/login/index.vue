/**
 * 管理端登录页（迁移自 v4 原型 admin-login.html）。
 *
 * 迁移保留：结构、配色、排版、品牌标识、间距、响应式与交互。
 * 已移除：原型的「仅供原型演示」横幅、预填示例账号密码与模拟登录逻辑，
 * 改为调用 `yiban-api` 的真实管理员登录接口。
 */

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAdminLogin } from '/@/composables/useAdminLogin';
import { NextLoading } from '/@/utils/loading';
import '/@/styles/admin-login.css';

const { email, password, pending, error, canSubmit, submit } = useAdminLogin();

onMounted(() => {
	NextLoading.done();
});
</script>

<template>
	<div class="admin-login-page">
		<header class="topbar admin-topbar">
			<div class="wrap">
				<span class="admin-brand">
					<span class="seal">管</span>
					<b><span class="wm">译伴</span> · 管理后台</b>
					<span class="tag">独立入口</span>
				</span>
				<span class="spacer"></span>
			</div>
		</header>

		<div class="auth">
			<div class="form-side">
				<div class="form-card">
					<div class="admin-identity">
						<span class="seal">管</span>
						<div>
							<h1>管理员登录</h1>
							<p>译伴 BilingualPress · 管理后台 · 独立入口</p>
						</div>
					</div>

					<form novalidate @submit.prevent="submit">
						<div class="field">
							<label for="admin-email">管理员邮箱</label>
							<input
								id="admin-email"
								v-model.trim="email"
								class="input"
								type="email"
								autocomplete="username"
								placeholder="请输入管理员邮箱"
								:disabled="pending"
							/>
						</div>
						<div class="field">
							<label for="admin-password">密码</label>
							<input
								id="admin-password"
								v-model="password"
								class="input"
								type="password"
								autocomplete="current-password"
								placeholder="请输入密码"
								:disabled="pending"
							/>
						</div>

						<div v-if="error" class="alert alert-err login-error" role="alert">
							<span class="ic">✕</span>
							<span>{{ error }}</span>
						</div>

						<button class="btn btn-primary btn-block" type="submit" :disabled="!canSubmit">
							{{ pending ? '登录中…' : '登录后台' }}
						</button>
					</form>

					<p class="foot">管理端不提供公开注册，账号由系统管理员创建</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.login-error {
	margin-bottom: 14px;
}
</style>
