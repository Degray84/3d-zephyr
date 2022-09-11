import { useStorage } from '@vueuse/core';
import i18n from '@/plugins/vue-i18n';
import {  watchEffect } from 'vue';

export function useChangeLocale() {
  const { locale } = i18n.global;
  const localesStorage = useStorage('locale', locale.value);

  watchEffect(() => {
    const newLocale = localesStorage.value === 'ru' ? 'ru' : 'en';
    locale.value = newLocale;
  });

  return {
    changeLanguage() {
      localesStorage.value = localesStorage.value === 'ru' ? 'en' : 'ru';
    },
  };
}
