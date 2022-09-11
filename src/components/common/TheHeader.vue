<script setup lang="ts"></script>

<template>
  <header class="header"></header>
</template>

<style lang="scss" scoped>
.header {
  position: absolute;
  z-index: 800;
  top: 0;
  padding: var(--skr-space-2) var(--skr-space-4);
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--skr-space-4);
  box-sizing: border-box;
  background-color: var(--skr-surface-2);
  box-shadow: var(--skr-shadow-down-s);
  transition: background-color 0.3s;
}
</style>
