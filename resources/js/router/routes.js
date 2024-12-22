// Pages
import Index from '../pages/Index.vue';
import Income from '../pages/Income.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Expense from '../pages/Expense.vue';
import Error from '../pages/Error.vue';


const routes = [
    {
        path: '/',
        component: Index,
    },
    {
        path: "/login",
        component: Login,
    },
    {
        path: "/register",
        component: Register,
    },
    {
        path: "/income",
        component: Income,
    },
    {
        path: "/expense",
        component: Expense,
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: Error,
    },
];

export default routes;
