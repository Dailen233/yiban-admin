import { RouteRecordRaw } from 'vue-router';
import { storeToRefs } from 'pinia';
import pinia from '/@/stores/index';
import { useUserInfo } from '/@/stores/userInfo';
// import { useRequestOldRoutes } from '/@/stores/requestOldRoutes';
import { Session } from '/@/utils/storage';
import { NextLoading } from '/@/utils/loading';
import { dynamicRoutes, notFoundAndNoPower } from '/@/router/route';
import { formatTwoStageRoutes, formatFlatteningRoutes, router } from '/@/router/index';
import { useRoutesList } from '/@/stores/routesList';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { useMenuApi } from '/@/api/menu/index';

const menuApi = useMenuApi();

const layouModules: any = import.meta.glob('../layout/routerView/*.{vue,tsx}');
const viewsModules: any = import.meta.glob('../views/**/*.{vue,tsx}');

// 存放所有的path 为一维数组
let allPathData: any[] = [];

// 后端控制路由

/**
 * 获取目录下的 .vue、.tsx 全部文件
 * @method import.meta.glob
 * @link 参考：https://cn.vitejs.dev/guide/features.html#json
 */
const dynamicViewsModules: Record<string, Function> = Object.assign({}, { ...layouModules }, { ...viewsModules });

/**
 * 后端控制路由：初始化方法，防止刷新时路由丢失
 * @method NextLoading 界面 loading 动画开始执行
 * @method useUserInfo().setUserInfos() 触发初始化用户信息 pinia
 * @method useRequestOldRoutes().setRequestOldRoutes() 存储接口原始路由（未处理component），根据需求选择使用
 * @method setAddRoute 添加动态路由
 * @method setFilterMenuAndCacheTagsViewRoutes 设置路由到 vuex routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
 */
export async function initBackEndControlRoutes() {
	// 界面 loading 动画开始执行
	if (window.nextLoading === undefined) NextLoading.start();
	// 无 token 停止执行下一步
	if (!Session.get('token')) return false;
	// 触发初始化用户信息 pinia
	// https://gitee.com/lyt-top/vue-next-admin/issues/I5F1HP
	await useUserInfo().setUserInfos();
	// 获取路由菜单数据
	// const res = await getBackEndControlRoutes();
	const res = {
		code: 0,
		type: 'adminMenu',
		data: [
			{
				path: '/home',
				name: 'home',
				component: 'home/index',
				meta: {
					title: 'message.router.home',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: true,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'iconfont icon-shouye',
				},
			},
			{
				path: '/system',
				name: 'system',
				component: 'layout/routerView/parent',
				redirect: '/system/menu',
				meta: {
					title: 'message.router.system',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin'],
					icon: 'iconfont icon-xitongshezhi',
				},
				children: [
					{
						path: '/system/menu',
						name: 'systemMenu',
						component: 'system/menu/index',
						meta: {
							title: 'message.router.systemMenu',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-caidan',
						},
					},
					{
						path: '/system/user',
						name: 'systemUser',
						component: 'system/user/index',
						meta: {
							title: 'message.router.systemUser',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin'],
							icon: 'iconfont icon-icon-',
						},
					},
				],
			},
			{
				path: '/limits',
				name: 'limits',
				component: 'layout/routerView/parent',
				redirect: '/limits/frontEnd',
				meta: {
					title: 'message.router.limits',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'iconfont icon-quanxian',
				},
				children: [
					{
						path: '/limits/backEnd',
						name: 'limitsBackEnd',
						component: 'layout/routerView/parent',
						meta: {
							title: 'message.router.limitsBackEnd',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin', 'common'],
						},
						children: [
							{
								path: '/limits/backEnd/page',
								name: 'limitsBackEndEndPage',
								component: 'limits/backEnd/page/index',
								meta: {
									title: 'message.router.limitsBackEndEndPage',
									isLink: '',
									isHide: false,
									isKeepAlive: true,
									isAffix: false,
									isIframe: false,
									roles: ['admin', 'common'],
								},
							},
						],
					},
				],
			},
			{
				path: '/menu',
				name: 'menu',
				component: 'layout/routerView/parent',
				redirect: '/menu/menu1',
				meta: {
					title: 'message.router.menu',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'iconfont icon-caidan',
				},
				children: [
					{
						path: '/menu/menu1',
						name: 'menu1',
						component: 'layout/routerView/parent',
						redirect: '/menu/menu1/menu11',
						meta: {
							title: 'message.router.menu1',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin', 'common'],
							icon: 'iconfont icon-caidan',
						},
						children: [
							{
								path: '/menu/menu1/menu11',
								name: 'menu11',
								component: 'menu/menu1/menu11/index',
								meta: {
									title: 'message.router.menu11',
									isLink: '',
									isHide: false,
									isKeepAlive: true,
									isAffix: false,
									isIframe: false,
									roles: ['admin', 'common'],
									icon: 'iconfont icon-caidan',
								},
							},
							{
								path: '/menu/menu1/menu12',
								name: 'menu12',
								component: 'layout/routerView/parent',
								redirect: '/menu/menu1/menu12/menu121',
								meta: {
									title: 'message.router.menu12',
									isLink: '',
									isHide: false,
									isKeepAlive: true,
									isAffix: false,
									isIframe: false,
									roles: ['admin', 'common'],
									icon: 'iconfont icon-caidan',
								},
								children: [
									{
										path: '/menu/menu1/menu12/menu121',
										name: 'menu121',
										component: 'menu/menu1/menu12/menu121/index',
										meta: {
											title: 'message.router.menu121',
											isLink: '',
											isHide: false,
											isKeepAlive: true,
											isAffix: false,
											isIframe: false,
											roles: ['admin', 'common'],
											icon: 'iconfont icon-caidan',
										},
									},
									{
										path: '/menu/menu1/menu12/menu122',
										name: 'menu122',
										component: 'menu/menu1/menu12/menu122/index',
										meta: {
											title: 'message.router.menu122',
											isLink: '',
											isHide: false,
											isKeepAlive: true,
											isAffix: false,
											isIframe: false,
											roles: ['admin', 'common'],
											icon: 'iconfont icon-caidan',
										},
									},
								],
							},
							{
								path: '/menu/menu1/menu13',
								name: 'menu13',
								component: 'menu/menu1/menu13/index',
								meta: {
									title: 'message.router.menu13',
									isLink: '',
									isHide: false,
									isKeepAlive: true,
									isAffix: false,
									isIframe: false,
									roles: ['admin', 'common'],
									icon: 'iconfont icon-caidan',
								},
							},
						],
					},
					{
						path: '/menu/menu2',
						name: 'menu2',
						component: 'menu/menu2/index',
						meta: {
							title: 'message.router.menu2',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin', 'common'],
							icon: 'iconfont icon-caidan',
						},
					},
				],
			},
			{
				path: '/fun',
				name: 'funIndex',
				component: 'layout/routerView/parent',
				redirect: '/fun/tagsView',
				meta: {
					title: 'message.router.funIndex',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'iconfont icon-crew_feature',
				},
				children: [
					{
						path: '/fun/tagsView',
						name: 'funTagsView',
						component: 'fun/tagsView/index',
						meta: {
							title: 'message.router.funTagsView',
							isLink: '',
							isHide: false,
							isKeepAlive: true,
							isAffix: false,
							isIframe: false,
							roles: ['admin', 'common'],
							icon: 'ele-Pointer',
						},
					},
				],
			},
			{
				path: '/chart',
				name: 'chartIndex',
				component: 'chart/index',
				meta: {
					title: 'message.router.chartIndex',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'iconfont icon-ico_shuju',
				},
			},
			{
				path: '/personal',
				name: 'personal',
				component: 'personal/index',
				meta: {
					title: 'message.router.personal',
					isLink: '',
					isHide: false,
					isKeepAlive: true,
					isAffix: false,
					isIframe: false,
					roles: ['admin', 'common'],
					icon: 'iconfont icon-gerenzhongxin',
				},
			},
			// {
			// 	path: '/tools',
			// 	name: 'tools',
			// 	component: 'tools/index',
			// 	meta: {
			// 		title: 'message.router.tools',
			// 		isLink: '',
			// 		isHide: false,
			// 		isKeepAlive: true,
			// 		isAffix: false,
			// 		isIframe: false,
			// 		roles: ['admin', 'common'],
			// 		icon: 'iconfont icon-gongju',
			// 	},
			// },
			// {
			// 	path: '/link',
			// 	name: 'layoutLinkView',
			// 	component: 'layout/routerView/link',
			// 	meta: {
			// 		title: 'message.router.layoutLinkView',
			// 		isLink: 'https://element-plus.gitee.io/#/zh-CN/component/installation',
			// 		isHide: false,
			// 		isKeepAlive: false,
			// 		isAffix: false,
			// 		isIframe: false,
			// 		roles: ['admin'],
			// 		icon: 'iconfont icon-caozuo-wailian',
			// 	},
			// },
			// {
			// 	path: '/iframes',
			// 	name: 'layoutIfameView',
			// 	component: 'layout/routerView/iframe',
			// 	meta: {
			// 		title: 'message.router.layoutIfameView',
			// 		isLink: 'https://gitee.com/lyt-top/vue-next-admin',
			// 		isHide: false,
			// 		isKeepAlive: true,
			// 		isAffix: true,
			// 		isIframe: true,
			// 		roles: ['admin'],
			// 		icon: 'iconfont icon-neiqianshujuchucun',
			// 	},
			// },
		],
	};
	const routesData: any[] = [
		{
			path: '/home',
		},
		{
			path: '/system',
			children: [
				{
					path: '/system/menu',
				},
				{
					path: '/system/user',
				},
			],
		},
		{
			path: '/limits',
			children: [
				{
					path: '/limits/backEnd',
				},
			],
		},
	];

	// 获取所有的path一维数组
	getAllPathData(routesData);

	// 先根据role进行过滤
	const menuList = generateRoleRouter(res.data, 'admin');
	console.log(menuList);
	// 再根据后端返回的path进行过滤
	const resultData = getFilterRoutes(menuList);
	console.log(resultData);
	// useRequestOldRoutes().setRequestOldRoutes(JSON.parse(JSON.stringify(res.data)));
	// 处理路由（component），替换 dynamicRoutes（/@/router/route）第一个顶级 children 的路由
	dynamicRoutes[0].children = await backEndComponent(resultData);
	console.log(dynamicRoutes);
	// 添加动态路由
	await setAddRoute();
	// 设置路由到 vuex routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
	await setFilterMenuAndCacheTagsViewRoutes();
}

/**
 * 设置路由到 vuex routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
 * @description 用于左侧菜单、横向菜单的显示
 * @description 用于 tagsView、菜单搜索中：未过滤隐藏的(isHide)
 */
export function setFilterMenuAndCacheTagsViewRoutes() {
	const storesRoutesList = useRoutesList(pinia);
	storesRoutesList.setRoutesList(dynamicRoutes[0].children as any);
	setCacheTagsViewRoutes();
}

/**
 * 缓存多级嵌套数组处理后的一维数组
 * @description 用于 tagsView、菜单搜索中：未过滤隐藏的(isHide)
 */
export function setCacheTagsViewRoutes() {
	const storesTagsView = useTagsViewRoutes(pinia);
	storesTagsView.setTagsViewRoutes(formatTwoStageRoutes(formatFlatteningRoutes(dynamicRoutes))[0].children);
}

/**
 * 处理路由格式及添加捕获所有路由或 404 Not found 路由
 * @description 替换 dynamicRoutes（/@/router/route）第一个顶级 children 的路由
 * @returns 返回替换后的路由数组
 */
export function setFilterRouteEnd() {
	let filterRouteEnd: any = formatTwoStageRoutes(formatFlatteningRoutes(dynamicRoutes));
	filterRouteEnd[0].children = [...filterRouteEnd[0].children, ...notFoundAndNoPower];
	return filterRouteEnd;
}

/**
 * 添加动态路由
 * @method router.addRoute
 * @description 此处循环为 dynamicRoutes（/@/router/route）第一个顶级 children 的路由一维数组，非多级嵌套
 * @link 参考：https://next.router.vuejs.org/zh/api/#addroute
 */
export async function setAddRoute() {
	await setFilterRouteEnd().forEach((route: RouteRecordRaw) => {
		router.addRoute(route);
	});
}

/**
 * 请求后端路由菜单接口
 * @description isRequestRoutes 为 true，则开启后端控制路由
 * @returns 返回后端路由菜单数据
 */
export function getBackEndControlRoutes() {
	// 模拟 admin 与 test
	const stores = useUserInfo(pinia);
	const { userInfos } = storeToRefs(stores);
	const auth = userInfos.value.roles[0];
	// 管理员 admin
	if (auth === 'admin') {
		return menuApi.getMenuAdmin();
	}
	// 其它用户 test
	else return menuApi.getMenuTest();
}

/**
 * 重新请求后端路由菜单接口
 * @description 用于菜单管理界面刷新菜单（未进行测试）
 * @description 路径：/src/views/system/menu/component/addMenu.vue
 */
export function setBackEndControlRefreshRoutes() {
	getBackEndControlRoutes();
}

/**
 * 后端路由 component 转换
 * @param routes 后端返回的路由表数组
 * @returns 返回处理成函数后的 component
 */
export function backEndComponent(routes: any) {
	if (!routes) return;
	return routes.map((item: any) => {
		if (item.component) item.component = dynamicImport(dynamicViewsModules, item.component as string);
		item.children && backEndComponent(item.children);
		return item;
	});
}

/**
 * 后端路由 component 转换函数
 * @param dynamicViewsModules 获取目录下的 .vue、.tsx 全部文件
 * @param component 当前要处理项 component
 * @returns 返回处理成函数后的 component
 */
export function dynamicImport(dynamicViewsModules: Record<string, Function>, component: string) {
	const keys = Object.keys(dynamicViewsModules);
	const matchKeys = keys.filter((key) => {
		const k = key.replace(/..\/views|../, '');
		return k.startsWith(`${component}`) || k.startsWith(`/${component}`);
	});
	if (matchKeys?.length === 1) {
		const matchKey = matchKeys[0];
		return dynamicViewsModules[matchKey];
	}
	if (matchKeys?.length > 1) {
		return false;
	}
}
// 根据角色进行筛选
export function generateRoleRouter(routes: any, role: string) {
	function getRouter(routes: any, role: string) {
		routes = routes.map((item: any) => {
			if ((item.meta.role && item.meta.role.includes(role)) || !item.meta.role) {
				if (item.children) {
					const children = getRouter(item.children, role);
					children.length === 0 ? delete item.children : (item.children = children);
				}
				return item;
			}
			return null;
		});
		return routes.filter((item: any) => item !== null);
	}
	return getRouter(routes, role);
}

// 将路由中的path放到一维数据当中
export function getAllPathData(routes: any) {
	allPathData = [];
	function getRouter(routes: any) {
		routes.forEach((item: any) => {
			if (item.path) {
				allPathData.push(item.path);
				if (item.children) {
					getRouter(item.children);
				}
			}
		});
	}
	return getRouter(routes);
}
// 通过后端返回的路由进行筛选
export function getFilterRoutes(routes: any) {
	function getRouter(routes: any) {
		routes = routes.map((item: any) => {
			if (item.path && allPathData.includes(item.path)) {
				if (item.children) {
					const children = getRouter(item.children);
					children.length === 0 ? delete item.children : (item.children = children);
				}
				return item;
			}
			return null;
		});
		return routes.filter((item: any) => item !== null);
	}
	return getRouter(routes);
}
