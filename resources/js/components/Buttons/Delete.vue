<script setup>
const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});

const emit = defineEmits(['delete']);

const handleDelete = () => {
    emit('delete', props.id);
};
</script>

<template>
    <button
        @click.prevent="handleDelete"
        type="button"
        class="py-2 px-3 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-stone-200 bg-white text-red-500 shadow-sm hover:bg-stone-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-stone-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-red-500 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
    >
        Delete
    </button>
</template>
