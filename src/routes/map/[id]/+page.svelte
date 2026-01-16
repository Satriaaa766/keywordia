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
    import { mindMap, focusedNodeId } from "$lib/store";
    import { page } from "$app/stores";

    import { onDestroy } from "svelte";

    let interval;

    onMount(() => {
        if ($page.url.searchParams.get("focus") === "root") {
            focusedNodeId.set("root");
        }

        // Poll for updates every 2 seconds
        interval = setInterval(async () => {
            if (!data.map.id) return;
            try {
                const res = await fetch(`/api/map/${data.map.id}`);
                if (res.ok) {
                    const fetchedMap = await res.json();

                    // Simple comparison to avoid overwriting active local changes if synced
                    // Limitation: This might overwrite local changes if user is typing while poll happens.
                    // Better approach: Compare content hash or timestamps?
                    // For now, let's just update if valid and different.
                    // To prevent overwriting active modifications (conflict), we really need OT.
                    // But for "Bug Fix", LWW (Last Write Wins) is the standard expectation if no OT.

                    const currentContentStr = JSON.stringify($mindMap);
                    let newContentStr = "";
                    let newContentObj = null;

                    if (typeof fetchedMap.content === "string") {
                        newContentStr = fetchedMap.content;
                        try {
                            newContentObj = JSON.parse(newContentStr);
                        } catch (e) {}
                    } else {
                        newContentStr = JSON.stringify(fetchedMap.content);
                        newContentObj = fetchedMap.content;
                    }

                    if (newContentStr !== currentContentStr && newContentObj) {
                        // Only update if remote is different.
                        // WARNING: This will overwrite local if they are out of sync.
                        setMap(newContentObj);
                    }
                }
            } catch (e) {
                console.error("Polling error", e);
            }
        }, 1000);
    });

    onDestroy(() => {
        if (interval) clearInterval(interval);
    });
</script>

<div
    class="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-auto transition-colors duration-300 relative"
>
    <Toolbar
        user={data.user}
        mapId={data.map.id}
        canEdit={!data.isReadOnly}
        isEditable={data.map.isEditable}
    />

    <div class="pt-32 pb-20 px-8 flex justify-center min-w-max">
        <MindMapNode node={$mindMap} isRoot={true} />
    </div>
</div>
