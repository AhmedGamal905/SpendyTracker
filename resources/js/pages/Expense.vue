<script setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useToast } from 'vue-toast-notification';
import { JellyfishLoader } from 'vue3-spinner';

const loading = ref(false);
const expenses = ref([]);
const categories = ref([]);
const nextPage = ref('');
const showUpdateForm = ref(false);
const showCreateForm = ref(false);
const updateForm = ref({
    id: '',
    category_id: '',
    amount: '',
    description: '',
});
const createForm = ref({
    category_id: '',
    amount: '',
    description: '',
});

const toast = useToast();

const isCreateFormValid = computed(() => {
    return createForm.value.category_id && createForm.value.amount && createForm.value.description;
});
const isUpdateFormValid = computed(() => {
    return updateForm.value.category_id && updateForm.value.amount && updateForm.value.description;
});

onMounted(async () => {
    loading.value = true;
    try {
        const expensesResponse = await axios.get('/api/expenses');
        const categoriesResponse = await axios.get('/api/categories');
        expenses.value = expensesResponse.data.data;
        categories.value = categoriesResponse.data.data;
        nextPage.value = expensesResponse.data.links.next;
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
        toast.success('Your expense was deleted!');
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data.message || 'Something went wrong');
        }
    } finally {
        loading.value = false;
    }
};

const getCategoryName = (categoryId) => {
    const category = categories.value.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Unknown';
};

const createExpense = async () => {
    if (!createForm.value.category_id || !createForm.value.amount || !createForm.value.description) {
        toast.error('Please fill in all fields!');
        return;
    }
    loading.value = true;
    const formData = {
        category_id: createForm.value.category_id,
        amount: createForm.value.amount,
        description: createForm.value.description,
    };
    try {
        const response = await axios.post('/api/expenses', formData);
        expenses.value.push(response.data.data);
        createForm.value.category_id = '';
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
            expenses.value.push(...response.data.data);
            nextPage.value = response.data.links.next;
        } else {
            toast.error('No next page');
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

const prepareFormForUpdate = (expense) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateForm.value.id = expense.id;
    updateForm.value.category_id = expense.category_id;
    updateForm.value.amount = expense.amount;
    updateForm.value.description = expense.description;
    showUpdateForm.value = true;
    showCreateForm.value = false;
};

const updateExpense = async () => {
    if (
        !updateForm.value.id ||
        !updateForm.value.amount ||
        !updateForm.value.category_id ||
        !updateForm.value.description
    ) {
        toast.error('Please fill in all fields or select a valid resource to update!');
        return;
    }
    loading.value = true;
    const formData = {
        category_id: updateForm.value.category_id,
        amount: updateForm.value.amount,
        description: updateForm.value.description,
    };

    try {
        const response = await axios.put(`/api/expenses/${updateForm.value.id}`, formData);
        expenses.value = expenses.value.map((expense) =>
            expense.id === updateForm.value.id ? response.data.data : expense,
        );
        updateForm.value.id = '';
        updateForm.value.category_id = '';
        updateForm.value.amount = '';
        updateForm.value.description = '';
        showUpdateForm.value = false;
        toast.success('Expense updated!');
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
                <label for="category" class="block text-sm my-2 dark:text-white">Category</label>
                <div class="relative">
                    <select
                        id="category"
                        v-model="updateForm.category_id"
                        class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        required
                    >
                        <option value="" disabled>Select Category</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                </div>
                <label for="amount" class="block text-sm my-2 dark:text-white">Amount</label>
                <input
                    type="number"
                    id="name"
                    name="name"
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
                    @click.prevent="updateExpense"
                    :disabled="!isUpdateFormValid"
                >
                    Save new changes
                </button>
            </form>
        </div>

        <div class="flex flex-wrap justify-between items-center gap-2 mx-2">
            <div>
                <h1 class="text-lg md:text-xl font-semibold text-stone-800 dark:text-neutral-200">Your Expenses</h1>
            </div>
            <div class="flex justify-end items-center gap-x-2">
                <button
                    @click.prevent="toggleCreateForm"
                    type="button"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-green-500"
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

        <div v-if="showCreateForm" class="p-10">
            <form>
                <label for="category" class="block text-sm my-2 dark:text-white">Category</label>
                <div class="relative">
                    <select
                        id="category"
                        v-model="createForm.category_id"
                        class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                        required
                    >
                        <option value="" disabled>Select Category</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                </div>
                <label for="amount" class="block text-sm my-2 dark:text-white">Amount</label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    v-model="createForm.amount"
                    placeholder="00.0"
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
                    v-model="createForm.description"
                    placeholder="New expense description"
                    class="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
                    maxlength="255"
                    required
                />
                <button
                    type="button"
                    class="my-5 py-2 px-3 block w-full text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    @click.prevent="createExpense"
                    :disabled="!isCreateFormValid"
                >
                    Save
                </button>
            </form>
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
                            id="hs-pro-name"
                            type="button"
                            class="px-4 py-2.5 text-start w-full flex items-center gap-x-1 text-sm font-normal text-gray-500 focus:outline-none focus:bg-gray-100 dark:text-neutral-500 dark:focus:bg-neutral-700"
                            aria-haspopup="menu"
                            aria-expanded="false"
                            aria-label="Dropdown"
                        >
                            Category
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
                                {{ getCategoryName(expense.category_id) }}
                            </span>
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
                        <button
                            @click.prevent="prepareFormForUpdate(expense)"
                            type="submit"
                            class="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-stone-200 bg-white text-green-500 shadow-sm hover:bg-stone-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-green-500 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                        >
                            Update
                        </button>
                    </td>
                    <td class="size-px whitespace-nowrap px-4 py-1">
                        <deleteButton-component :id="expense.id" @delete="handleDelete" />
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
