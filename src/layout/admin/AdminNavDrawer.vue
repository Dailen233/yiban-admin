/**
 * 管理端窄屏导航抽屉（迁移自 v4 原型 admin.html 的 #mobile-nav）。
 * 支持 Esc 关闭、遮罩关闭、路由切换自动关闭，并在打开时把焦点交给抽屉。
 * 常驻渲染以保持原型原有的显隐过渡；关闭态由 CSS 处理为不可见、不可聚焦。
 */

<script setup lang="ts">
import { nextTick, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { adminNavItems } from '/@/config/adminNav';
import { useAdminAuthStore } from '/@/stores/adminAuth';

const props = defineProps<{ open: boolean }>();
const emit = defineEmits(['close']);

const auth = useAdminAuthStore();

const avatarText = (): string => {
	const name = auth.admin?.display_name?.trim();
	if (name) return name.slice(0, 1);
	const email = auth.admin?.email?.trim();
	return email ? email.slice(0, 1).toUpperCase() : '管';
};

watch(
	() => props.open,
	async (open) => {
		if (!open) return;
		await nextTick();
		// 抽屉关闭态为 visibility:hidden，子元素不可聚焦；第一帧用于让样式变更提交，
		// 第二帧（已绘制）再把焦点交给抽屉内第一个可聚焦元素。
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				document.querySelector<HTMLElement>('#admin-mobile-nav a, #admin-mobile-nav button')?.focus();
			});
		});
	}
);
</script>

<template>
	<div
		id="admin-mobile-nav"
		class="admin-mobile-nav admin"
		:class="{ open: props.open }"
		role="dialog"
		aria-modal="true"
		aria-label="管理端导航"
		:aria-hidden="!props.open"
		@keydown.esc="emit('close')"
	>
		<template v-for="item in adminNavItems" :key="item.label">
			<RouterLink v-if="item.connected && item.to" :to="item.to" @click="emit('close')">{{ item.label }}</RouterLink>
			<span v-else class="is-disabled" :title="item.hint" aria-disabled="true">{{ item.label }}</span>
		</template>
		<div v-if="auth.admin" class="mn-foot">
			<span class="av" aria-hidden="true">{{ avatarText() }}</span>
			<span class="mn-who">{{ auth.admin.display_name }} · {{ auth.admin.email }}</span>
		</div>
	</div>
</template>

<style scoped lang="scss">
.admin-mobile-nav.admin .mn-foot .av {
	display: inline-grid;
	width: 26px;
	height: 26px;
	border-radius: 50%;
	background: #24405a;
	place-items: center;
	color: var(--gold-2);
	font-weight: 700;
	vertical-align: middle;
	margin-right: 8px;
}
.admin-mobile-nav.admin .mn-foot .mn-who {
	font-size: 13px;
	color: #7f95a8;
	word-break: break-all;
}
</style>
