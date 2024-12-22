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
    <nav-bar />
    <router-view />
    <footer-component />
</template>
