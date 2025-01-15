<script setup>
import { onMounted } from 'vue';
import { HSStaticMethods } from 'preline';
import Navbar from '../components/Header/Navbar.vue';
import Footer from '../components/Header/Footer.vue';

onMounted(() => {
    setTimeout(() => {
        HSStaticMethods.autoInit();
    }, 100);
});
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <Navbar />
        <router-view class="flex-1 min-h-screen" />

        <Footer />
    </div>
</template>
