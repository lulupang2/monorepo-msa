<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api';

  let reviews: any[] = $state([]);
  let loading = $state(true);

  let filterId = $state('');
  let filterProductId = $state('');
  let filterNickname = $state('');
  let filterRating = $state('ALL');
  let filterStartDate = $state('');
  let filterEndDate = $state('');

  onMount(() => loadReviews());

  async function loadReviews() {
    loading = true;
    try {
      reviews = await api.get('/api/order/api/reviews');
    } catch (e) {
      reviews = [];
    } finally {
      loading = false;
    }
  }

  let filteredReviews = $derived.by(() => {
    return reviews.filter(r => {
      if (filterId && String(r.id) !== filterId) return false;
      if (filterProductId && String(r.product_id) !== filterProductId) return false;
      if (filterNickname && !r.nickname?.toLowerCase().includes(filterNickname.toLowerCase())) return false;
      if (filterRating !== 'ALL' && String(r.rating) !== filterRating) return false;
      
      if (filterStartDate || filterEndDate) {
        const rDate = r.created_at ? r.created_at.substring(0, 10) : '';
        if (rDate) {
          if (filterStartDate && rDate < filterStartDate) return false;
          if (filterEndDate && rDate > filterEndDate) return false;
        }
      }
      return true;
    });
  });

  async function deleteReview(id: number) {
    if (!confirm('정말 삭제할까요?')) return;
    try {
      await api.delete(`/api/order/api/reviews/${id}`);
      reviews = reviews.filter(r => r.id !== id);
      alert('삭제됐어요! 🗑️');
    } catch (e) {
      alert('삭제 실패 😢 - API 문제일 수 있어요');
    }
  }

  const ratingColors = ['', 'bg-rose-100 text-rose-600', 'bg-orange-100 text-orange-600', 'bg-amber-100 text-amber-600', 'bg-lime-100 text-lime-700', 'bg-emerald-100 text-emerald-700'];
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center gap-4">
    <h2 class="text-lg font-bold text-gray-800">리뷰 관리 ({filteredReviews.length}건)</h2>
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
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">리뷰 ID</label>
        <input type="text" bind:value={filterId} class="w-full bg-white focus:bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-800 placeholder-gray-300" placeholder="예: 123" />
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">상품 ID</label>
        <input type="text" bind:value={filterProductId} class="w-full bg-white focus:bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-800 placeholder-gray-300" placeholder="예: 45" />
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">작성자 닉네임</label>
        <input type="text" bind:value={filterNickname} class="w-full bg-white focus:bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-800 placeholder-gray-300" placeholder="닉네임 부분 입력" />
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">별점</label>
        <select bind:value={filterRating} class="w-full bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-800 cursor-pointer">
          <option value="ALL">모든 별점</option>
          <option value="5">⭐⭐⭐⭐⭐ (5점)</option>
          <option value="4">⭐⭐⭐⭐ (4점)</option>
          <option value="3">⭐⭐⭐ (3점)</option>
          <option value="2">⭐⭐ (2점)</option>
          <option value="1">⭐ (1점)</option>
        </select>
      </div>
      <div class="md:col-span-2 lg:col-span-2">
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">작성일 기간</label>
        <div class="flex items-center gap-1.5 w-full md:w-1/2 lg:w-2/3">
          <input type="date" bind:value={filterStartDate} class="w-full bg-white border border-gray-200 shadow-sm rounded-xl px-2 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-800" />
          <span class="text-gray-300 font-bold">-</span>
          <input type="date" bind:value={filterEndDate} class="w-full bg-white border border-gray-200 shadow-sm rounded-xl px-2 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-800" />
        </div>
      </div>
    </div>
  </div>

  {#if loading}
    <div class="text-center py-16 text-gray-400">불러오는 중... 🔄</div>
  {:else}
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th class="px-6 py-3 text-left">리뷰 ID</th>
              <th class="px-6 py-3 text-left">상품 ID</th>
              <th class="px-6 py-3 text-left">작성자</th>
              <th class="px-6 py-3 text-left">별점</th>
              <th class="px-6 py-3 text-left">내용</th>
              <th class="px-6 py-3 text-left">작성일</th>
              <th class="px-6 py-3 text-left">관리</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            {#each filteredReviews as r}
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-gray-400 font-mono">#{r.id}</td>
                <td class="px-6 py-4 font-semibold text-indigo-500">#{r.product_id}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600">{r.nickname?.[0] || '?'}</div>
                    <span class="font-medium text-gray-800">{r.nickname}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 rounded-full text-xs font-bold {ratingColors[r.rating] ?? 'bg-gray-100'}">
                    {'⭐'.repeat(r.rating || 0)}
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-600 max-w-xs truncate" title={r.content}>{r.content}</td>
                <td class="px-6 py-4 text-gray-400 text-xs">{r.created_at ? new Date(r.created_at).toLocaleDateString('ko-KR') : '-'}</td>
                <td class="px-6 py-4">
                  <button onclick={() => deleteReview(r.id)} class="text-rose-400 hover:text-rose-600 text-xs font-medium">삭제</button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
        {#if filteredReviews.length === 0}
          <div class="text-center py-16 text-gray-400">조회된 리뷰가 없어요.</div>
        {/if}
      </div>
    </div>
  {/if}
</div>
