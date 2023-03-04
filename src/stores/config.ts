import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getRemoteConfig, fetchAndActivate, getAll } from 'firebase/remote-config';

export interface Pages {
  [key: string | symbol]: boolean | number;
}

export const useConfig = defineStore('config', () => {
  const pages = ref<Pages | null>(null);

  const fetchAppConfig = () => {
    const remoteConfig = getRemoteConfig();
    fetchAndActivate(remoteConfig).then(() => {
      const all = getAll(remoteConfig);
      pages.value = JSON.parse(all.pages.asString());
    });
  };

  return { pages, fetchAppConfig };
});
