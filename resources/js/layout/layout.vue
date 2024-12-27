<script setup>
import { onMounted } from 'vue';
import { HSStaticMethods } from 'preline';

onMounted(() => {
    setTimeout(() => {
        HSStaticMethods.autoInit();
    }, 100);
});
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <nav-bar />
        <router-view class="flex-1 min-h-screen" />

        <footer-component />
    </div>
</template>
