<script>
  import { addChild, updateNodeText, isReadOnly, layout, focusedNodeId } from "./store";
  import { onMount } from 'svelte';

  export let node;
  export let isRoot = false;

  let expanded = true;
  let element; // Reference to the contenteditable div
  const DEFAULT_TEXT = "New Node"; 

  // Auto-focus logic
  $: if ($focusedNodeId === node.id && element) {
      element.focus();
      // Optionally select all text or clear it? 
      // User said: "add new node should be new node on focus keyboard with clear text"
      // Our handleFocus already clears text if it is default.
      // Reset store so we don't re-focus unnecessarily?
      // focusedNodeId.set(null); // Better to do this after a timeout or let it be replaced. 
      // Actually, if we set it to null immediately, it might cause issues if component re-renders.
      // But let's try just focusing. The handleFocus will do the rest.
  }

  function handleInput(e) {
    updateNodeText(node.id, e.target.textContent);
  }

  function handleFocus(e) {
    const text = e.target.textContent.trim();
    if (text === "New Node" || (isRoot && text === "Central Topic")) {
      e.target.textContent = "";
    }
    // Clear the focus tracking to prevent re-focusing loop if we move away and back?
    // Actually, focusedNodeId is just for the *initial* focus upon creation.
    // We should probably clear it after focusing.
    if ($focusedNodeId === node.id) {
        focusedNodeId.set(null);
    }
  }

  function handleBlur(e) {
// ... existing code ...
  }

  function handleAdd() {
    addChild(node.id);
    expanded = true;
  }

  function toggleExpand() {
    expanded = !expanded;
  }
</script>

<div
  class="flex {$layout === 'top-down' ? 'flex-col' : 'flex-row'} items-center"
>
  <div
    class="flex items-center gap-2 p-2 rounded-lg transition-all duration-300 z-10
    {$isReadOnly ? '' : 'hover:scale-105'}
    {isRoot
      ? 'bg-blue-600 text-white text-xl font-bold shadow-lg'
      : 'bg-white dark:bg-gray-800 dark:text-gray-200 shadow border border-gray-200 dark:border-gray-700'}
  "
  >
    <!-- Expand/Collapse for parents -->
    {#if node.children && node.children.length > 0}
      <button
        on:click={toggleExpand}
        class="text-xs mr-1 opacity-50 hover:opacity-100"
      >
        {expanded ? "−" : "+"}
      </button>
    {/if}
    const text = e.target.textContent.trim();
    if (text === "") {
      e.target.textContent = isRoot ? "Central Topic" : "New Node";
      updateNodeText(node.id, e.target.textContent);
    } else {
      updateNodeText(node.id, text);
    }
  }

  function handleAdd() {
    addChild(node.id);
    expanded = true;
  }

  function toggleExpand() {
    expanded = !expanded;
  }
</script>

<div
  class="flex {$layout === 'top-down' ? 'flex-col' : 'flex-row'} items-center"
>
  <div
    class="flex items-center gap-2 p-2 rounded-lg transition-all duration-300 z-10
    {$isReadOnly ? '' : 'hover:scale-105'}
    {isRoot
      ? 'bg-blue-600 text-white text-xl font-bold shadow-lg'
      : 'bg-white dark:bg-gray-800 dark:text-gray-200 shadow border border-gray-200 dark:border-gray-700'}
  "
  >
    <!-- Expand/Collapse for parents -->
    {#if node.children && node.children.length > 0}
      <button
        on:click={toggleExpand}
        class="text-xs mr-1 opacity-50 hover:opacity-100"
      >
        {expanded ? "−" : "+"}
      </button>
    {/if}

    <div
      contenteditable={!$isReadOnly}
      bind:this={element}
      on:input={handleInput}
      on:focus={handleFocus}
      on:blur={handleBlur}
      class="outline-none min-w-[50px] text-center px-2 py-1 cursor-text empty:before:content-[attr(placeholder)] focus:before:content-none"
      placeholder="Node"
    >
      {node.text}
    </div>

    <!-- Add Child Button -->
    {#if !$isReadOnly}
      <button
        on:click={handleAdd}
        class="ml-2 w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors shadow-sm text-sm"
        title="Add Child"
      >
        +
      </button>
    {/if}
  </div>

  <!-- Children Container -->
  {#if expanded && node.children && node.children.length > 0}
    <div
      class="flex {$layout === 'top-down'
        ? 'flex-row pt-8 gap-8'
        : 'flex-col pl-8 gap-4'} items-start relative"
    >
      <!-- Connector Lines (Simplified) -->
      {#if $layout === "top-down"}
        <!-- Vertical connector line from parent would go here -->
      {:else}
        <!-- Horizontal connector line from parent would go here -->
      {/if}

      {#each node.children as child (child.id)}
        <div class="relative flex flex-col items-center">
          <!-- Simple connector line visual -->
          {#if $layout === "top-down"}
            <div
              class="absolute -top-8 left-1/2 w-px h-8 bg-gray-300 dark:bg-gray-600"
            ></div>
          {:else}
            <div
              class="absolute top-1/2 -left-8 w-8 h-px bg-gray-300 dark:bg-gray-600"
            ></div>
          {/if}
          <svelte:self node={child} />
        </div>
      {/each}
    </div>
  {/if}
</div>
