<script setup lang="ts">
import { useTitle } from '@vueuse/core';
import { computed, onMounted, ref, watch } from 'vue';
import { useForm } from 'vee-validate';
import ProductData from '@/components/product/form/ProductData.vue';
import ProductModel from '@/components/product/form/ProductModel.vue';
import ProductResult from '@/components/product/form/ProductResult.vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const props = defineProps({ query: { type: Object, default: () => ({}) } });

useTitle('3d-zephyr | Создание продукта');

const infoSchema = {
  ruName: 'required|alpha|min:2',
  enName: '',
  type: 'required',
  categories: 'required',
  cutDownDepth: 'required|integer',
  cutDownLength: 'required|integer',
  cutDownWidth: 'required|integer',
};

const modelSchema = {
  thumbnail: 'required',
  stl: 'required',
  camera: 'required',
  model: 'required',
};

const {
  errors: infoErrors,
  useFieldModel: useInfo,
  values: infoValues,
  validate: validateInfo,
} = useForm({
  validationSchema: infoSchema,
  initialValues: {
    ruName: props.query.ruName,
    enName: props.query.enName,
    type: props.query.type,
    categories: props.query.categories,
    cutDownDepth: props.query.cutDownDepth,
    cutDownLength: props.query.cutDownLength,
    cutDownWidth: props.query.cutDownWidth,
  },
});

const [ruName, enName, type, categories, cutDownDepth, cutDownLength, cutDownWidth] = useInfo([
  'ruName',
  'enName',
  'type',
  'categories',
  'cutDownDepth',
  'cutDownLength',
  'cutDownWidth',
]);

const {
  errors: modelErrors,
  useFieldModel: useModel,
  values: modelValues,
  validate: validateModel,
} = useForm({
  validationSchema: modelSchema,
});

const resultData = computed(() => ({
  ...infoValues,
  model: model.value,
  camera: camera.value,
  modelName: stl.value.name,
}));

const [thumbnail, stl, camera, model] = useModel(['thumbnail', 'stl', 'camera', 'model']);

const step = ref(+props.query.step || 1);

const isModelValid = ref(false);
const isInfoValid = ref(false);

watch(step, () => {
  router.push({ query: { ...route.query, step: step.value } });
});

watch(infoValues, () => {
  router.push({ query: { ...route.query, ...infoValues } });
  validateInfo().then(({ valid }) => (isInfoValid.value = valid));
});

watch(modelValues, () => {
  validateModel().then(({ valid }) => (isModelValid.value = valid));
});

watch(infoErrors, () => console.log(infoErrors.value));
onMounted(() => {
  console.log('modelErrors', modelErrors.value, infoErrors.value);
  if (Object.values(infoValues).every(Boolean)) {
    validateInfo().then(({ valid }) => (isInfoValid.value = valid));
  }
  if (Object.values(modelValues).every(Boolean)) {
    validateModel().then(({ valid }) => (isModelValid.value = valid));
  }
});
</script>

<template>
  <q-page-container>
    <q-page class="q-pa-sm">
      <q-stepper
        ref="stepper"
        v-model="step"
        keep-alive
        flat
        bordered
        header-nav
        animated
        :contracted="$q.screen.lt.md"
      >
        <q-step
          :name="1"
          title="Параметры продукта"
          icon="view_in_ar"
          :error="!isModelValid"
          :done="isModelValid"
        >
          <ProductModel
            v-model:thumbnail="thumbnail"
            v-model:camera="camera"
            v-model:model="model"
            v-model:stl="stl"
            :errors="modelErrors"
          />
          <ProductData
            v-if="isModelValid"
            v-model:ruName="ruName"
            v-model:enName="enName"
            v-model:type="type"
            v-model:categories="categories"
            v-model:cutDownDepth="cutDownDepth"
            v-model:cutDownLength="cutDownLength"
            v-model:cutDownWidth="cutDownWidth"
            :errors="infoErrors"
          />
        </q-step>

        <q-step
          :name="2"
          title="Проверка и отправка данных"
          icon="send"
          :disable="!isModelValid || !isInfoValid"
        >
          <ProductResult
            :result-data="resultData"
            :result-thumbnail="thumbnail"
            :result-file="stl"
          />
        </q-step>
      </q-stepper>
    </q-page>
  </q-page-container>
</template>

<style lang="scss" scoped>
.double {
  display: flex;
  gap: var(--skr-space-4);
}
</style>
