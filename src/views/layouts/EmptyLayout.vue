<script setup lang="ts"></script>

<template>
  <main class="main">
    <slot />
  </main>
</template>

<style type="scss" scoped>
.main {
  height: 100%;
  display: flex;
  overflow: hidden;
}
</style>
