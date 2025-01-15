import { createPinia } from 'pinia';
import 'preline';
import { createApp } from 'vue';
import { ToastPlugin } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import { vue3Spinner } from 'vue3-spinner';
import '../css/app.css';
import './bootstrap';
import './interceptors/index.js';
import App from './pages/App.vue';
import router from './router/index';

createApp(App).use(router).use(createPinia()).use(ToastPlugin).use(vue3Spinner).mount('#app');
