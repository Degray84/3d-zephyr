<script setup lang="ts">
import { ref } from 'vue';
import EmptyLayout from '@/views/layouts/EmptyLayout.vue';
import TheHeader from '@/components/common/TheHeader.vue';
import NavigationBar from '@/components/common/navigation/TheNavigationBar.vue';
import TheUserDropdown from '@/components/common/TheUserDropdown.vue';

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};
</script>

<template>
  <EmptyLayout>
    <TheHeader />
    <q-layout view="hHh lpR fFf">
      <q-header bordered class="bg-primary text-white">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

          <q-toolbar-title>
            <q-avatar clicable>
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
            </q-avatar>
            ZEPHYR-PRINTING
          </q-toolbar-title>

          <TheUserDropdown />
        </q-toolbar>
      </q-header>

      <q-drawer v-model="leftDrawerOpen" show-if-above bordered persistent side="left">
        <NavigationBar />
      </q-drawer>

      <router-view />
    </q-layout>
  </EmptyLayout>
</template>

<style lang="scss" scoped>
.main-container {
  position: relative;
  top: 60px;
  display: flex;
  margin: var(--skr-space-4) var(--skr-space-6);
  box-sizing: border-box;
  width: 100%;
  max-width: 1240px;
}
</style>
