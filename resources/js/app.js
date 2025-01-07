import { createPinia } from 'pinia';
import 'preline';
import { createApp } from 'vue';
import { ToastPlugin } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { vue3Spinner } from 'vue3-spinner';
import '../css/app.css';
import './bootstrap';
import Delete from './components/Buttons/Delete.vue';
import Footer from './components/Header/Footer.vue';
import Navbar from './components/Header/Navbar.vue';
import Layout from './layout/layout.vue';
import router from './router/index';

const app = createApp({});

app.component('nav-bar', Navbar);
app.component('layout-component', Layout);
app.component('footer-component', Footer);
app.component('deleteButton-component', Delete);

app.use(router);
app.use(createPinia());
app.use(ToastPlugin);
app.use(vue3Spinner);
app.mount('#app');
