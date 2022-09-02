import { createApp } from 'vue';
import { createPinia } from 'pinia';

import i18n from '@/plugins/vue-i18n';
import pickLocale from '@/plugins/i18n-picker';

import App from '@/App.vue';
import router from '@/router';

import '@/assets/styles/main.scss';

import '@/plugins';

const app = createApp(App);

app.config.globalProperties.$pickLocale = pickLocale;

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount('#app');
