<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import ModelEditor from '@/components/product/form/ModelEditor.vue';
import { useProducts } from '@/api/products.api';

defineProps(['thumbnail', 'camera', 'model', 'stl', 'errors']);
const emit = defineEmits([
  'update:thumbnail',
  'update:camera',
  'update:model',
  'update:stl',
  'isValid',
]);

const { checkStl } = useProducts();

const error = ref();
const stl: Ref<File | null> = ref(null);
const thumbnail: Ref<string | null> = ref(null);
const camera = ref(null);
const model = ref(null);

const dialog = ref(false);

const clearModel = () => (stl.value = null);

watch(stl, () => {
  if (stl.value) {
    checkStl(stl.value.name)
      .then(() => {
        dialog.value = true;
        error.value = null;
      })
      .catch(err => {
        stl.value = null;
        error.value = err;
      });
  } else {
    resetForm();
  }

  emit('update:stl', stl.value);
});
watch(thumbnail, thumbnail => emit('update:thumbnail', thumbnail));
watch(camera, camera => emit('update:camera', camera));
watch(model, model => emit('update:model', model));

const resetForm = () => {
  thumbnail.value = null;
  camera.value = null;
  model.value = null;

  dialog.value = false;
};
</script>

<template>
  <form class="full-height">
    <q-banner v-if="!!error" rounded dense class="bg-negative text-white q-mb-sm">
      <template #avatar>
        <q-icon name="error" color="error" />
      </template>
      {{ error.message }}
    </q-banner>

    <q-file
      v-model="stl"
      accept=".stl"
      outlined
      clearable
      :label="$t('forms.modelName')"
      :error-message="errors.stl"
      :error="!!stl && !!errors.stl"
      class="q-mb-md"
    >
      <template #prepend>
        <q-icon name="attach_file" />
      </template>
      <template v-if="stl" #after>
        <q-btn round dense flat icon="edit" @click="dialog = true" />
      </template>
    </q-file>

    <q-dialog v-model="dialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <ModelEditor
        v-if="stl"
        v-model:thumbnail="thumbnail"
        v-model:camera="camera"
        v-model:model="model"
        :stl="stl"
        @clear="clearModel"
        @complete="dialog = false"
      />
    </q-dialog>
  </form>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 500px;
}
</style>
