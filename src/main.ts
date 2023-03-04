import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Quasar } from 'quasar';

import '@quasar/extras/roboto-font/roboto-font.css';
import '@quasar/extras/material-icons/material-icons.css';
import 'quasar/src/css/index.sass';

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
app.use(Quasar, {
  config: {
    brand: {
      primary: '#7F5283',
      secondary: '#A6D1E6',
      accent: '#9C27B0',

      dark: '#383838',
      'dark-page': '#474747',

      positive: '#24d44d',
      negative: '#e63e52',
      info: '#bfbfbf',
      warning: '#e8bd46',
    },
  },
});

app.mount('#app');
