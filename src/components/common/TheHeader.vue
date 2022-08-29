<script setup lang="ts">
import NavigationBar from './navigation/TheNavigationBar.vue';
import TheUserDropdown from './TheUserDropdown.vue';
</script>

<template>
  <header class="header">
    <NavigationBar />
    <TheUserDropdown />
  </header>
</template>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  padding: var(--skr-space-2) var(--skr-space-4);
  width: 100%;
  display: flex;
  justify-content: space-between;
  gap: var(--skr-space-4);
  box-sizing: border-box;
  background-color: var(--skr-surface-2);
  transition: background-color 0.3s;
}
</style>
