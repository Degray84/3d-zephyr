<script setup lang="ts">
import { useFetchProducts } from '@/api/products.api';
import { useCardAnimations } from '@/composables/gsap-animation';
import ProductCard from './ProductCard.vue';
const { products } = useFetchProducts();
const { onEnter, onLeave } = useCardAnimations();
</script>

<template>
  <div class="product-list">
    <TransitionGroup :css="false" @enter="onEnter" @leave="onLeave">
      <ProductCard
        v-for="(product, key, index) in products"
        :data-index="index"
        :id="key"
        :key="key"
        :product="product"
      />
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
.product-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--skr-space-4);
}
</style>
