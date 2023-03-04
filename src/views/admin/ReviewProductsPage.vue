<script setup lang="ts">
import { useProducts } from '@/api/products.api';
import { useTitle } from '@vueuse/core';
import { computed, onMounted, ref, watch } from 'vue';

useTitle('3d-zephyr | Обзор товаров');

const selected = ref([]);

const { products, loading, deleteProduct } = useProducts();

const productList = computed(() => {
  return Object.entries(products.value || []).map(([id, value]) => ({ ...value, id }));
});

const columns = [
  {
    name: 'id',
    label: 'id',
    field: row => row.id,
  },
  {
    name: 'ruName',
    label: 'Название',
    field: row => row.ruName,
  },
];

const removeProducts = () => {
  deleteProduct(selected.value).finally(() => (selected.value = []));
};
</script>

<template>
  <q-page-container>
    <q-page class="q-pa-sm">
      <q-table
        v-model:selected="selected"
        :rows="productList"
        :columns="columns"
        :pagination="{ rowsPerPage: 20 }"
        :loading="loading"
        selection="multiple"
        row-key="id"
      >
        <template #top>
          <q-btn
            v-if="selected.length"
            color="primary"
            :disable="loading"
            label="Удалить продукты"
            @click="removeProducts"
          />
        </template>
      </q-table>
    </q-page>
  </q-page-container>
</template>

<style lang="scss" scoped>
.double {
  display: flex;
  gap: var(--skr-space-4);
}
</style>
