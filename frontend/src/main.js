import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { setupAxiosInterceptors } from './axios';

// Import global SCSS
import '@/assets/scss/main.scss';

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(router);

// Set up Axios interceptors after Pinia is initialized
setupAxiosInterceptors();

app.mount('#app');
