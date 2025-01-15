<script setup>
import { reactive, computed, ref } from 'vue';
import { useUserStore } from '../stores/user';
import { useToast } from 'vue-toast-notification';
import router from '../router';

const userStore = useUserStore();
const user = userStore.user;
const toast = useToast();
const loading = ref(false);

const updateUserForm = reactive({
    name: user.name || '',
    email: user.email || '',
});

const userPasswordForm = reactive({
    oldPassword: '',
    newPassword: '',
    repeatNewPassword: '',
});

const isUpdateFormValid = computed(() => {
    return updateUserForm.name && updateUserForm.email;
});

const isPasswordFormValid = computed(() => {
    return userPasswordForm.oldPassword && userPasswordForm.newPassword && userPasswordForm.repeatNewPassword;
});

const handleDelete = () => {
    loading.value = true;
    axios
        .delete(`/api/auth/delete`)
        .then(() => {
            userStore.clearUser();
            toast.success('Your account was deleted!');
        })
        .finally(() => {
            loading.value = false;
            router.push('/login');
        });
};

const updateProfile = () => {
    if (!updateUserForm.name || !updateUserForm.email) {
        toast.error('Please fill in all fields!');
        return;
    }
    loading.value = true;
    const formData = {
        name: updateUserForm.name,
        email: updateUserForm.email,
    };
    axios
        .put('/api/auth/update', formData)
        .then((response) => {
            const user = response.data.user;
            userStore.updateUser(user);
            toast.success('Profile data updated!');
        })
        .finally(() => {
            loading.value = false;
        });
};

const changePassword = () => {
    if (
        !userPasswordForm.oldPassword ||
        !userPasswordForm.newPassword ||
        !userPasswordForm.repeatNewPassword ||
        userPasswordForm.repeatNewPassword !== userPasswordForm.newPassword
    ) {
        toast.error('Verify your entries!');
        return;
    }
    loading.value = true;
    const formData = {
        current_password: userPasswordForm.oldPassword,
        new_password: userPasswordForm.newPassword,
    };
    axios
        .post('/api/auth/change-password', formData)
        .then(() => {
            toast.success('Password updated!');
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
    <div
        v-else
        class="m-6 p-5 md:p-8 bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700"
    >
        <div class="mb-4 xl:mb-8">
            <h1 class="text-lg font-semibold text-gray-800 dark:text-neutral-200">Profile</h1>
            <p class="text-sm text-gray-500 dark:text-neutral-500">Manage your name, password and account settings.</p>
        </div>
        <form>
            <div class="py-6 sm:py-8 space-y-5 border-t border-gray-200 first:border-t-0 dark:border-neutral-700">
                <h2 class="font-semibold text-gray-800 dark:text-neutral-200">Personal info</h2>

                <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
                    <div class="sm:col-span-4 xl:col-span-3 2xl:col-span-2">
                        <label for="name" class="sm:mt-2.5 inline-block text-sm text-gray-500 dark:text-neutral-500">
                            Name
                        </label>
                    </div>

                    <div class="sm:col-span-8 xl:col-span-4">
                        <input
                            id="name"
                            name="name"
                            v-model="updateUserForm.name"
                            type="text"
                            class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
                            :placeholder="user.name || 'New name'"
                            maxlength="30"
                            required
                        />

                        <p class="mt-2 text-sm text-gray-500 dark:text-neutral-500">
                            Enter your full name, or a display name you are comfortable with.
                        </p>
                    </div>
                </div>

                <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
                    <div class="sm:col-span-4 xl:col-span-3 2xl:col-span-2">
                        <label for="email" class="sm:mt-2.5 inline-block text-sm text-gray-500 dark:text-neutral-500">
                            Email
                        </label>
                    </div>

                    <div class="sm:col-span-8 xl:col-span-4">
                        <input
                            id="email"
                            name="email"
                            v-model="updateUserForm.email"
                            type="email"
                            class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
                            :placeholder="user.email || 'New email'"
                            maxlength="30"
                            required
                        />

                        <p class="mt-2 text-sm text-gray-500 dark:text-neutral-500">
                            Enter the email address you want to use to log in.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    @click.prevent="updateProfile"
                    :disabled="!isUpdateFormValid"
                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    Save changes
                </button>
            </div>
        </form>
        <div class="py-6 sm:py-8 space-y-5 border-t border-gray-200 first:border-t-0 dark:border-neutral-700">
            <div class="inline-flex items-center gap-x-2">
                <h2 class="font-semibold text-gray-800 dark:text-neutral-200">Password</h2>

                <div class="hs-tooltip inline-block">
                    <svg
                        class="hs-tooltip-toggle shrink-0 ms-1 size-3 text-gray-500 dark:text-neutral-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                    >
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path
                            d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
                        />
                    </svg>
                    <div
                        class="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-[60] p-4 w-96 bg-white rounded-xl shadow-xl dark:bg-neutral-900 dark:text-neutral-400"
                        role="tooltip"
                    >
                        <p class="font-medium text-gray-800 dark:text-neutral-200">Password requirements:</p>
                        <p class="mt-1 text-sm font-normal text-gray-500 dark:text-neutral-400">
                            Ensure that these requirements are met:
                        </p>
                        <ul
                            class="mt-1 ps-3.5 list-disc list-outside text-sm font-normal text-gray-500 dark:text-neutral-400"
                        >
                            <li>Minimum 8 characters long - the more, the better</li>
                            <li>At least one lowercase character</li>
                            <li>At least one uppercase character</li>
                            <li>At least one number, symbol, or whitespace character</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
                <div class="sm:col-span-4 xl:col-span-3 2xl:col-span-2">
                    <label
                        for="hs-pro-dappcp"
                        class="sm:mt-2.5 inline-block text-sm text-gray-500 dark:text-neutral-500"
                    >
                        Current password
                    </label>
                </div>

                <div class="sm:col-span-8 xl:col-span-4">
                    <div class="relative">
                        <input
                            id="hs-pro-dappcp"
                            type="password"
                            v-model="userPasswordForm.oldPassword"
                            class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
                            placeholder="Enter current password"
                        />
                        <button
                            type="button"
                            data-hs-toggle-password='{"target": "#hs-pro-dappcp"}'
                            class="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
                        >
                            <svg
                                class="shrink-0 size-3.5"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path class="hs-password-active:hidden" d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                <path
                                    class="hs-password-active:hidden"
                                    d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                                />
                                <path
                                    class="hs-password-active:hidden"
                                    d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                                />
                                <line class="hs-password-active:hidden" x1="2" x2="22" y1="2" y2="22" />
                                <path
                                    class="hidden hs-password-active:block"
                                    d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                                />
                                <circle class="hidden hs-password-active:block" cx="12" cy="12" r="3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
                <div class="sm:col-span-4 xl:col-span-3 2xl:col-span-2">
                    <label
                        for="hs-pro-dappnp"
                        class="sm:mt-2.5 inline-block text-sm text-gray-500 dark:text-neutral-500"
                    >
                        New password
                    </label>
                </div>

                <div class="sm:col-span-8 xl:col-span-4">
                    <form>
                        <div data-hs-toggle-password-group class="space-y-2">
                            <div class="relative">
                                <input
                                    id="hs-pro-dappnp"
                                    type="password"
                                    v-model="userPasswordForm.newPassword"
                                    class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    data-hs-toggle-password='{"target": ["#hs-pro-dappnp", "#hs-pro-dapprnp"]}'
                                    class="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
                                >
                                    <svg
                                        class="shrink-0 size-3.5"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path class="hs-password-active:hidden" d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                        <path
                                            class="hs-password-active:hidden"
                                            d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                                        />
                                        <path
                                            class="hs-password-active:hidden"
                                            d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                                        />
                                        <line class="hs-password-active:hidden" x1="2" x2="22" y1="2" y2="22" />
                                        <path
                                            class="hidden hs-password-active:block"
                                            d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                                        />
                                        <circle class="hidden hs-password-active:block" cx="12" cy="12" r="3" />
                                    </svg>
                                </button>
                            </div>
                            <div class="relative">
                                <input
                                    id="hs-pro-dapprnp"
                                    type="password"
                                    v-model="userPasswordForm.repeatNewPassword"
                                    class="py-2 px-3 block w-full border-gray-200 rounded-lg text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-neutral-300 dark:placeholder:text-white/60 dark:focus:ring-neutral-600"
                                    placeholder="Repeat new password"
                                />
                                <button
                                    type="button"
                                    data-hs-toggle-password='{"target": ["#hs-pro-dappnp", "#hs-pro-dapprnp"]}'
                                    class="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
                                >
                                    <svg
                                        class="shrink-0 size-3.5"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path class="hs-password-active:hidden" d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                                        <path
                                            class="hs-password-active:hidden"
                                            d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"
                                        />
                                        <path
                                            class="hs-password-active:hidden"
                                            d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                                        />
                                        <line class="hs-password-active:hidden" x1="2" x2="22" y1="2" y2="22" />
                                        <path
                                            class="hidden hs-password-active:block"
                                            d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
                                        />
                                        <circle class="hidden hs-password-active:block" cx="12" cy="12" r="3" />
                                    </svg>
                                </button>
                            </div>

                            <div class="flex items-center gap-x-3 py-2">
                                <button
                                    @click.prevent="changePassword"
                                    :disabled="!isPasswordFormValid"
                                    type="button"
                                    class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Save Change
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="py-6 sm:py-8 space-y-5 border-t border-gray-200 first:border-t-0 dark:border-neutral-700">
            <div class="grid sm:grid-cols-12 gap-y-1.5 sm:gap-y-0 sm:gap-x-5">
                <div class="sm:col-span-4 xl:col-span-3 2xl:col-span-2">
                    <label class="inline-block text-sm text-gray-500 dark:text-neutral-500"> Danger zone </label>
                </div>

                <div class="sm:col-span-8 xl:col-span-4">
                    <button
                        @click.prevent="handleDelete"
                        type="button"
                        class="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-red-500 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-red-500 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                    >
                        Delete my account
                    </button>

                    <p class="mt-3 text-sm text-gray-500 dark:text-neutral-500">
                        This will immediately delete all of your data. This action is not reversible, so please continue
                        with caution.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
