import 'preline';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import '../css/app.css';
import './bootstrap';
import Navbar from './components/Header/Navbar.vue';
import Layout from './layout/layout.vue';
import router from './router/index';
import Login from './components/Forms/Login.vue';
import Signup from './components/Forms/Signup.vue';
import Footer from './components/Header/Footer.vue';
import AllIncomes from './components/Income/AllIncomes.vue';
import AllExpenses from './components/Expenses/AllExpenses.vue';
import Error404 from './components/Error/Error404.vue';

const app = createApp({});

app.component('nav-bar', Navbar);
app.component('layout-component', Layout);
app.component('login-component', Login);
app.component('signup-component', Signup);
app.component('footer-component', Footer);
app.component('incomes-component', AllIncomes);
app.component('expense-component', AllExpenses);
app.component('Error404-component', Error404);

app.use(router);
app.use(createPinia());
app.mount('#app');
