<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useAddProducts } from '@/api/products.api';
import { productTypes } from '@/constants/productTypes';
import BaseLayout from '../layouts/BaseLayout.vue';
import i18n from '@/plugins/vue-i18n';

const types = computed(() =>
  Object.keys(productTypes).map(type => ({
    value: type,
    label: i18n.global.t(`product_types.${type}`),
  }))
);

const form = reactive({
  name: { ru: '', en: '' },
  type: types.value[0].value,
});

watch(
  form,
  () => {
    console.log(form);
  },
  { deep: true }
);

const { addProduct } = useAddProducts();

const handleAddProduct = () => addProduct(form);
</script>

<template>
  <BaseLayout>
    <template #title>{{ $t('forms.add_product.title') }}</template>
    <q-form ref="form" :model="form" :rules="{}">
      <q-form-item :label="$t('forms.add_product.product_name_ru')" prop="name">
        <q-input v-model="form.name.ru" type="text" />
      </q-form-item>

      <q-form-item :label="$t('forms.add_product.product_name_en')" prop="name">
        <q-select v-model="form.type">
          <q-option v-for="item in types" :key="item" :label="item.label" :value="item" />
        </q-select>
      </q-form-item>

      <q-button @click="handleAddProduct">{{ $t('common.buttons.send') }}</q-button>
      <q-button type="icon">
        <span class="material-icons-outlined">home</span>
      </q-button>
    </q-form>
  </BaseLayout>
</template>

<style lang="scss" scoped>
.double {
  display: flex;
  gap: var(--skr-space-4);
}
</style>
