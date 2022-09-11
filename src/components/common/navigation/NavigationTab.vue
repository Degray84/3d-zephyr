<script setup lang="ts">
import BaseIcon from '@/components/base/BaseIcon.vue';
defineProps({
  label: { type: String, required: true },
  icon: { type: String },
  mini: { type: Boolean },
});
</script>

<template>
  <div class="navigation-tab" :class="{ 'navigation-tab--mini': mini }">
    <BaseIcon class="navigation-tab__icon">{{ icon }}</BaseIcon>
    <span class="navigation-tab__label">{{ $t(label) }}</span>
  </div>
</template>

<style lang="scss" scoped>
.navigation-tab {
  padding: var(--skr-space-1);
  display: flex;
  align-items: center;

  &__icon {
    margin-right: var(--skr-space-2);
  }

  &--mini {
    .navigation-tab__icon {
      margin-right: 0;
    }

    .navigation-tab__label {
      display: none;
    }
  }
}
</style>
