/**
 * 已认证但无管理员权限（HTTP 403）。
 * 明确展示「无管理权限」，不渲染任何管理内容，也不伪装成未登录。
 */

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { NextLoading } from '/@/utils/loading';
import '/@/styles/admin-login.css';

const router = useRouter();

NextLoading.done();
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
							<h1>无管理权限</h1>
							<p>译伴 BilingualPress · 管理后台 · 独立入口</p>
						</div>
					</div>

					<div class="alert alert-err" role="alert">
						<span class="ic">✕</span>
						<span>当前会话已通过身份认证，但账号不具备管理员角色，无法查看管理端内容。</span>
					</div>

					<div class="actions">
						<button class="btn btn-primary btn-block" type="button" @click="router.push({ name: 'login' })">
							使用管理员账号登录
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.actions {
	margin-top: 18px;
}
</style>
