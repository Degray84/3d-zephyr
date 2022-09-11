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
  <nav class="navigation" :class="{ 'navigation--mini': mini }">
    <TheUserDropdown />
    <RouterLink
      v-for="{ route, label, icon } in tabs"
      :key="route"
      :to="route"
      class="navigation__link"
    >
      <NavigationTab :mini="mini" :label="label" :icon="icon" />
    </RouterLink>
  </nav>
</template>

<style lang="scss" scoped>
.navigation {
  padding: 50px 0 0 0;
  height: 100%;
  width: 50px;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  gap: var(--skr-space-2);
  background-color: var(--skr-base-2);
  box-shadow: var(--skr-shadow-down-s);

  &__link {
    position: relative;
    background-color: var(--skr-base-3);
    color: var(--skr-text-2);
    border-radius: var(--skr-border-radius-l);
    font: var(--skr-title-m);
    text-transform: capitalize;
    text-decoration: none;
    transition: background-color 0.3s, color 0.3s;

    &.router-link-active {
      background-color: var(--skr-base-4);
      color: var(--skr-text-1);
    }

    &:hover {
      background-color: var(--skr-base-5);
      color: var(--skr-text-1);
    }
  }
}
</style>
