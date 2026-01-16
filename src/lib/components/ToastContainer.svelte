<script>
    import { toasts } from "../stores/toast";
    import Toast from "./Toast.svelte";
</script>

<div
    class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none p-4"
>
    {#each $toasts as toast (toast.id)}
        <Toast {toast} />
    {/each}
</div>
