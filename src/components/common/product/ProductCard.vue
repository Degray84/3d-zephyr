<script setup lang="ts">
defineProps({
  product: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="product-card">{{ $pickLocale(product.name) }}</div>
</template>

<style lang="scss" scoped>
.product-card {
  display: flex;
  flex-direction: column;
  width: min(320px, 100%);
  padding: var(--skr-space-4);
  background-color: var(--skr-surface-3);
  border-radius: var(--skr-border-radius-m);
  box-shadow: var(--skr-shadow-down-s);
}
</style>
