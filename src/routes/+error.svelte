<script>
    import { page } from "$app/stores";
</script>

<div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 text-center"
>
    <div
        class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-lg w-full border border-gray-100 dark:border-gray-700"
    >
        <div class="text-6xl mb-6">😕</div>
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {$page.status}: {$page.error?.message || "Something went wrong"}
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
            We encountered an unexpected error. Please try again or return to
            the home page.
        </p>
        <a
            href="/"
            class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
            Go Home
        </a>
    </div>
</div>
