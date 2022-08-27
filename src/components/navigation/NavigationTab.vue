<script setup lang="ts">
defineProps({
    label: String,
    icon: String
});
</script>

<template>
    <div class="navigation-tab">
        <span class="navigation-tab__icon material-icons-outlined">{{ icon }}</span>
        <span class="navigation-tab__label">{{ label }}</span>
    </div>
</template>

<style lang="scss" scoped>
.navigation-tab {
    padding: var(--skr-space-1) var(--skr-space-4);
    display: flex;
    align-items: center;

    &__icon {
        margin-right: var(--skr-space-2);
    }
}
</style>