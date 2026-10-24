/**
 * 管理端外壳：顶栏 + 窄屏抽屉 + 页面出口（迁移自 v4 原型 admin.html 骨架）。
 *
 * 身份恢复失败（网络/503）时不展示任何管理内容，只给出可重试的提示；
 * 恢复成功后由后端返回的身份信息驱动顶栏展示。
 */

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAdminAuthStore } from '/@/stores/adminAuth';
import AdminTopbar from '/@/layout/admin/AdminTopbar.vue';
import AdminNavDrawer from '/@/layout/admin/AdminNavDrawer.vue';
import '/@/styles/admin-console.css';

const auth = useAdminAuthStore();
const route = useRoute();
const router = useRouter();

const drawerOpen = ref(false);
const retrying = ref(false);

function closeDrawer(restoreFocus = true) {
	if (!drawerOpen.value) return;
	drawerOpen.value = false;
	// 关闭后把焦点还给汉堡按钮，避免键盘焦点丢失到 body
	if (restoreFocus) document.getElementById('admin-menu-btn')?.focus();
}

function onKeydown(event: KeyboardEvent) {
	if (event.key === 'Escape') closeDrawer();
}

async function retryRestore() {
	if (retrying.value) return;
	retrying.value = true;
	try {
		await auth.restore();
	} finally {
		retrying.value = false;
	}
}

// 身份在会话期间转负（重试后仍是 401，或在别处被退出）时补一次跳转，
// 避免守卫只在导航时刻把守、之后的状态变化却仍停留在管理页面。
watch(
	() => auth.status,
	(status) => {
		if (status === 'unauthenticated') {
			void router.push({ name: 'login', query: { redirect: route.fullPath } });
		} else if (status === 'no-permission') {
			void router.push({ name: 'forbidden' });
		}
	}
);

// 路由变化后只收起抽屉，不抢焦点（让键盘焦点留在新的主内容里）
watch(
	() => route.fullPath,
	() => closeDrawer(false)
);

onMounted(() => document.addEventListener('keydown', onKeydown));
onUnmounted(() => document.removeEventListener('keydown', onKeydown));
</script>

<template>
	<div class="admin-console-page">
		<AdminTopbar @open-drawer="drawerOpen = true" />
		<AdminNavDrawer :open="drawerOpen" @close="closeDrawer" />
		<div class="admin-nav-mask" :class="{ show: drawerOpen }" @click="closeDrawer"></div>

		<main class="page-main">
			<div class="wrap">
				<div v-if="auth.hasRestoreFailure" class="alert alert-warn" role="alert">
					<span class="ic">⚠</span>
					<span class="stack">
						<span>会话恢复失败：{{ auth.restoreError }}</span>
						<span>这不是未登录，也不会清除你的管理员会话。请稍后重试。</span>
						<button class="btn btn-ghost btn-sm" type="button" :disabled="retrying" @click="retryRestore">
							{{ retrying ? '重试中…' : '重新恢复会话' }}
						</button>
					</span>
				</div>
				<router-view v-else />
			</div>
		</main>
	</div>
</template>

<style scoped lang="scss">
.alert-warn .stack > * + * {
	margin-top: 10px;
}
.alert-warn .stack .btn {
	margin-top: 4px;
}
</style>
