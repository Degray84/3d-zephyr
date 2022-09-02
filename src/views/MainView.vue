<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useConfig } from '@/stores/config';
import { storeToRefs } from 'pinia';

import AppLayout from '@/views/layouts/AppLayout.vue';
import { isAvailablePage } from '@/helpers/config';
import {  useI18n } from 'vue-i18n';

const storeConfig = useConfig();
const router = useRouter();
const route = useRoute();

const { pages } = storeToRefs(storeConfig);
const i18n = useI18n()

onMounted(() => {
  storeConfig.fetchAppConfig();
  console.log(i18n)
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
