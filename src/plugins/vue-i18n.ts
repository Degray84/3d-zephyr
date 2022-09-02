import { createI18n } from 'vue-i18n';
import messages from '@/locales';

const i18n = createI18n({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'en',
  messages,
});

console.log(i18n)

export default i18n;
