<script setup lang="ts">
import { useThreeInit } from '@/composables/three/three-init';

import { computed, ref, watch } from 'vue';

const props = defineProps(['thumbnail', 'camera', 'model', 'stl']);
const emit = defineEmits([
  'clear',
  'complete',
  'update:thumbnail',
  'update:camera',
  'update:model',
]);

const canvasContainer = ref();

const {
  modelData,
  resetCamera,
  transformMode,
  changeTransformMode,
  saveImage,
  reflectModel,
  centeringModel,
} = useThreeInit(canvasContainer, props.stl);

watch(modelData, ({ camera, model }) => {
  emit('update:camera', camera);
  emit('update:model', model);
});

const isModelReady = computed(() => !!props.thumbnail);

const addPhoto = () => {
  const thumbnail = saveImage();
  emit('update:thumbnail', thumbnail);
};
</script>

<template>
  <q-layout view="hHh lpR fFf" class="bg-white">
    <q-page-sticky position="top-right" :offset="[18, 18]">
      <q-btn round color="primary" icon="exit_to_app" @click="emit('clear')" />
    </q-page-sticky>
    <q-page-sticky position="bottom-left" :offset="[18, 18]">
      <div class="items-center" :class="{ column: $q.screen.lt.sm }">
        <q-btn
          round
          color="primary"
          icon="vertical_align_center"
          class="q-ma-xs"
          @click.stop="centeringModel"
        >
          <q-tooltip> Центрировать </q-tooltip>
        </q-btn>

        <q-btn round color="primary" icon="videocam" class="q-ma-xs" @click.stop="resetCamera">
          <q-tooltip> Сбросить настройки камеры </q-tooltip>
        </q-btn>

        <q-btn round color="primary" label="X" class="q-ma-xs" @click.stop="reflectModel('x')">
          <q-tooltip> Отразить по Х </q-tooltip>
        </q-btn>

        <q-btn round color="primary" label="Y" class="q-ma-xs" @click.stop="reflectModel('y')">
          <q-tooltip> Отразить по Y </q-tooltip>
        </q-btn>

        <q-btn round color="primary" label="Z" class="q-ma-xs" @click.stop="reflectModel('z')">
          <q-tooltip> Отразить по Z </q-tooltip>
        </q-btn>
        <q-btn
          round
          color="primary"
          :icon="transformMode === 'translate' ? '360' : 'games'"
          class="q-ma-xs"
          @click="changeTransformMode"
        >
          <q-tooltip> Изменить тип трансформации </q-tooltip>
        </q-btn>
      </div>
    </q-page-sticky>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <div class="column items-center">
        <q-btn
          color="white"
          size="lg"
          padding="none"
          style="width: 160px; height: 160px"
          @click="addPhoto"
        >
          <q-icon name="photo_camera" color="secondary" size="6em" class="absolute" />
          <q-img :src="props.thumbnail || ''" />
        </q-btn>

        <br />

        <q-btn
          style="width: 160px"
          :disable="!isModelReady"
          :color="isModelReady ? 'positive' : 'secondary'"
          label="Сохранить"
          icon="done"
          @click="emit('complete')"
        />
      </div>
    </q-page-sticky>

    <q-page-container class="fit">
      <div ref="canvasContainer" class="fit flex justify-center items-start q-pa-sm"></div>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss">
.three-view {
  border: 1px solid $grey-4;
  background-color: $grey-3;
  border-radius: 8px;
}
</style>
