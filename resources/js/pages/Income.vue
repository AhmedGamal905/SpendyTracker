<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useToast } from 'vue-toast-notification';
import { JellyfishLoader } from 'vue3-spinner';

const loading = ref(false);
const toast = useToast();
const incomes = ref([]);

onMounted(async () => {
    loading.value = true;
    try {
        const response = await axios.get('/api/incomes');
        incomes.value = response.data.data;
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

    <div v-else class="overflow-x-hidden w-full">
        <div class="flex flex-wrap justify-between items-center gap-2 mx-2">
            <div>
                <h1 class="text-lg md:text-xl font-semibold text-stone-800 dark:text-neutral-200">Your incomes</h1>
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
                    New income
                </button>
            </div>
        </div>

        <div v-if="incomes.length === 0" class="text-center py-6">
            <p class="text-xl font-semibold text-gray-500 dark:text-neutral-400">Nothing to show here</p>
        </div>

        <table v-else class="min-w-full divide-y divide-gray-200 dark:divide-neutral-700 m-2">
            <thead>
                <tr
                    class="border-t border-gray-200 divide-x divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700"
                >
                    <th scope="col">
                        <button
                            id="hs-pro-id"
                            type="button"
                            class="px-4 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 dark:text-neutral-500 dark:focus:bg-neutral-700"
                            aria-haspopup="menu"
                            aria-expanded="false"
                            aria-label="Dropdown"
                        >
                            Income ID
                        </button>
                    </th>
                    <th scope="col" class="max-w-[250px]">
                        <button
                            id="hs-pro-name"
                            type="button"
                            class="px-4 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 dark:text-neutral-500 dark:focus:bg-neutral-700"
                            aria-haspopup="menu"
                            aria-expanded="false"
                            aria-label="Dropdown"
                        >
                            Source
                        </button>
                    </th>
                    <th scope="col" class="max-w-[250px]">
                        <button
                            id="hs-pro-time"
                            type="button"
                            class="px-4 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 dark:text-neutral-500 dark:focus:bg-neutral-700"
                            aria-haspopup="menu"
                            aria-expanded="false"
                            aria-label="Dropdown"
                        >
                            Amount
                        </button>
                    </th>
                    <th scope="col" class="max-w-[250px]">
                        <button
                            id="hs-pro-time"
                            type="button"
                            class="px-4 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 dark:text-neutral-500 dark:focus:bg-neutral-700"
                            aria-haspopup="menu"
                            aria-expanded="false"
                            aria-label="Dropdown"
                        >
                            Description
                        </button>
                    </th>
                    <th scope="col" class="max-w-[250px]">
                        <button
                            id="hs-pro-time"
                            type="button"
                            class="px-4 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 dark:text-neutral-500 dark:focus:bg-neutral-700"
                            aria-haspopup="menu"
                            aria-expanded="false"
                            aria-label="Dropdown"
                        >
                            Added
                        </button>
                    </th>
                    <th scope="col" class="max-w-[250px]">
                        <button
                            id="hs-pro-update"
                            type="button"
                            class="px-4 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 dark:text-neutral-500 dark:focus:bg-neutral-700"
                            aria-haspopup="menu"
                            aria-expanded="false"
                            aria-label="Dropdown"
                        >
                            Update
                        </button>
                    </th>
                    <th scope="col" class="max-w-[250px]">
                        <button
                            id="hs-pro-delete"
                            type="button"
                            class="px-4 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 dark:text-neutral-500 dark:focus:bg-neutral-700"
                            aria-haspopup="menu"
                            aria-expanded="false"
                            aria-label="Dropdown"
                        >
                            Delete
                        </button>
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-neutral-700">
                <tr v-for="income in incomes" :key="income.id" class="divide-x divide-gray-200 dark:divide-neutral-700">
                    <td class="size-px whitespace-nowrap px-4 py-1">
                        <div class="w-full flex items-center gap-x-3">
                            <span class="text-sm font-medium text-gray-800 dark:text-neutral-200">{{ income.id }}</span>
                        </div>
                    </td>
                    <td class="size-px whitespace-nowrap px-4 py-1">
                        <div class="w-full flex items-center gap-x-3">
                            <span class="text-sm font-medium text-gray-800 dark:text-neutral-200">
                                {{ income.source }}
                            </span>
                        </div>
                    </td>
                    <td class="size-px whitespace-nowrap px-4 py-1">
                        <div class="w-full flex items-center gap-x-3">
                            <span class="text-sm font-medium text-gray-800 dark:text-neutral-200">
                                ${{ income.amount }}
                            </span>
                        </div>
                    </td>
                    <td class="size-px whitespace-nowrap px-4 py-1">
                        <div class="w-full flex items-center gap-x-3">
                            <span class="text-sm font-medium text-gray-800 dark:text-neutral-200">
                                {{ income.description }}
                            </span>
                        </div>
                    </td>
                    <td class="size-px whitespace-nowrap px-4 py-1">
                        <div class="w-full flex items-center gap-x-3">
                            <span class="text-sm font-medium text-gray-800 dark:text-neutral-200">
                                {{ income.created_at }}
                            </span>
                        </div>
                    </td>
                    <td class="size-px whitespace-nowrap px-4 py-1">
                        <form>
                            <button
                                type="submit"
                                class="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-stone-200 bg-white text-green-500 shadow-sm hover:bg-stone-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-green-500 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                            >
                                Update
                            </button>
                        </form>
                    </td>
                    <td class="size-px whitespace-nowrap px-4 py-1">
                        <form>
                            <button
                                type="submit"
                                class="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-stone-200 bg-white text-red-500 shadow-sm hover:bg-stone-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-red-500 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                            >
                                Delete
                            </button>
                        </form>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
