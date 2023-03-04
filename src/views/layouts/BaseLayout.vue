<script setup lang="ts"></script>

<template>
  <q-page-container>
    <q-page class="q-pa-sm">
      <div v-if="$slots.title" class="base-layout__title">
        <slot name="title" />
      </div>

      <slot />
    </q-page>
  </q-page-container>
</template>

<style lang="scss" scoped>
.base-layout {
  &__title {
    margin-bottom: var(--skr-space-4);
    font: var(--skr-headline-l);
  }
}
</style>
