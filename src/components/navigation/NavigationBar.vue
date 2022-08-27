<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router';
import navigationTabs from '@/constants/navigationTabs';
import NavigationTab from './NavigationTab.vue';

const tabs = computed(() => navigationTabs)
</script>

<template>
    <nav class="navigation">
        <RouterLink v-for="{ route, label, icon } in tabs" :key="route" :to="route" class="navigation__link">
            <NavigationTab :label="label" :icon="icon" />
        </RouterLink>
    </nav>
</template>

<style lang="scss" scoped>
.navigation {
    position: fixed;
    padding: var(--skr-space-2) var(--skr-space-4);
    top: 0;
    display: flex;
    gap: var(--skr-space-2);
    width: 100%;
    background-color: var(--skr-base-2);

    &__link {
        position: relative;
        background-color: var(--skr-base-3);
        color: var(--skr-text-2);
        border-radius: var(--skr-border-radius-s);
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