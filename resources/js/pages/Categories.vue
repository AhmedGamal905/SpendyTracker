<script setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useToast } from 'vue-toast-notification';
import { JellyfishLoader } from 'vue3-spinner';
import Delete from '../components/Buttons/Delete.vue';

const loading = ref(false);
const categories = ref([]);
const createForm = ref({ name: '' });
const updateForm = ref({ id: '', name: '' });
const showUpdateForm = ref(false);
const showCreateForm = ref(false);

const toast = useToast();

const isCreateFormValid = computed(() => createForm.value.name);
const isUpdateFormValid = computed(() => updateForm.value.name);

onMounted(() => {
    loading.value = true;
    axios
        .get('/api/categories')
        .then((response) => {
            categories.value = response.data.data;
        })
        .finally(() => {
            loading.value = false;
        });
});

const handleDelete = (categoryId) => {
    loading.value = true;
    axios
        .delete(`/api/categories/${categoryId}`)
        .then(() => {
            categories.value = categories.value.filter((category) => category.id !== categoryId);
            toast.success('Category was deleted!');
        })
        .finally(() => {
            loading.value = false;
        });
};

const toggleCreateForm = () => {
    showCreateForm.value = !showCreateForm.value;
    showUpdateForm.value = false;
};

const prepareFormForUpdate = (category) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateForm.value.name = category.name;
    updateForm.value.id = category.id;
    showUpdateForm.value = true;
    showCreateForm.value = false;
};

const createCategory = () => {
    if (!createForm.value.name) {
        toast.error('Please fill in all fields!');
        return;
    }

    loading.value = true;
    const formData = { name: createForm.value.name };

    axios
        .post('/api/categories', formData)
        .then((response) => {
            categories.value.push(response.data.data);
            createForm.value.name = '';
            showCreateForm.value = false;
            toast.success('New category saved!');
        })
        .finally(() => {
            loading.value = false;
        });
};

const updateCategory = () => {
    if (!updateForm.value.name || !updateForm.value.id) {
        toast.error('Please fill in all fields or select a valid resource to update!');
        return;
    }

    loading.value = true;
    const formData = { name: updateForm.value.name };

    axios
        .put(`/api/categories/${updateForm.value.id}`, formData)
        .then((response) => {
            categories.value = categories.value.map((category) =>
                category.id === updateForm.value.id ? response.data.data : category,
            );
            updateForm.value.name = '';
            updateForm.value.id = '';
            showUpdateForm.value = false;
            toast.success('Category updated!');
        })
        .finally(() => {
            loading.value = false;
        });
};
</script>

<template>
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
        <JellyfishLoader :color="'#FFFFFF'" :scale="2" />
    </div>
    <div v-else>
        <div class="p-10" v-if="showUpdateForm">
            <form @submit.prevent="updateCategory">
                <label for="name" class="block text-sm my-2 dark:text-white">New name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    v-model="updateForm.name"
                    :placeholder="updateForm.name || 'New category name'"
                    class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    maxlength="255"
                    required
                />
                <button
                    type="button"
                    class="my-5 py-2 px-3 block w-full text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    @click.prevent="updateCategory"
                    :disabled="!isUpdateFormValid"
                >
                    Save new changes
                </button>
            </form>
        </div>
        <div class="flex flex-wrap justify-between items-center gap-2 mx-2">
            <div>
                <h1 class="text-lg md:text-xl font-semibold text-stone-800 dark:text-neutral-200">Your categories</h1>
            </div>
            <div class="flex justify-end items-center gap-x-2">
                <button
                    type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-green-500"
                    @click.prevent="toggleCreateForm"
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
        <div class="p-10" v-if="showCreateForm">
            <form @submit.prevent="createCategory">
                <label for="name" class="block text-sm my-2 dark:text-white">New category</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    v-model="createForm.name"
                    placeholder="New category name"
                    class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    maxlength="255"
                    required
                />
                <button
                    type="button"
                    class="my-5 py-2 px-3 block w-full text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    @click.prevent="createCategory"
                    :disabled="!isCreateFormValid"
                >
                    Save
                </button>
            </form>
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
                    <p class="mt-1 px-5 text-xs text-gray-400 whitespace-nowrap">{{ category.created_at }}</p>
                    <button
                        type="submit"
                        @click.prevent="prepareFormForUpdate(category)"
                        class="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-stone-200 bg-white text-green-500 shadow-sm hover:bg-stone-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-green-500 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                    >
                        Update
                    </button>
                    <div class="pl-5">
                        <Delete :id="category.id" @delete="handleDelete" />
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
