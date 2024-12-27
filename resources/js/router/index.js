import { HSStaticMethods } from 'preline';
import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes';

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.afterEach((to, from, failure) => {
    if (!failure) {
        setTimeout(() => {
            HSStaticMethods.autoInit();
        }, 100);
    }
});

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        const token = localStorage.getItem('authToken');

        if (!token) {
            next({ name: 'Login' });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
