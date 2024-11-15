<script lang="ts">
    export let active: boolean = false;
    export let label: string;
  </script>
  
  <button
    class="px-4 py-2 font-medium text-sm {active 
      ? 'text-blue-600 border-b-2 border-blue-600' 
      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-b-2 border-transparent'}"
    on:click
  >
    {label}
  </button>