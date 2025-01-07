<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';
import { useToast } from 'vue-toast-notification';
import { JellyfishLoader } from 'vue3-spinner';

const loading = ref(false);
const incomes = ref([]);
const nextPage = ref('');
const showUpdateForm = ref(false);
const showCreateForm = ref(false);
const createForm = ref({
    source: '',
    amount: '',
    description: '',
});

const updateForm = ref({
    id: '',
    source: '',
    amount: '',
    description: '',
});

const toast = useToast();

const isCreateFormValid = computed(() => {
    return createForm.value.source && createForm.value.amount && createForm.value.description;
});
const isUpdateFormValid = computed(() => {
    return updateForm.value.source && updateForm.value.amount && updateForm.value.description;
});

onMounted(async () => {
    loading.value = true;
    try {
        const response = await axios.get('/api/incomes');
        incomes.value = response.data.data;
        nextPage.value = response.data.links.next;
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.message || 'Something went wrong! Try to refresh');
        }
    } finally {
        loading.value = false;
    }
});

const handleDelete = async (incomeId) => {
    loading.value = true;
    try {
        await axios.delete(`/api/incomes/${incomeId}`);
        incomes.value = incomes.value.filter((income) => income.id !== incomeId);
        toast.success(`The selected income was deleted!`);
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.message || 'Something went wrong');
        }
    } finally {
        loading.value = false;
    }
};

const createIncome = async () => {
    if (!createForm.value.source || !createForm.value.amount || !createForm.value.description) {
        toast.error('Please fill in all fields!');
        return;
    }
    loading.value = true;
    const formData = {
        source: createForm.value.source,
        amount: createForm.value.amount,
        description: createForm.value.description,
    };
    try {
        const response = await axios.post('/api/incomes', formData);
        incomes.value.push(response.data.data);
        createForm.value.source = '';
        createForm.value.amount = '';
        createForm.value.description = '';
        showCreateForm.value = false;
        toast.success('New income saved!');
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.message || 'Something went wrong');
        }
    } finally {
        loading.value = false;
    }
};

const loadMore = async () => {
    loading.value = true;
    try {
        if (nextPage.value) {
            const response = await axios.get(`${nextPage.value}`);
            incomes.value.push(...response.data.data);
            nextPage.value = response.data.links.next;
        } else {
            toast.error('no next page');
        }
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.message || 'Something went wrong! Try to refresh');
        }
    } finally {
        loading.value = false;
    }
};

const toggleCreateForm = () => {
    showCreateForm.value = !showCreateForm.value;
    showUpdateForm.value = false;
};

const prepareFormForUpdate = (income) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateForm.value.id = income.id;
    updateForm.value.source = income.source;
    updateForm.value.amount = income.amount;
    updateForm.value.description = income.description;
    showUpdateForm.value = true;
    showCreateForm.value = false;
};

const updateIncome = async () => {
    if (!updateForm.value.id || !updateForm.value.source || !updateForm.value.amount || !updateForm.value.description) {
        toast.error('Please fill in all fields or select a valid resource to update!');
        return;
    }

    loading.value = true;

    const formData = {
        source: updateForm.value.source,
        amount: updateForm.value.amount,
        description: updateForm.value.description,
    };

    try {
        const response = await axios.put(`/api/incomes/${updateForm.value.id}`, formData);
        incomes.value = incomes.value.map((income) =>
            income.id === updateForm.value.id ? response.data.data : income,
        );
        updateForm.value.id = '';
        updateForm.value.source = '';
        updateForm.value.amount = '';
        updateForm.value.description = '';
        showUpdateForm.value = false;
        toast.success('Income updated!');
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

    <div v-else class="overflow-x-hidden w-full">
        <div v-if="showUpdateForm" class="p-10">
            <form>
                <label for="source" class="block text-sm my-2 dark:text-white">source</label>
                <input
                    type="text"
                    id="source"
                    name="source"
                    v-model="updateForm.source"
                    :placeholder="updateForm.source || 'New expense source'"
                    class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    maxlength="255"
                    required
                />
                <label for="amount" class="block text-sm my-2 dark:text-white">Amount</label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    v-model="updateForm.amount"
                    :placeholder="updateForm.amount || '00.0'"
                    class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    maxlength="255"
                    min="0"
                    required
                />
                <label for="description" class="block text-sm my-2 dark:text-white">Description</label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    v-model="updateForm.description"
                    :placeholder="updateForm.description || 'New expense description'"
                    class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    maxlength="255"
                    required
                />
                <button
                    type="button"
                    class="my-5 py-2 px-3 block w-full text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    @click.prevent="updateIncome"
                    :disabled="!isUpdateFormValid"
                >
                    Save new changes
                </button>
            </form>
        </div>
        <div class="flex flex-wrap justify-between items-center gap-2 mx-2">
            <div>
                <h1 class="text-lg md:text-xl font-semibold text-stone-800 dark:text-neutral-200">Your incomes</h1>
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
                    New income
                </button>
            </div>
        </div>

        <div v-if="showCreateForm" class="p-10">
            <form>
                <label for="amount" class="block text-sm my-2 dark:text-white">Source</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    v-model="createForm.source"
                    placeholder="New expense source"
                    class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    maxlength="255"
                    required
                />
                <label for="amount" class="block text-sm my-2 dark:text-white">Amount</label>
                <input
                    type="number"
                    id="name"
                    name="name"
                    v-model="createForm.amount"
                    placeholder="00.0"
                    class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    maxlength="255"
                    min="0"
                    required
                />
                <label for="amount" class="block text-sm my-2 dark:text-white">Description</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    v-model="createForm.description"
                    placeholder="New expense description"
                    class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    maxlength="255"
                    required
                />
                <button
                    type="button"
                    class="my-5 py-2 px-3 block w-full text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    @click.prevent="createIncome"
                    :disabled="!isCreateFormValid"
                >
                    Save
                </button>
            </form>
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
                        <button
                            @click.prevent="prepareFormForUpdate(income)"
                            type="submit"
                            class="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-stone-200 bg-white text-green-500 shadow-sm hover:bg-stone-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-green-500 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        >
                            Update
                        </button>
                    </td>
                    <td class="size-px whitespace-nowrap px-4 py-1">
                        <deleteButton-component :id="income.id" @delete="handleDelete" />
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="nextPage" class="flex justify-center py-4">
            <button
                type="button"
                class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                @click.prevent="loadMore"
            >
                Load more
            </button>
        </div>
    </div>
</template>
