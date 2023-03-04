<script setup lang="ts">
import { ref } from 'vue';
import { useDeleteProduct } from '@/api/products.api';
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  product: {
    type: Object,
    required: true,
  },
});
const expanded = ref(false);

const { deleteProduct } = useDeleteProduct();

const handleDelete = () => deleteProduct(props.id);
</script>

<template>
  <q-card class="my-card" flat bordered>
    <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" />

    <q-card-section>
      <div class="text-overline text-orange-9">Overline</div>
      <div class="text-h5 q-mt-sm q-mb-xs">Title</div>
      <div class="text-caption text-grey">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua.
      </div>
    </q-card-section>

    <q-card-actions>
      <q-btn flat color="dark" label="Share" />
      <q-btn flat color="primary" label="Book" />

      <q-space />

      <q-btn
        color="grey"
        round
        flat
        dense
        :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        @click="expanded = !expanded"
      />
    </q-card-actions>

    <q-slide-transition>
      <div v-show="expanded">
        <q-separator />
        <q-card-section class="text-subitle2">
          {{ lorem }}
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<style lang="scss" scoped>
.product-card {
  display: flex;
  flex-direction: column;
  width: min(320px, 100%);
  padding: var(--skr-space-4);
  background-color: var(--skr-surface-3);
  border-radius: var(--skr-border-radius-m);
  box-shadow: var(--skr-shadow-down-s);
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__delete {
    cursor: pointer;
  }
}
</style>
