<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useSettings } from '@/stores/settings';
import { storeToRefs } from 'pinia';

import AppLayout from '@/views/layouts/AppLayout.vue';

const storeSettings = useSettings();
const { darkTheme } = storeToRefs(storeSettings);

const setTheme = () => {
  document.firstElementChild?.setAttribute('color-scheme', darkTheme.value ? 'dark' : 'light');
};

onMounted(() => {
  setTheme();
});

watch(darkTheme, () => {
  console.log(2)
  setTheme();
});
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>
