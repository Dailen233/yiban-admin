/**
 * 管理概览（迁移自 v4 原型 admin.html 页面骨架）。
 *
 * 迁移保留：分区结构、卡片骨架、排版与响应式。
 * 原型中的任务数量、举报、审核、运行统计与操作日志暂无真实后端接口，
 * 本批一律渲染为「尚未接入」状态，不展示任何编造数据。
 */

<script setup lang="ts">
import { computed } from 'vue';
import { useAdminAuthStore } from '/@/stores/adminAuth';
import { useAdminLogout } from '/@/composables/useAdminLogout';

const auth = useAdminAuthStore();
const { pending: logoutPending, error: logoutError, logout } = useAdminLogout();

const identityLine = computed(() => {
	if (!auth.admin) return '';
	return `${auth.admin.display_name}（${auth.roleLabel}）· ${auth.admin.email}`;
});
</script>

<template>
	<div>
		<div class="page-head">
			<div>
				<h1>管理概览</h1>
				<div class="sub">{{ identityLine }}</div>
			</div>
			<span class="spacer"></span>
			<span class="badge b-muted">管理员会话已验证</span>
		</div>

		<div v-if="logoutError" class="alert alert-err logout-error" role="alert">
			<span class="ic">✕</span>
			<span>{{ logoutError }}（身份保持登录，可再次尝试退出）</span>
		</div>

		<div class="alert alert-info">
			<span class="ic">ⓘ</span>
			<span>
				本批已接入：管理员登录、会话恢复、路由保护与退出。真实会话由服务端校验，前端不保存令牌。
			</span>
		</div>

		<h2 class="section-label">待处理事项</h2>
		<div class="grid grid-2">
			<div class="task-card tc-warn is-disabled" title="尚未接入真实接口">
				<div class="tc-icon">🛡️</div>
				<div class="tc-body">
					<div class="tc-title">举报待审核</div>
					<div class="tc-desc">尚无真实接口，暂不展示数量</div>
				</div>
				<div class="tc-num">—</div>
				<div class="tc-cta">待接入</div>
			</div>
			<div class="task-card tc-err is-disabled" title="尚未接入真实接口">
				<div class="tc-icon">⚠</div>
				<div class="tc-body">
					<div class="tc-title">任务失败</div>
					<div class="tc-desc">尚无真实接口，暂不展示数量</div>
				</div>
				<div class="tc-num">—</div>
				<div class="tc-cta">待接入</div>
			</div>
		</div>

		<h2 class="section-label">运行数据</h2>
		<div class="stat-strip">
			<div class="ss-item">
				<span class="ss-k">用户总数</span>
				<span class="ss-v">—<small> 待接入</small></span>
			</div>
			<div class="ss-div"></div>
			<div class="ss-item">
				<span class="ss-k">今日任务</span>
				<span class="ss-v">—<small> 待接入</small></span>
			</div>
		</div>

		<h2 class="section-label">近期操作日志</h2>
		<div class="card">
			<div class="empty">
				<div class="glyph">🗓</div>
				<h3>暂无操作日志</h3>
				<p>操作留痕接口尚未接入，接入后在此展示真实记录。</p>
			</div>
		</div>

		<h2 class="section-label">会话</h2>
		<div class="card session-card">
			<div class="session-meta">
				<div class="tc-title">当前管理员会话</div>
				<div class="tc-desc">会话凭据保存在服务端下发的 HttpOnly Cookie 中，页面刷新后自动恢复。</div>
			</div>
			<button class="btn btn-ghost btn-sm" type="button" :disabled="logoutPending" @click="logout">
				{{ logoutPending ? '退出中…' : '退出管理端' }}
			</button>
		</div>
	</div>
</template>

<style scoped lang="scss">
.logout-error {
	margin-bottom: 18px;
}
.session-card {
	display: flex;
	align-items: center;
	gap: 16px;
	flex-wrap: wrap;
}
.session-card .session-meta {
	flex: 1;
	min-width: 0;
}
</style>
