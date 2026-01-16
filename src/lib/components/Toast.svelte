<script>
    import { toasts } from "../stores/toast";
    import { fade, fly } from "svelte/transition";

    export let toast;

    function handleClose() {
        toasts.remove(toast.id);
    }

    const icons = {
        info: "ℹ️",
        success: "✅",
        error: "❌",
        warning: "⚠️",
    };

    const colors = {
        info: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-800",
        success:
            "bg-green-50 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-200 dark:border-green-800",
        error: "bg-red-50 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-200 dark:border-red-800",
        warning:
            "bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-800",
    };
</script>

<div
    in:fly={{ y: 20, duration: 300 }}
    out:fade={{ duration: 200 }}
    class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm max-w-sm pointer-events-auto {colors[
        toast.type
    ]}"
    role="alert"
>
    <span class="text-xl">{icons[toast.type]}</span>
    <p class="text-sm font-medium">{toast.message}</p>
    <button
        on:click={handleClose}
        class="ml-auto p-1 hover:opacity-70 transition-opacity"
        aria-label="Close"
    >
        ✕
    </button>
</div>
