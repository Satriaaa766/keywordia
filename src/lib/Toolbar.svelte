<script>
  import { theme, isReadOnly, mindMap, layout } from "./store";
  import { toasts } from "./stores/toast";
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { PUBLIC_GOOGLE_CLIENT_ID } from "$env/static/public";
  import ShareModal from "./ShareModal.svelte";

  export let user = null;
  export let mapId = null;
  export let canEdit = false;
  export let isEditable = false;
  export let isOwner = false;

  let showShareModal = false;
  let saveStatus = "Saved"; // 'Saved', 'Unsaved changes', 'Saving...', 'Error'
  let hasUnsavedChanges = false;
  let isInitialLoad = true;
  let saveTimeout;
  const DEBOUNCE_DELAY = 1000; // 1 second delay

  // React to store changes to auto-save with debounce
  $: {
    $mindMap; // Dependency registration
    if (isInitialLoad) {
      isInitialLoad = false;
    } else {
      if (!$isReadOnly) {
        hasUnsavedChanges = true;
        saveStatus = "Unsaved changes...";

        if (saveTimeout) clearTimeout(saveTimeout);

        if (mapId) {
          saveTimeout = setTimeout(() => {
            handleSave();
          }, DEBOUNCE_DELAY);
        }
      }
    }
  }

  async function handleSave() {
    if (!mapId) return;
    saveStatus = "Saving...";
    try {
      const res = await fetch(`/api/map/${mapId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // Use current store value at time of save execution
        body: JSON.stringify({ content: $mindMap }),
      });
      if (res.ok) {
        hasUnsavedChanges = false;
        saveStatus = "Saved";
        toasts.add("Map saved successfully", "success");
      } else {
        saveStatus = "Not saved (Server Error)";
        toasts.add("Failed to save map", "error");
      }
    } catch (e) {
      console.error(e);
      saveStatus = "Not saved (Network Error)";
      toasts.add("Network error: Failed to save map", "error");
    }
  }

  function handleLogin(response) {
    fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ token: response.credential }),
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        if (res.ok) {
          toasts.add("Logged in successfully", "success");
          setTimeout(() => location.reload(), 500); // Simple reload to refresh session
        } else {
          toasts.add("Login failed", "error");
        }
      })
      .catch((e) => {
        toasts.add("Login error: " + e.message, "error");
      });
  }

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toasts.add("Logged out successfully", "success");
      setTimeout(() => (location.href = "/"), 500); // Redirect to home
    } catch (e) {
      toasts.add("Logout failed", "error");
    }
  }

  onMount(() => {
    // Google Login Init
    if (!user && window.google) {
      window.google.accounts.id.initialize({
        client_id: PUBLIC_GOOGLE_CLIENT_ID, // Ideally from env public
        callback: handleLogin,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-btn"),
        { theme: "outline", size: "large" },
      );
    }

    // Auto-save is now handled by reactive statement with debounce
  });

  onDestroy(() => {
    if (saveTimeout) clearTimeout(saveTimeout);
  });

  function toggleTheme() {
    theme.update((t) => {
      const newTheme = t === "dark" ? "light" : "dark";
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return newTheme;
    });
  }

  function toggleLayout() {
    layout.update((l) => (l === "top-down" ? "left-to-right" : "top-down"));
  }

  function togglePresentation() {
    isReadOnly.update((v) => !v);
  }

  async function downloadJSON() {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify($mindMap));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "mindmap.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  function openShare() {
    showShareModal = true;
  }

  import { page } from "$app/stores";
  import Logo from "./Logo.svelte";
</script>

<ShareModal
  isOpen={showShareModal}
  url={$page.url.href}
  {mapId}
  {isEditable}
  {user}
  on:close={() => (showShareModal = false)}
/>

<div
  class="fixed top-4 left-4 right-4 flex justify-between items-center bg-white/10 backdrop-blur-md p-2 rounded-xl shadow-lg z-50 border border-white/20"
>
  <div class="flex items-center gap-2">
    <Logo size={8} />
    <h1
      class="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hidden sm:block"
    >
      Keywordia
    </h1>
    {#if user}
      <span class="text-sm font-medium">Hello, {user.name}</span>
    {/if}
  </div>

  <div class="flex gap-2 items-center">
    {#if mapId}
      <!-- Status Indicator -->
      {#if canEdit}
        <span
          class="text-xs font-mono px-2 min-w-[80px] text-right {saveStatus.includes(
            'not saved',
          )
            ? 'text-red-500 font-bold'
            : 'text-gray-500 dark:text-gray-400'}"
        >
          {saveStatus}
        </span>
      {/if}

      <button
        on:click={toggleLayout}
        class="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:opacity-80 transition-all font-medium text-sm cursor-pointer"
        title="Toggle Layout"
      >
        {$layout === "top-down" ? "⬇️ Tree" : "➡️ Linear"}
      </button>

      {#if canEdit}
        <button
          on:click={togglePresentation}
          class="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:opacity-80 transition-all font-medium text-sm cursor-pointer"
          title="Presentation Mode"
        >
          {$isReadOnly ? "✏️ Edit" : "📽️ Present Mode"}
        </button>
      {/if}

      <!-- Manual Save Button REMOVED -->

      {#if isOwner}
        <button
          on:click={openShare}
          class="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:opacity-80 transition-all font-medium text-sm cursor-pointer"
          >Share</button
        >
      {/if}
      <button
        on:click={downloadJSON}
        class="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:opacity-80 transition-all font-medium text-sm cursor-pointer"
        >📥 Download</button
      >
    {/if}

    {#if !user}
      <div id="google-btn"></div>
    {:else}
      <button
        on:click={handleLogout}
        class="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all font-medium text-sm cursor-pointer"
        >Logout</button
      >
    {/if}
  </div>
</div>
