<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import FilterBar from '$lib/components/FilterBar.svelte';

  let categories: any[] = $state([]);
  let searchQuery = $state('');
  let showModal = $state(false);
  let editTarget: any = $state(null);
  let form = $state({ name: '', description: '', parent_id: null as number | null });

  onMount(async () => { await load(); });

  async function load() {
    categories = await api.get('/api/order/api/categories/tree');
  }

  let filteredCategories = $derived.by(() => {
    if (!searchQuery) return categories;
    const sq = searchQuery.toLowerCase();
    
    function filterNode(node: any): any {
      const matchSelf = node.name?.toLowerCase().includes(sq) || node.description?.toLowerCase().includes(sq);
      const filteredChildren = (node.children || []).map(filterNode).filter((c: any) => c !== null);
      if (matchSelf || filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
      return null;
    }
    
    return categories.map(filterNode).filter(c => c !== null);
  });

  function openCreate(parentId: number | null = null) {
    editTarget = null;
    form = { name: '', description: '', parent_id: parentId };
    showModal = true;
  }

  async function save() {
    try {
      await api.post('/api/order/api/categories', form);
      showModal = false;
      await load();
      alert('카테고리가 저장됐어요! 📂');
    } catch (e) {
      alert('저장 실패 😢');
    }
  }

  async function deleteCategory(id: number) {
    if (!confirm('정말 이 카테고리를 삭제할까요? 하위 카테고리도 모두 삭제될 수 있습니다. 😱')) return;
    try {
      await api.delete(`/api/order/api/categories/${id}`);
      await load();
      alert('삭제 완료 🗑️');
    } catch (e) {
      alert('삭제 실패 😭');
    }
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h2 class="text-lg font-bold text-gray-800">카테고리 관리</h2>
    <button onclick={() => openCreate(null)} class="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-500 transition-colors">
      + 최상위 카테고리 추가
    </button>
  </div>

  <FilterBar bind:searchQuery placeholder="카테고리명 또는 설명 검색..." />

  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
    {#if filteredCategories.length === 0}
      <div class="text-center py-12 text-gray-400">일치하는 카테고리가 없습니다.</div>
    {:else}
      <div class="space-y-4">
        {#each filteredCategories as cat}
          <div class="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
            <div class="flex justify-between items-center">
              <div>
                <span class="font-bold text-gray-800">{cat.name}</span>
                <span class="text-xs text-gray-400 ml-2">{cat.description || ''}</span>
              </div>
              <div class="flex gap-2">
                <button onclick={() => openCreate(cat.id)} class="text-xs text-indigo-600 hover:underline">하위 추가</button>
                <button onclick={() => deleteCategory(cat.id)} class="text-xs text-rose-500 hover:underline">삭제</button>
              </div>
            </div>
            
            {#if cat.children && cat.children.length > 0}
              <div class="mt-3 ml-6 space-y-2 border-l-2 border-gray-100 pl-4">
                {#each cat.children as child}
                  <div class="flex justify-between items-center py-1">
                    <div class="text-sm text-gray-600">
                      <span class="text-gray-300 mr-1">ㄴ</span> {child.name}
                    </div>
                    <div class="flex gap-2 text-[10px]">
                       <button onclick={() => openCreate(child.id)} class="text-indigo-400 hover:underline">하위 추가</button>
                       <button onclick={() => deleteCategory(child.id)} class="text-rose-400 hover:underline">삭제</button>
                    </div>
                  </div>
                  
                  {#if child.children && child.children.length > 0}
                    <div class="ml-6 space-y-1 border-l border-gray-50 pl-4">
                       {#each child.children as grandchild}
                         <div class="flex justify-between items-center py-0.5">
                            <div class="text-xs text-gray-500 italic">
                               <span class="text-gray-200 mr-1">ㄴ</span> {grandchild.name}
                            </div>
                            <button onclick={() => deleteCategory(grandchild.id)} class="text-[10px] text-rose-300 hover:underline">삭제</button>
                         </div>
                       {/each}
                    </div>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

{#if showModal}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onclick={() => showModal = false}>
    <div class="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl overflow-hidden relative" onclick={(e) => e.stopPropagation()}>
      <h3 class="text-xl font-bold text-gray-900 mb-6">카테고리 추가</h3>
      
      <div class="space-y-4">
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-2">카테고리명</label>
          <input bind:value={form.name} class="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors" placeholder="이름을 입력하세요" />
        </div>
        <div>
          <label class="text-sm font-semibold text-gray-700 block mb-2">설명</label>
          <input bind:value={form.description} class="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors" placeholder="설명을 입력하세요 (선택)" />
        </div>
      </div>

      <div class="mt-8 flex gap-3">
        <button onclick={() => showModal = false} class="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors">취소</button>
        <button onclick={save} class="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors">저장하기</button>
      </div>
    </div>
  </div>
{/if}
