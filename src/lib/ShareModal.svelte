<script>
    import { createEventDispatcher } from "svelte";
    import { scale, fade } from "svelte/transition";

    export let isOpen = false;
    export let url = "";

    const dispatch = createEventDispatcher();

    function close() {
        dispatch("close");
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(url);
        alert("Copied to clipboard!"); // Could be a toast, but keeping simple as requested
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        transition:fade
    >
        <div
            class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-gray-100 dark:border-gray-700"
            transition:scale
        >
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                    Share Mind Map
                </h3>
                <button
                    on:click={close}
                    class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    ✕
                </button>
            </div>

            <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Share this link with others to view or edit this mind map.
            </p>

            <div class="flex gap-2 mb-6">
                <input
                    type="text"
                    value={url}
                    readonly
                    class="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                />
                <button
                    on:click={copyToClipboard}
                    class="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 transition-colors"
                >
                    Copy
                </button>
            </div>

            <div class="flex justify-end">
                <button
                    on:click={close}
                    class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
{/if}
