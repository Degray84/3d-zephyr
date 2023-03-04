<script setup lang="ts">
import { useFetchProducts } from '@/api/products.api';
import { useCardAnimations } from '@/composables/gsap-animation';
import ProductCard from './ProductCard.vue';
const { products } = useFetchProducts();
const { onEnter, onLeave } = useCardAnimations();
</script>

<template>
  <div class="row">
    <TransitionGroup :css="false" @enter="onEnter" @leave="onLeave">
      <ProductCard
        v-for="(product, key, index) in products"
        :data-index="index"
        :id="key"
        :key="key"
        :product="product"
        class="col-3"
      />
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped></style>
