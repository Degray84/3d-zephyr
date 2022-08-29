<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useSettings } from '@/stores/settings';
import { useRouter, useRoute } from 'vue-router';
import { useConfig } from '@/stores/config';
import { storeToRefs } from 'pinia';

import AppLayout from '@/views/layouts/AppLayout.vue';
import { isAvailablePage } from '@/helpers/config';

const storeSettings = useSettings();
const { darkTheme } = storeToRefs(storeSettings);
const storeConfig = useConfig();
const router = useRouter();
const route = useRoute();

const { pages } = storeToRefs(storeConfig);

const setTheme = () => {
  document.firstElementChild?.setAttribute('color-scheme', darkTheme.value ? 'dark' : 'light');
};

onMounted(() => {
  setTheme();
  storeConfig.fetchAppConfig();
});

watch(darkTheme, () => {
  setTheme();
});

watch(pages, () => {
  if (!pages.value) return;
  const routeName = route.name || '';

  if (!isAvailablePage(routeName)) {
    router.push({ name: '404' });
  }
});
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>
