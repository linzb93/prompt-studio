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
    ],
});

export default router;
