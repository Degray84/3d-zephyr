<script setup lang="ts">
import BaseIcon from '@/components/base/BaseIcon.vue';
defineProps({
  label: { type: String, required: true },
  icon: { type: String },
});
</script>

<template>
  <div class="navigation-tab">
    <BaseIcon class="navigation-tab__icon">{{ icon }}</BaseIcon>
    <span class="navigation-tab__label">{{ $t(label) }}</span>
  </div>
</template>

<style lang="scss" scoped>
.navigation-tab {
  padding: var(--skr-space-1) var(--skr-space-4);
  display: flex;
  align-items: center;

  &__icon {
    margin-right: var(--skr-space-2);
  }
}
</style>
