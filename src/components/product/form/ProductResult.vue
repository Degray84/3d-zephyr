<script setup lang="ts">
import { onMounted } from 'vue';
import { useProducts } from '@/api/products.api';
import type { IProduct } from '@/types';

const { addProduct, loading, error } = useProducts();

const props = defineProps({
  resultData: { type: Object, default: () => ({}) },
  resultFile: { type: File, default: () => ({}) },
  resultThumbnail: { type: String, default: '' },
});

const createImageBlob = (thumbnail: string) => fetch(thumbnail).then(result => result.blob());

const addProductHandler = async () => {
  const imageBlob = await createImageBlob(props.resultThumbnail);

  addProduct(props.resultData as IProduct, imageBlob, props.resultFile);
};

onMounted(() => {
  console.log(props.resultData, props.resultFile, props.resultThumbnail);
});
</script>

<template>
  <q-banner v-if="!!error" rounded dense class="bg-negative text-white q-mb-sm">
    <template #avatar>
      <q-icon name="error" color="error" />
    </template>
    {{ error.message }}
  </q-banner>
  <div class="result-data">
    <q-img
      v-if="resultThumbnail"
      :src="resultThumbnail"
      ratio="1"
      style="max-height: 300px; max-width: 300px"
      class="result-data__thumb"
    ></q-img>

    <q-list separator class="result-data__list">
      <template v-if="resultData.camera">
        <q-item-label header>Данные камеры</q-item-label>
        <q-item>
          <q-item-section>
            <q-list separator>
              <q-item v-for="(value, prop) of resultData.camera" :key="prop" dense>
                <q-item-section>{{ prop }}</q-item-section>
                <q-item-section side>{{ value }}</q-item-section>
              </q-item>
            </q-list>
          </q-item-section>
        </q-item>
      </template>

      <template v-if="resultData.model">
        <q-item-label header>Данные модели</q-item-label>
        <q-item>
          <q-item-section>
            <q-list separator>
              <q-item v-for="(value, prop) of resultData.model" :key="prop" dense>
                <q-item-section>{{ prop }}</q-item-section>
                <q-item-section side>{{ value }}</q-item-section>
              </q-item>
            </q-list>
          </q-item-section>
        </q-item>
      </template>
    </q-list>
  </div>
  <q-btn color="primary" label="Сохранить" @click="addProductHandler" />
  <q-inner-loading
    :showing="!!loading"
    :label="loading || ''"
    label-class="text-teal"
    label-style="font-size: 1.1em"
  />
</template>

<style lang="scss" scoped>
.result-data {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  &__thumb {
    flex-shrink: 1;
    border: 1px solid $grey-5;
    border-radius: 8px;
  }

  &__list {
    flex-grow: 1;
  }
}
</style>
