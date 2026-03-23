<script lang="ts">
  import type { Snippet } from 'svelte';

  let { 
    searchQuery = $bindable(''), 
    placeholder = '검색어를 입력하세요...',
    onSearch = () => {},
    filters
  }: { 
    searchQuery?: string, 
    placeholder?: string,
    onSearch?: () => void,
    filters?: Snippet 
  } = $props();
</script>

<div class="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 flex flex-wrap gap-4 items-center">
  <!-- 베이스 공용 검색 바 -->
  <div class="flex-1 min-w-[250px] relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
    </div>
    <input 
      type="text" 
      bind:value={searchQuery}
      oninput={() => onSearch()}
      {placeholder}
      class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
    />
  </div>

  <!-- 페이지별 맞춤형 추가 필터 (Slots/Snippets) -->
  {#if filters}
    <div class="flex gap-3 items-center">
      {@render filters()}
    </div>
  {/if}
</div>
