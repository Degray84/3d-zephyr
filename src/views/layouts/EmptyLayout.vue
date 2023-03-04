<script setup lang="ts"></script>

<template>
  <div class="main">
    <slot />
  </div>
</template>

<style type="scss" scoped>
.main {
  height: 100%;
  display: flex;
  overflow: hidden;
  padding: var(--plx-space-4);
}
</style>
