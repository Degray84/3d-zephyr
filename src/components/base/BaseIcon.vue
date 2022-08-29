<script setup lang="ts">
const props = defineProps({
  small: { type: Boolean, default: false },
});

const classes = {
  'base-icon--small': props.small,
};
</script>

<template>
  <span class="base-icon material-icons-outlined" :class="classes"><slot /></span>
</template>

<style lang="scss" scoped>
.base-icon {
  font-size: 24px;

  &--small {
    font-size: 16px;
  }
}
</style>
