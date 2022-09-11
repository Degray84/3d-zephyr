<script setup lang="ts">
import BaseIcon from '../base/BaseIcon.vue';
import { useDeleteProduct } from '@/api/products.api';
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  product: {
    type: Object,
    required: true,
  },
});

const { deleteProduct } = useDeleteProduct();

const handleDelete = () => deleteProduct(props.id);
</script>

<template>
  <div class="product-card">
    <div class="product-card__header">
      <div>
        {{ $pickLocale(product.name) }}
      </div>

      <BaseIcon class="product-card__delete" @click="handleDelete">close</BaseIcon>
    </div>
    
    <div v-if="product.type">
      {{ $t(`product_types.${product.type}`) }}
    </div>
  </div>
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
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__delete {
    cursor: pointer;
  }
}
</style>
