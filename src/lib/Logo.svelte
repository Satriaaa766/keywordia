<script>
    export let size = 8; // w-8 h-8
</script>

<svg class="w-{size} h-{size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="url(#grad1)" />
    <path d="M50 25V75M25 50H75" stroke="white" stroke-width="8" stroke-linecap="round" />
    <circle cx="50" cy="50" r="10" fill="white" />
    <defs>
        <linearGradient id="grad1" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stop-color="#3B82F6" />
            <stop offset="1" stop-color="#9333EA" />
        </linearGradient>
    </defs>
</svg>
