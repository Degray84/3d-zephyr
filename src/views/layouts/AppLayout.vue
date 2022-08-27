<script setup lang="ts">
import EmptyLayout from '@/views/layouts/EmptyLayout.vue';
import NavigationBar from '@/components/NavigationBar.vue';

</script>

<template>
    <EmptyLayout>
        <NavigationBar />
        <slot />
    </EmptyLayout>
</template>
