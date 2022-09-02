<script setup lang="ts">
import { fetchProducts } from '@/api/products.api';
import gsap from 'gsap';

import { onMounted, ref } from 'vue';
import ProductCard from './ProductCard.vue';

const products = ref();
const onEnter = (el: any, done: any) => {
  gsap.from(el, {
    opacity: 0,
    y: -50,
    duration: 0.3,
    delay: el?.dataset.index * 0.05,
    onComplete: done,
  });
};

onMounted(() => {
  fetchProducts().then(result => (products.value = result));
});
</script>

<template>
  <div class="product-list">
    <TransitionGroup :css="false" @enter="onEnter">
      <ProductCard
        v-for="(product, index) in products"
        :data-index="index"
        :key="product.name.ru"
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
