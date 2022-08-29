<script setup lang="ts">
import EmptyLayout from '@/views/layouts/EmptyLayout.vue';
import TheHeader from '@/components/common/TheHeader.vue';
</script>

<template>
  <EmptyLayout>
    <TheHeader />
    <RouterView />
  </EmptyLayout>
</template>
