import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home,
            meta: {
                title: '主题列表',
            },
        },
        {
            path: '/oss/settings',
            name: 'oss-settings',
            component: () => import('../views/OSSSettings.vue'),
            meta: {
                title: 'OSS设置',
            },
        },
        {
            path: '/theme/create',
            name: 'theme-create',
            component: () => import('../views/ThemeDetail.vue'),
            meta: {
                title: '新建主题',
            },
        },
        {
            path: '/theme/detail',
            name: 'theme-detail',
            component: () => import('../views/ThemeDetail.vue'),
            meta: {
                title: '主题详情',
            },
        },
        {
            path: '/theme/history',
            name: 'history-list',
            component: () => import('../views/HistoryList.vue'),
            meta: {
                title: '历史记录',
            },
        },
        {
            path: '/history/compare',
            name: 'history-compare',
            component: () => import('../views/HistoryCompare.vue'),
            meta: {
                title: '历史记录对比',
            },
        },
    ],
});

export default router;
