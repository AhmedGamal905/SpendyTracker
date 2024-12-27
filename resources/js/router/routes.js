// Pages
import Index from '../pages/Index.vue';
import Income from '../pages/Income.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Expense from '../pages/Expense.vue';
import Error from '../pages/Error.vue';
import Categories from '../pages/Categories.vue';
import CategoryExpenses from '../pages/CategoryExpenses.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Index,
    },
    {
        path: "/login",
        name: 'Login',
        component: Login,
    },
    {
        path: "/register",
        name: 'Register',
        component: Register,
    },
    {
        path: "/income",
        component: Income,
        meta: { requiresAuth: true },
    },
    {
        path: "/expense",
        name: 'Expense',
        component: Expense,
        meta: { requiresAuth: true },
    },
    {
        path: "/categories",
        name: 'categories',
        component: Categories,
        meta: { requiresAuth: true },
    },
    {
        path: "/category/:id/expenses",
        name: 'CategoryExpenses',
        component: CategoryExpenses,
        meta: { requiresAuth: true },
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: Error,
    },
];

export default routes;
