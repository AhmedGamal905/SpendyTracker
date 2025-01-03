<script setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
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

const handleDelete = async (categoryId) => {
    loading.value = true;
    try {
        await axios.delete(`/api/categories/${categoryId}`);
        categories.value = categories.value.filter((category) => category.id !== categoryId);
        toast.success(`Category was deleted!`);
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.message || 'Something went wrong');
        }
    } finally {
        loading.value = false;
    }
};

const createForm = ref({
    name: '',
});

const isFormValid = computed(() => {
    return createForm.value.name;
});

const createCategory = async () => {
    if (!createForm.value.name) {
        toast.error('Please fill in all fields!');
        return;
    }
    loading.value = true;
    const formData = {
        name: createForm.value.name,
    };
    try {
        const response = await axios.post('/api/categories', formData);
        categories.value.push(response.data.data);
        createForm.value.name = '';
        toast.success('New category saved!');
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.message || 'Something went wrong');
        }
    } finally {
        loading.value = false;
    }
};
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
                    data-hs-overlay="#hs-basic-modal"
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

        <div
            id="hs-basic-modal"
            class="hs-overlay hidden size-full fixed top-0 start-0 z-[60] overflow-x-hidden overflow-y-auto pointer-events-none"
            role="dialog"
            tabindex="-1"
            aria-labelledby="hs-basic-modal-label"
        >
            <div
                class="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 opacity-0 transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto"
            >
                <div
                    class="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto dark:bg-neutral-800 dark:border-neutral-700 dark:shadow-neutral-700/70"
                >
                    <div class="flex justify-between items-center py-3 px-4 border-b dark:border-neutral-700">
                        <h3 id="hs-basic-modal-label" class="font-bold text-gray-800 dark:text-white">
                            Add a new category
                        </h3>
                        <button
                            type="button"
                            class="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                            aria-label="Close"
                            data-hs-overlay="#hs-basic-modal"
                        >
                            <svg
                                class="shrink-0 size-4"
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
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <form>
                        <div class="p-4 overflow-y-auto">
                            <label for="name" class="block text-sm my-2 dark:text-white">Name</label>
                            <div class="relative">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    v-model="createForm.name"
                                    placeholder="Name"
                                    class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                    maxlength="255"
                                    required
                                />
                            </div>
                        </div>
                        <div class="flex justify-end items-center gap-x-2 py-3 px-4 border-t dark:border-neutral-700">
                            <button
                                type="button"
                                class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                data-hs-overlay="#hs-basic-modal"
                            >
                                Close
                            </button>

                            <button
                                type="button"
                                class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                                @click.prevent="createCategory"
                                :disabled="!isFormValid"
                            >
                                Save changes
                            </button>
                        </div>
                    </form>
                </div>
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
                    <div class="pl-5">
                        <deleteButton-component :id="category.id" @delete="handleDelete" />
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
