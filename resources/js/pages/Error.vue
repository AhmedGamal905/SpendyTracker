<template>
    <div class="flex items-center justify-center text-center py-10 px-4 sm:px-6 lg:px-8">
        <div>
            <h1 class="pl-2 text-2xl text-gray-800 font-bold sm:text-3xl dark:text-neutral-200">Error 404</h1>
            <p class="mt-3 text-gray-600 dark:text-neutral-400 text-2xl sm:text-4xl">Oops, something went wrong.</p>
            <p class="text-gray-600 dark:text-neutral-400 text-2xl sm:text-4xl">Sorry, we couldn't find your page.</p>
            <div class="mt-5 flex flex-col justify-center items-center gap-2 sm:flex-row sm:gap-3">
                <router-link
                    class="w-full sm:w-auto py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    to="/"
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
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    Back to home page
                </router-link>
            </div>
        </div>
    </div>
</template>
