<script setup lang="ts">
import EmptyLayout from '@/views/layouts/EmptyLayout.vue';
</script>

<template>
  <EmptyLayout>
    <div class="not-found">
      <h1 class="not-found__title">404</h1>
      <RouterLink class="not-found__link" :to="{ name: 'home' }">{{$t('to_home')}}</RouterLink>
    </div>
  </EmptyLayout>
</template>

<style lang="scss" scoped>
.not-found {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__title{
    font: var(--skr-display-l);
    color: var(--skr-text-1);
  }
  &__link{
    font: var(--skr-headline-l);
    text-decoration: none;
    color: var(--skr-text-2);
  }
}
</style>
