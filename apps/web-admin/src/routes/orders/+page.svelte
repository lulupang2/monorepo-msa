<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import FilterBar from '$lib/components/FilterBar.svelte';

  interface Order {
    id: number;
    userId: string;
    item_count: number;
    total_price: number;
    status: string;
    created_at: string;
  }

  let orders: Order[] = $state([]);
  let loading = $state(true);
  let error = $state('');
  
  let filterId = $state('');
  let filterUserId = $state('');
  let filterStatus = $state('ALL');
  let filterStartDate = $state('');
  let filterEndDate = $state('');
  let filterMinPrice = $state<number | null>(null);
  let filterMaxPrice = $state<number | null>(null);

  const statusColors: Record<string, string> = {
    '결제완료': 'bg-blue-100 text-blue-700',
    '배송중':   'bg-amber-100 text-amber-700',
    '배송완료': 'bg-emerald-100 text-emerald-700',
    '취소':     'bg-rose-100 text-rose-700',
  };

  const statusOptions = ['결제완료', '배송중', '배송완료', '취소'];

  onMount(async () => {
    await load();
  });

  async function load() {
    loading = true;
    try {
      orders = await api.get('/api/order/api/orders');
    } catch (e) {
      error = '주문 데이터를 불러오지 못했어요 😢';
    } finally {
      loading = false;
    }
  }

  let filteredOrders = $derived.by(() => {
    return orders.filter(o => {
      if (filterId && String(o.id) !== filterId) return false;
      
      if (filterUserId && !o.userId?.toLowerCase().includes(filterUserId.toLowerCase())) return false;
      
      if (filterStatus !== 'ALL' && o.status !== filterStatus) return false;

      if (filterStartDate || filterEndDate) {
        const oDate = o.created_at ? o.created_at.substring(0, 10) : '';
        if (oDate) {
          if (filterStartDate && oDate < filterStartDate) return false;
          if (filterEndDate && oDate > filterEndDate) return false;
        }
      }

      if (filterMinPrice !== null && o.total_price < filterMinPrice) return false;
      if (filterMaxPrice !== null && o.total_price > filterMaxPrice) return false;

      return true;
    });
  });

  async function updateStatus(id: number, status: string) {
    try {
      await api.put(`/api/order/api/orders/${id}/status`, { status });
      orders = orders.map(o => o.id === id ? { ...o, status } : o);
    } catch (e) {
      alert('상태 변경 실패 😢');
    }
  }
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center gap-4">
    <h2 class="text-lg font-bold text-gray-800">주문 목록 ({orders.length}건)</h2>
    <div class="flex gap-2 text-sm flex-wrap">
      {#each statusOptions as s}
        <span class="px-2 py-1 rounded-lg {statusColors[s] ?? 'bg-gray-100 text-gray-600'} text-xs font-medium">
          {s}: {orders.filter(o => o.status === s).length}
        </span>
      {/each}
    </div>
  </div>

  <div class="bg-indigo-50/30 rounded-2xl p-6 border border-indigo-100/50 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.05)] mb-6 transition-all">
    <div class="font-extrabold text-indigo-900 mb-5 flex items-center gap-2 tracking-tight">
      <div class="p-1.5 bg-indigo-100/80 rounded-lg text-indigo-600">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>
      상세 검색 및 필터
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">주문 번호</label>
        <input type="text" bind:value={filterId} class="w-full bg-white focus:bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-800 placeholder-gray-300" placeholder="예: 1024" />
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">주문자 ID</label>
        <input type="text" bind:value={filterUserId} class="w-full bg-white focus:bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-800 placeholder-gray-300" placeholder="user_id 검색" />
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">진행 상태</label>
        <select bind:value={filterStatus} class="w-full bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-800 cursor-pointer">
          <option value="ALL">모든 상태</option>
          {#each statusOptions as s}
            <option value={s}>{s}</option>
          {/each}
        </select>
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">총 결제액 (원)</label>
        <div class="flex items-center gap-1.5">
          <input type="number" bind:value={filterMinPrice} class="w-full bg-white focus:bg-white border border-gray-200 shadow-sm rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-800 placeholder-gray-300" placeholder="최소" />
          <span class="text-gray-300 font-bold">-</span>
          <input type="number" bind:value={filterMaxPrice} class="w-full bg-white focus:bg-white border border-gray-200 shadow-sm rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-800 placeholder-gray-300" placeholder="최대" />
        </div>
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">결제일</label>
        <div class="flex items-center gap-1.5">
          <input type="date" bind:value={filterStartDate} class="w-full bg-white border border-gray-200 shadow-sm rounded-xl px-2 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-800" />
          <span class="text-gray-300 font-bold">-</span>
          <input type="date" bind:value={filterEndDate} class="w-full bg-white border border-gray-200 shadow-sm rounded-xl px-2 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-800" />
        </div>
      </div>
    </div>
  </div>

  {#if loading}
    <div class="text-center py-16 text-gray-400">불러오는 중... 🔄</div>
  {:else if error}
    <div class="text-center py-16 text-rose-400">{error}</div>
  {:else}
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th class="px-6 py-3 text-left">주문번호</th>
              <th class="px-6 py-3 text-left">주문자</th>
              <th class="px-6 py-3 text-left">상품 수</th>
              <th class="px-6 py-3 text-left">결제금액</th>
              <th class="px-6 py-3 text-left">주문일</th>
              <th class="px-6 py-3 text-left">상태</th>
              <th class="px-6 py-3 text-left">변경</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            {#each filteredOrders as o}
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 font-mono text-gray-400">#{o.id}</td>
                <td class="px-6 py-4 font-medium text-gray-800">{o.userId}</td>
                <td class="px-6 py-4 text-gray-600">{o.item_count}개</td>
                <td class="px-6 py-4 text-indigo-600 font-bold">{o.total_price.toLocaleString()}원</td>
                <td class="px-6 py-4 text-gray-500">{new Date(o.created_at).toLocaleDateString('ko-KR')}</td>
                <td class="px-6 py-4">
                  <span class="px-2.5 py-1 rounded-full text-xs font-medium {statusColors[o.status] ?? 'bg-gray-100 text-gray-600'}">
                    {o.status}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <select
                    onchange={(e) => updateStatus(o.id, (e.target as HTMLSelectElement).value)}
                    class="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  >
                    {#each statusOptions as s}
                      <option value={s} selected={s === o.status}>{s}</option>
                    {/each}
                  </select>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
        {#if filteredOrders.length === 0}
          <div class="text-center py-16 text-gray-400">
            주문 데이터가 없어요. 쇼핑몰에서 장바구니를 결제해보세요!
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
