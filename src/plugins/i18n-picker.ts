import type { I18nObject } from '@/interfaces';
import { useI18n } from 'vue-i18n';

export default (value: I18nObject) => {
  const i18n = useI18n();
  const { locale } = i18n;

  return value[locale.value as keyof I18nObject];
};
