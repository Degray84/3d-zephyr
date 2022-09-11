<script setup lang="ts"></script>

<template>
  <div class="base-layout">
    <div v-if="$slots.title" class="base-layout__title">
      <slot name="title" />
    </div>

    <slot />
  </div>
</template>

<style lang="scss" scoped>
.base-layout {
  &__title {
    margin-bottom: var(--skr-space-4);
    font: var(--skr-headline-l);
  }
}
</style>
