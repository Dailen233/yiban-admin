/**
 * 管理端页面不存在（未知路径）。
 * 保持品牌结构，提供返回已登录页面的入口，不暴露内部路由信息。
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
							<h1>页面不存在</h1>
							<p>译伴 BilingualPress · 管理后台 · 独立入口</p>
						</div>
					</div>
					<div class="alert alert-info" role="status">
						<span class="ic">ⓘ</span>
						<span>该地址没有对应的管理端页面。</span>
					</div>
					<div class="actions">
						<button class="btn btn-primary btn-block" type="button" @click="router.push({ name: 'overview' })">
							返回管理概览
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
