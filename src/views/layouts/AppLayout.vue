<script setup lang="ts">
import EmptyLayout from '@/views/layouts/EmptyLayout.vue';
import TheHeader from '@/components/common/TheHeader.vue';
</script>

<template>
  <EmptyLayout>
    <TheHeader />
    <div class="main-container">
      <RouterView />
    </div>
  </EmptyLayout>
</template>

<style lang="scss" scoped>
  .main-container{
    margin: auto;
    padding: 60px;
    box-sizing: border-box;
    width: 100%;
    max-width: 1240px;
  }
</style>