import { defineRule } from 'vee-validate';
import { required, email, min, alpha, integer } from '@vee-validate/rules';
import { configure } from 'vee-validate';
import { localize } from '@vee-validate/i18n';
import { setLocale } from '@vee-validate/i18n';
import en from '@vee-validate/i18n/dist/locale/en.json';
import enNames from '@/locales/ru/forms';
import ru from '@vee-validate/i18n/dist/locale/ru.json';
import ruNames from '@/locales/ru/forms';

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('alpha', alpha);
defineRule('integer', integer);

configure({
  generateMessage: localize({
    en: {
      ...en,
      names: enNames,
    },
    ru: {
      ...ru,
      names: ruNames,
    },
  }),
});

setLocale('ru');
