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
            path: '/theme/create',
            name: 'theme-create',
            component: () => import('../views/ThemeDetail.vue'),
            meta: {
                title: '新建主题',
            },
        },
        {
            path: '/theme/:id',
            name: 'theme-detail',
            component: () => import('../views/ThemeDetail.vue'),
            meta: {
                title: '主题详情',
            },
        },
    ],
});

export default router;
