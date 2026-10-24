/**
 * 管理端顶部导航（迁移自 v4 原型 admin.html 顶栏）。
 * 展示已登录管理员的昵称、邮箱、角色与退出入口；未接入的菜单项渲染为禁用态。
 */

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { adminNavItems } from '/@/config/adminNav';
import { useAdminAuthStore } from '/@/stores/adminAuth';

const emit = defineEmits(['open-drawer']);

const auth = useAdminAuthStore();
const route = useRoute();

/** 头像取昵称首字；昵称为空时回退到邮箱首字 */
const avatarText = computed(() => {
	const name = auth.admin?.display_name?.trim();
	if (name) return name.slice(0, 1);
	const email = auth.admin?.email?.trim();
	return email ? email.slice(0, 1).toUpperCase() : '管';
});
</script>

<template>
	<header class="topbar admin-topbar">
		<div class="wrap">
			<RouterLink class="admin-brand" to="/">
				<span class="seal">管</span>
				<b><span class="wm">译伴</span> · 管理后台</b>
				<span class="tag">独立入口</span>
			</RouterLink>

			<nav class="admin-nav" aria-label="管理端主导航">
				<template v-for="item in adminNavItems" :key="item.label">
					<RouterLink v-if="item.connected && item.to" :to="item.to" :class="{ active: route.path === item.to }">
						{{ item.label }}
					</RouterLink>
					<span v-else class="is-disabled" :title="item.hint" aria-disabled="true">{{ item.label }}</span>
				</template>
			</nav>

			<span class="spacer"></span>

			<div v-if="auth.admin" class="admin-user">
				<span class="av" aria-hidden="true">{{ avatarText }}</span>
				<span class="u-meta">
					<span class="u-name">{{ auth.admin.display_name }}</span>
					<span class="u-mail">{{ auth.admin.email }}</span>
				</span>
				<span class="badge b-muted">{{ auth.roleLabel }}</span>
			</div>

			<button
				id="admin-menu-btn"
				class="menu-btn"
				type="button"
				aria-label="打开管理端导航"
				aria-controls="admin-mobile-nav"
				@click="emit('open-drawer')"
			>
				<span></span><span></span><span></span>
			</button>
		</div>
	</header>
</template>

<style scoped lang="scss">
/* 沿用 v4 原型管理顶栏上的汉堡按钮配色 */
.menu-btn {
	border-color: #2c465e;
	background: #17293a;
}
.menu-btn span {
	background: #a9bccb;
}
/* 顶栏上的角色徽标需要在深色底上可读 */
.badge.b-muted {
	background: #24405a;
	color: #cdd9e2;
	border-color: #2c465e;
	flex-shrink: 0;
}
</style>
