<script>
    import Toolbar from "$lib/Toolbar.svelte";
    import MindMapNode from "$lib/MindMapNode.svelte";
    import { setMap, isReadOnly } from "$lib/store";
    import { onMount } from "svelte";

    export let data;

    // Sync data to store
    $: if (data.map) {
        if (typeof data.map.content === "string") {
            try {
                setMap(JSON.parse(data.map.content));
            } catch (e) {
                console.error("Failed to parse map content", e);
            }
        } else {
            setMap(data.map.content);
        }
        isReadOnly.set(data.isReadOnly);
    } else {
        setMap({ id: "root", text: "Central Topic", children: [] });
    }

    // Ref to store value for passing to root
    import { mindMap } from "$lib/store";
</script>

<div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-auto transition-colors duration-300 relative"
>
    <Toolbar user={data.user} mapId={data.map.id} canEdit={!data.isReadOnly} />

    <div class="pt-32 pb-20 px-8 flex justify-center min-w-max">
        <MindMapNode node={$mindMap} isRoot={true} />
    </div>
</div>
