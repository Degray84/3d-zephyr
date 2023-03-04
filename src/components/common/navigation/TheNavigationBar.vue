<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import navigationTabs from '@/constants/navigationTabs';
import NavigationTab from './NavigationTab.vue';
import TheUserDropdown from '@/components/common/TheUserDropdown.vue';
import { useConfig } from '@/stores/config';
import { storeToRefs } from 'pinia';

defineProps({
  mini: {
    type: Boolean,
    default: false,
  },
});

const configStore = useConfig();
const { pages } = storeToRefs(configStore);

const tabs = computed(() =>
  navigationTabs.filter(({ label }) => (pages.value ? pages.value[label] : false))
);
</script>

<template>
  <!-- <TheUserDropdown /> -->
  <q-scroll-area class="fit">
    <q-list>
      <template v-for="({ route, label, icon, separator }, index) in tabs" :key="index">
        <q-item clickable :to="{ name: route }">
          <q-item-section avatar>
            <q-icon :name="icon" />
          </q-item-section>
          <q-item-section>
            {{ $t(`navigation.${label}`) }}
          </q-item-section>
        </q-item>
        <q-separator v-if="separator" :key="'sep' + index" />
      </template>
    </q-list>
  </q-scroll-area>
</template>
