<script>
  import { theme, isReadOnly, mindMap, layout } from "./store";
  import { onMount, onDestroy } from "svelte";
  import { goto } from "$app/navigation";
  import { PUBLIC_GOOGLE_CLIENT_ID } from "$env/static/public";
  import ShareModal from "./ShareModal.svelte";

  export let user = null;
  export let mapId = null;
  export let canEdit = false;

  let showShareModal = false;
  let saveStatus = "Saved"; // 'Saved', 'Unsaved changes', 'Saving...', 'Error'
  let hasUnsavedChanges = false;
  let isInitialLoad = true;
  let saveInterval;
  let lastChangeTime = Date.now();
  const IDLE_THRESHOLD = 5000; // 5 seconds

  // React to store changes to detect unsaved work
  $: {
    $mindMap; // Dependency registration
    if (isInitialLoad) {
      isInitialLoad = false;
    } else {
      hasUnsavedChanges = true;
      saveStatus = "Unsaved changes";
      lastChangeTime = Date.now();
    }
  }

  async function handleSave() {
    if (!mapId) return;
    saveStatus = "Saving...";
    try {
      const res = await fetch(`/api/map/${mapId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: $mindMap }),
      });
      if (res.ok) {
        hasUnsavedChanges = false;
        saveStatus = "Saved";
      } else {
        saveStatus = "Your progress not saved, may network issue";
      }
    } catch (e) {
      console.error(e);
      saveStatus = "Your progress not saved, may network issue";
    }
  }

  function handleLogin(response) {
    fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ token: response.credential }),
      headers: { "Content-Type": "application/json" },
    }).then(async (res) => {
      if (res.ok) {
        location.reload(); // Simple reload to refresh session
      }
    });
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    location.href = "/"; // Redirect to home
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

    // Auto-save Interval
    // Check every 1 second if we have reached the idle threshold
    saveInterval = setInterval(() => {
      if (hasUnsavedChanges && mapId) {
        const timeSinceLastChange = Date.now() - lastChangeTime;
        // Only save if strictly idle for > threshold
        if (timeSinceLastChange >= IDLE_THRESHOLD) {
          handleSave();
        }
      }
    }, 1000);
  });

  onDestroy(() => {
    if (saveInterval) clearInterval(saveInterval);
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

  import Logo from "./Logo.svelte";
</script>

<ShareModal
  isOpen={showShareModal}
  url={typeof window !== "undefined" ? window.location.href : ""}
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

      <button
        on:click={openShare}
        class="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 hover:opacity-80 transition-all font-medium text-sm cursor-pointer"
        >Share</button
      >
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
