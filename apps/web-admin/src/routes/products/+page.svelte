<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api';

  let products: any[] = $state([]);
  let categories: any[] = $state([]);
  
  let filterId = $state('');
  let filterKeyword = $state('');
  let filterCategoryId = $state('ALL');
  let filterStatus = $state('ALL');
  let filterStartDate = $state('');
  let filterEndDate = $state('');
  let filterMinPrice = $state<number | null>(null);
  let filterMaxPrice = $state<number | null>(null);

  const statusMap: any = {
    'PREPARING': { label: '준비중', color: 'bg-blue-100 text-blue-700' },
    'ACTIVE': { label: '판매중', color: 'bg-emerald-100 text-emerald-700' },
    'OUT_OF_STOCK': { label: '품절', color: 'bg-rose-100 text-rose-700' },
    'HIDDEN': { label: '숨김', color: 'bg-gray-100 text-gray-700' }
  };

  onMount(async () => { await load(); });

  async function load() {
    products = await api.get('/api/order/api/products');
    categories = await api.get('/api/order/api/categories');
  }

  let filteredProducts = $derived.by(() => {
    return products.filter((p: any) => {
      if (filterId && String(p.id) !== filterId) return false;
      if (filterKeyword) {
        const kw = filterKeyword.toLowerCase();
        if (!(p.name?.toLowerCase().includes(kw) || p.description?.toLowerCase().includes(kw))) return false;
      }
      if (filterCategoryId !== 'ALL' && String(p.category_id) !== String(filterCategoryId)) return false;
      if (filterStatus !== 'ALL' && p.status !== filterStatus) return false;
      if (filterStartDate || filterEndDate) {
        const pDate = p.created_at ? p.created_at.substring(0, 10) : '';
        if (filterStartDate && pDate < filterStartDate) return false;
        if (filterEndDate && pDate > filterEndDate) return false;
      }
      if (filterMinPrice !== null && p.price < filterMinPrice) return false;
      if (filterMaxPrice !== null && p.price > filterMaxPrice) return false;
      return true;
    });
  });
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center">
    <h2 class="text-2xl font-black text-gray-900 tracking-tight">상품 관리 <span class="text-indigo-500 text-base font-medium ml-2">Total {products.length}</span></h2>
    <a href="/products/new" class="px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-0.5">
      + 신규 상품 등록
    </a>
  </div>

  <!-- 필터 섹션 -->
  <div class="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
    <div class="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-widest text-xs">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      Search Filters
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div>
        <label class="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1">Keyword</label>
        <input type="text" bind:value={filterKeyword} class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-300" placeholder="상품명, 설명 검색" />
      </div>
      <div>
        <label class="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1">Category</label>
        <select bind:value={filterCategoryId} class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer">
          <option value="ALL">전체 카테고리</option>
          {#each categories as cat}
            <option value={cat.id}>{cat.name}</option>
            {#each cat.children || [] as child}
              <option value={child.id}>&nbsp;&nbsp;ㄴ {child.name}</option>
            {/each}
          {/each}
        </select>
      </div>
      <div>
        <label class="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1">Status</label>
        <select bind:value={filterStatus} class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-3 text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer">
          <option value="ALL">모든 상태</option>
          <option value="ACTIVE">판매중</option>
          <option value="PREPARING">준비중</option>
          <option value="OUT_OF_STOCK">품절</option>
          <option value="HIDDEN">숨김</option>
        </select>
      </div>
      <div>
        <label class="block text-[11px] font-black text-slate-400 uppercase mb-2 ml-1">Price Range</label>
        <div class="flex items-center gap-2">
          <input type="number" bind:value={filterMinPrice} class="w-full bg-slate-50 border-2 border-slate-50 rounded-xl px-3 py-3 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" placeholder="Min" />
          <span class="text-slate-300 font-bold">-</span>
          <input type="number" bind:value={filterMaxPrice} class="w-full bg-slate-50 border-2 border-slate-50 rounded-xl px-3 py-3 text-xs focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" placeholder="Max" />
        </div>
      </div>
    </div>
  </div>

  <!-- 테이블 섹션 -->
  <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest">
          <tr>
            <th class="px-8 py-5 text-left font-mono">ID</th>
            <th class="px-8 py-5 text-left">Photo</th>
            <th class="px-8 py-5 text-left">Category</th>
            <th class="px-8 py-5 text-left">Product</th>
            <th class="px-8 py-5 text-left">Price</th>
            <th class="px-8 py-5 text-left">Stock</th>
            <th class="px-8 py-5 text-left">Status</th>
            <th class="px-8 py-5 text-left">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          {#each filteredProducts as p}
            <tr class="hover:bg-slate-50/50 transition-colors group">
              <td class="px-8 py-6 text-slate-300 font-mono text-xs">#{p.id}</td>
              <td class="px-8 py-6">
                <div class="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-100 shadow-sm">
                  {#if p.image_url}
                    <img 
                      src={p.image_url.split('\n')[0]} 
                      alt={p.name} 
                      class="w-full h-full object-cover"
                      onerror={(e) => { e.currentTarget.src = '/images/no-image.png' }}
                    />
                  {:else}
                    <img src="/images/no-image.png" alt="No Image" class="w-full h-full object-cover opacity-50" />
                  {/if}
                </div>
              </td>
              <td class="px-8 py-6">
                <span class="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-lg uppercase">{p.category_name || 'Unassigned'}</span>
              </td>
              <td class="px-8 py-6">
                <div class="font-bold text-slate-800 text-base mb-1">{p.name}</div>
                <div class="text-xs text-slate-400 truncate max-w-[240px] italic">{p.description}</div>
              </td>
              <td class="px-8 py-6 font-black text-indigo-600 text-base">{p.price?.toLocaleString()}원</td>
              <td class="px-8 py-6 text-slate-500 font-medium">{p.stock_quantity}개</td>
              <td class="px-8 py-6">
                <span class="px-3 py-1.5 {statusMap[p.status]?.color || 'bg-slate-100 text-slate-600'} text-[11px] rounded-xl font-black uppercase">
                  {statusMap[p.status]?.label || p.status}
                </span>
              </td>
              <td class="px-8 py-6 text-right">
                <a href="/products/{p.id}" class="inline-flex items-center justify-center px-4 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm shadow-indigo-100 border border-indigo-100">
                  수정
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      {#if filteredProducts.length === 0}
        <div class="text-center py-24">
          <div class="text-4xl mb-4">🔍</div>
          <div class="text-slate-400 font-bold text-lg">일치하는 상품이 없습니다.</div>
          <p class="text-slate-300 text-sm mt-1">필터를 조정하거나 검색어를 확인해보세요.</p>
        </div>
      {/if}
    </div>
  </div>
</div>
