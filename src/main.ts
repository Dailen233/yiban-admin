import { createApp } from 'vue';
import pinia from '/@/stores/index';
import App from './App.vue';
import router from './router';
import { NextLoading } from '/@/utils/loading';

import '/@/theme/loading.scss';
import '/@/styles/tokens.css';
import '/@/styles/shared.css';

const app = createApp(App);

app.use(pinia).use(router).mount('#app');

// 首次挂载后移除模板的全局 loading 遮罩
NextLoading.done();
