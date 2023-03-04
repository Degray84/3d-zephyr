<script setup lang="ts">
import { computed } from 'vue';
import { productTypes } from '@/constants/productTypes';
import i18n from '@/plugins/vue-i18n';

defineProps([
  'ruName',
  'enName',
  'type',
  'categories',
  'cutDownDepth',
  'cutDownLength',
  'cutDownWidth',
  'errors',
]);

defineEmits([
  'update:ruName',
  'update:enName',
  'update:type',
  'update:categories',
  'update:cutDownDepth',
  'update:cutDownLength',
  'update:cutDownWidth',
  'isValid',
]);

const types = computed(() =>
  Object.keys(productTypes).map(type => ({
    value: type,
    label: i18n.global.t(`product_types.${type}`),
  }))
);
</script>

<template>
  <form>
    <q-input
      :model-value="ruName"
      :label="$t('forms.ruName')"
      bottom-slots
      :error-message="errors.ruName"
      :error="!!errors.ruName"
      @update:model-value="value => $emit('update:ruName', value)"
    />
    <q-input
      :model-value="enName"
      :label="$t('forms.enName')"
      bottom-slots
      :error-message="errors.enName"
      :error="enName && !!errors.enName"
      @update:model-value="value => $emit('update:enName', value)"
    />
    <q-select
      :model-value="type"
      :label="$t('forms.type')"
      :options="types"
      bottom-slots
      options-dense
      emit-value
      map-options
      :error-message="errors.type"
      :error="type && !!errors.type"
      @update:model-value="value => $emit('update:type', value)"
    >
      <template #prepend>
        <q-icon name="event" />
      </template>
    </q-select>
    <q-select
      :model-value="categories"
      :label="$t('forms.categories')"
      :options="types"
      multiple
      use-input
      fill-input
      input-debounce="0"
      bottom-slots
      options-dense
      emit-value
      map-options
      use-chips
      new-value-mode="add-unique"
      :error-message="errors.categories"
      :error="categories && !!errors.categories"
      @update:model-value="value => $emit('update:categories', value)"
    >
      <template #prepend>
        <q-icon name="event" />
      </template>
    </q-select>
    <q-input
      :model-value="cutDownWidth"
      :label="$t('forms.cutDownWidth')"
      type="number"
      bottom-slots
      :error-message="errors.cutDownWidth"
      :error="cutDownWidth && !!errors.cutDownWidth"
      @update:model-value="value => $emit('update:cutDownWidth', value)"
    />
    <q-input
      :model-value="cutDownLength"
      :label="$t('forms.cutDownLength')"
      type="number"
      bottom-slots
      :error-message="errors.cutDownLength"
      :error="cutDownLength && !!errors.cutDownLength"
      @update:model-value="value => $emit('update:cutDownLength', value)"
    />
    <q-input
      :model-value="cutDownDepth"
      :label="$t('forms.cutDownDepth')"
      type="number"
      bottom-slots
      :error-message="errors.cutDownDepth"
      :error="cutDownDepth && !!errors.cutDownDepth"
      @update:model-value="value => $emit('update:cutDownDepth', value)"
    />
  </form>
</template>

<style lang="scss" scoped>
.double {
  display: flex;
  gap: var(--skr-space-4);
}
</style>
