<script setup lang="ts">
import EmptyLayout from '@/views/layouts/EmptyLayout.vue';
import TheHeader from '@/components/common/TheHeader.vue';
import NavigationBar from '@/components/common/navigation/TheNavigationBar.vue';
</script>

<template>
  <EmptyLayout>
    <TheHeader />
    <NavigationBar :mini="true" />
    <div class="main-container">
      <slot />
    </div>
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
