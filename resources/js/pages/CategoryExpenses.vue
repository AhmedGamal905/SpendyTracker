<script setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toast-notification';
import { JellyfishLoader } from 'vue3-spinner';

const loading = ref(false);

const toast = useToast();
const expenses = ref([]);
const route = useRoute();
const categories = ref([]);
const categoryId = route.params.id;

onMounted(async () => {
    loading.value = true;
    try {
        const response = await axios.get(`/api/categories/${categoryId}/expenses`);
        const categoriesResponse = await axios.get('/api/categories');
        expenses.value = response.data.data;
        categories.value = categoriesResponse.data.data;
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.message || 'Something went wrong! Try to refresh');
        }
    } finally {
        loading.value = false;
    }
});

const handleDelete = async (expenseId) => {
    loading.value = true;
    try {
        await axios.delete(`/api/expenses/${expenseId}`);
        expenses.value = expenses.value.filter((expense) => expense.id !== expenseId);
        toast.success(`your expense was deleted!`);
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.message || 'Something went wrong');
        }
    } finally {
        loading.value = false;
    }
};

const createForm = ref({
    amount: '',
    description: '',
});

const isFormValid = computed(() => {
    return createForm.value.amount && createForm.value.description;
});

const createExpense = async () => {
    if (!createForm.value.amount || !createForm.value.description) {
        toast.error('Please fill in all fields!');
        return;
    }
    loading.value = true;
    const formData = {
        category_id: categoryId,
        amount: createForm.value.amount,
        description: createForm.value.description,
    };
    try {
        const response = await axios.post('/api/expenses', formData);
        expenses.value.push(response.data.data);
        createForm.value.amount = '';
        createForm.value.description = '';
        toast.success('New income saved!');
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
        <div class="flex flex-wrap justify-between items-center gap-2 mx-2">
            <div>
                <h1 class="text-lg md:text-xl font-semibold text-stone-800 dark:text-neutral-200">Your Expenses</h1>
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
                    New Expense
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
                            Add a new income
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
                            <label for="amount" class="block text-sm my-2 dark:text-white">Amount</label>
                            <div class="relative">
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    v-model="createForm.amount"
                                    placeholder="$0.00"
                                    class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                                    required
                                />
                            </div>
                            <label for="description" class="block text-sm my-2 dark:text-white">Description</label>
                            <div class="relative">
                                <input
                                    type="text"
                                    id="description"
                                    name="description"
                                    v-model="createForm.description"
                                    placeholder="Description"
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
                                @click.prevent="createExpense"
                                :disabled="!isFormValid"
                            >
                                Save changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div v-if="expenses.length === 0" class="text-center py-6">
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
                            Expense ID
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
                            Time
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
                <tr
                    v-for="expense in expenses"
                    :key="expense.id"
                    class="divide-x divide-gray-200 dark:divide-neutral-700"
                >
                    <td class="size-px whitespace-nowrap px-4 py-1">
                        <div class="w-full flex items-center gap-x-3">
                            <span class="text-sm font-medium text-gray-800 dark:text-neutral-200">{{
                                expense.id
                            }}</span>
                        </div>
                    </td>
                    <td class="size-px whitespace-nowrap px-4 py-1">
                        <div class="w-full flex items-center gap-x-3">
                            <span class="text-sm font-medium text-gray-800 dark:text-neutral-200">
                                ${{ expense.amount }}
                            </span>
                        </div>
                    </td>
                    <td class="size-px whitespace-nowrap px-4 py-1">
                        <div class="w-full flex items-center gap-x-3">
                            <span class="text-sm font-medium text-gray-800 dark:text-neutral-200">
                                {{ expense.description }}
                            </span>
                        </div>
                    </td>
                    <td class="size-px whitespace-nowrap px-4 py-1">
                        <div class="w-full flex items-center gap-x-3">
                            <span class="text-sm font-medium text-gray-800 dark:text-neutral-200">
                                {{ expense.created_at }}
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
                        <deleteButton-component :id="expense.id" @delete="handleDelete" />
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
