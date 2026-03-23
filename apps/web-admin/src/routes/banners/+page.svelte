<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api';

  let banners: any[] = $state([]);
  let isLoading = $state(false);
  let showModal = $state(false);
  let editTarget: any = $state(null);
  
  let form = $state({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    sort_order: 0,
    is_active: true
  });

  onMount(load);

  async function load() {
    isLoading = true;
    try {
      banners = await api.get('/api/order/api/banners');
    } catch (e) {
      alert('배너를 불러오지 못했어요 😢');
    } finally {
      isLoading = false;
    }
  }

  function openCreate() {
    editTarget = null;
    form = { title: '', description: '', image_url: '', link_url: '', sort_order: banners.length + 1, is_active: true };
    showModal = true;
  }

  function openEdit(b: any) {
    editTarget = b;
    form = { ...b };
    showModal = true;
  }

  async function save() {
    try {
      if (editTarget) {
        await api.put(`/api/order/api/banners/${editTarget.id}`, form);
      } else {
        await api.post('/api/order/api/banners', form);
      }
      showModal = false;
      await load();
      alert('배너가 저장되었습니다! ✨');
    } catch (e) {
      alert('저장 실패 😭');
    }
  }

  async function deleteBanner(id: number) {
    if (!confirm('정말 삭제할까요? 😱')) return;
    try {
      await api.delete(`/api/order/api/banners/${id}`);
      await load();
    } catch (e) {
      alert('삭제 실패 😭');
    }
  }
</script>

<div class="space-y-8">
  <div class="flex justify-between items-center">
    <div>
      <h2 class="text-3xl font-black text-gray-900 tracking-tight">히어로 배너 관리 🚩</h2>
      <p class="text-slate-400 mt-1">메인 페이지 최상단 캐러셀을 관리합니다.</p>
    </div>
    <button onclick={openCreate} class="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
      + 새 배너 추가
    </button>
  </div>

  {#if isLoading}
    <div class="py-20 text-center text-gray-400 animate-pulse">데이터 로딩 중... 🚀</div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each banners as b}
        <div class="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
          <div class="aspect-[21/9] relative bg-slate-100 overflow-hidden">
            <img src={b.image_url} alt={b.title} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute top-4 right-4 flex gap-2">
              <span class="px-3 py-1 {b.is_active ? 'bg-emerald-500' : 'bg-slate-400'} text-white text-[10px] font-black rounded-lg uppercase shadow-sm">
                {b.is_active ? 'Active' : 'Hidden'}
              </span>
              <span class="px-3 py-1 bg-white/90 text-indigo-600 text-[10px] font-black rounded-lg shadow-sm border border-indigo-50">
                Order {b.sort_order}
              </span>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <h3 class="font-black text-lg text-slate-800 truncate">{b.title}</h3>
              <p class="text-sm text-slate-400 truncate mt-1 italic">{b.description}</p>
            </div>
            <div class="flex gap-2 pt-2">
              <button onclick={() => openEdit(b)} class="flex-1 py-2.5 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                수정
              </button>
              <button onclick={() => deleteBanner(b.id)} class="px-4 py-2.5 text-rose-400 hover:bg-rose-50 rounded-xl transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>

    {#if banners.length === 0}
      <div class="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
        <p class="text-slate-400 font-bold">등록된 배너가 없습니다. 🏳️</p>
      </div>
    {/if}
  {/if}
</div>

{#if showModal}
  <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden transform transition-all scale-100">
      <div class="p-10">
        <h3 class="text-2xl font-black text-slate-900 mb-8">{editTarget ? '배너 정보 수정 ✏️' : '새 히어로 배너 🚩'}</h3>
        
        <div class="grid grid-cols-1 gap-6">
          <div class="space-y-2">
            <label class="block text-xs font-black text-slate-400 uppercase ml-1">Title</label>
            <input bind:value={form.title} class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold placeholder:text-slate-300" placeholder="시선을 끄는 제목을 입력하세요" />
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-black text-slate-400 uppercase ml-1">Description</label>
            <input bind:value={form.description} class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-300" placeholder="간략한 설명을 덧붙여보세요" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block text-xs font-black text-slate-400 uppercase ml-1">Sort Order</label>
              <input type="number" bind:value={form.sort_order} class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono font-bold" />
            </div>
            <div class="space-y-2">
              <label class="block text-xs font-black text-slate-400 uppercase ml-1">Active Status</label>
              <div class="flex items-center gap-4 h-[54px] px-2">
                <label class="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" bind:checked={form.is_active} class="w-5 h-5 rounded-lg border-2 border-slate-200 text-indigo-600 focus:ring-0 transition-all cursor-pointer" />
                  <span class="text-sm font-bold {form.is_active ? 'text-indigo-600' : 'text-slate-400'} group-hover:text-indigo-500 transition-colors">활성화</span>
                </label>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-black text-slate-400 uppercase ml-1">Image URL</label>
            <textarea bind:value={form.image_url} rows="2" class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono text-xs text-indigo-600 resize-none" placeholder="https://images.unsplash.com/..."></textarea>
          </div>

          <div class="space-y-2">
            <label class="block text-xs font-black text-slate-400 uppercase ml-1">Link URL</label>
            <input bind:value={form.link_url} class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-mono text-xs placeholder:text-slate-300" placeholder="/products/3" />
          </div>
        </div>

        <div class="flex gap-4 mt-12">
          <button onclick={() => showModal = false} class="flex-1 py-4 bg-slate-50 text-slate-400 font-bold rounded-2xl hover:bg-slate-100 transition-all">
            취소
          </button>
          <button onclick={save} class="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1 active:translate-y-0">
            {editTarget ? '변경사항 저장' : '배너 등록하기'}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
