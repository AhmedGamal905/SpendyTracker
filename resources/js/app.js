import 'preline';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { ToastPlugin } from 'vue-toast-notification';
import { vue3Spinner } from 'vue3-spinner';
import '../css/app.css';
import './bootstrap';
import 'vue-toast-notification/dist/theme-sugar.css';
import Navbar from './components/Header/Navbar.vue';
import Layout from './layout/layout.vue';
import router from './router/index';
import Footer from './components/Header/Footer.vue';
import Dialog from './components/Models/Dialog.vue';
import Delete from './components/Buttons/Delete.vue';

const app = createApp({});

app.component('nav-bar', Navbar);
app.component('layout-component', Layout);
app.component('footer-component', Footer);
app.component('dialog-component', Dialog);
app.component('deleteButton-component', Delete);

app.use(router);
app.use(createPinia());
app.use(ToastPlugin);
app.use(vue3Spinner);
app.mount('#app');
