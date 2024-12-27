<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toast-notification';
import { JellyfishLoader } from 'vue3-spinner';

const loading = ref(false);

const toast = useToast();
const categories = ref([]);

onMounted(async () => {
    loading.value = true;
    try {
        const response = await axios.get('/api/categories');
        categories.value = response.data.data;
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.message || 'Something went wrong! Try to refresh');
        }
    } finally {
        loading.value = false;
    }
});
</script>
<template>
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
        <JellyfishLoader :color="'#FFFFFF'" :scale="2" />
    </div>
    <div v-else>
        <div class="flex flex-wrap justify-between items-center gap-2 mx-2">
            <div>
                <h1 class="text-lg md:text-xl font-semibold text-stone-800 dark:text-neutral-200">Your categories</h1>
            </div>
            <div class="flex justify-end items-center gap-x-2">
                <button
                    type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-green-500"
                    data-hs-overlay="#hs-pro-edmad"
                >
                    <svg
                        class="hidden sm:block shrink-0 size-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                    </svg>
                    New category
                </button>
            </div>
        </div>
        <div class="overflow-x-hidden w-full flex items-start justify-center">
            <div v-if="categories.length === 0" class="text-center py-6">
                <p class="text-xl font-semibold text-gray-500 dark:text-neutral-400">Nothing to show here</p>
            </div>
            <ul v-else role="list" class="w-1/2 divide-y divide-gray-100">
                <li v-for="category in categories" :key="category.id" class="flex justify-between items-center py-5">
                    <router-link
                        :to="{ name: 'CategoryExpenses', params: { id: category.id } }"
                        class="flex items-center gap-x-4 w-full"
                    >
                        <div class="flex items-center">
                            <p class="text-xl font-semibold text-white">{{ category.name }}</p>
                            <span class="text-gray-400 ml-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M5 12h14M12 5l7 7-7 7"
                                    />
                                </svg>
                            </span>
                        </div>
                    </router-link>
                    <p class="mt-1 text-xs text-gray-400 whitespace-nowrap">{{ category.created_at }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>
