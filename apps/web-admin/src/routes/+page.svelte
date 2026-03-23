<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import { Line, Doughnut } from 'svelte-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    ArcElement,
    Filler
  } from 'chart.js';

  ChartJS.register(
    Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale, ArcElement, Filler
  );

  let products: any[] = $state([]);
  let reviews: any[] = $state([]);
  let orders: any[] = $state([]);
  let totalRevenue = $state(0);

  const statusMap: any = {
    'PREPARING': { label: '준비중', color: 'bg-blue-100 text-blue-700' },
    'ACTIVE': { label: '판매중', color: 'bg-emerald-100 text-emerald-700' },
    'OUT_OF_STOCK': { label: '품절', color: 'bg-rose-100 text-rose-700' },
    'HIDDEN': { label: '숨김', color: 'bg-gray-100 text-gray-700' }
  };

  onMount(async () => {
    try {
      products = await api.get('/api/order/api/products');
      reviews = await api.get('/api/order/api/reviews/product/1').catch(() => []);
      orders = await api.get('/api/order/api/orders').catch(() => []);
    } catch (e) {
      console.error(e);
    }
  });

  $effect(() => {
    totalRevenue = orders.reduce((s: number, o: any) => s + (o.total_price || 0), 0);
  });

  let lineChartData = $derived.by(() => {
    if (!orders || orders.length === 0) return { labels: [], datasets: [] };
    
    const revenueByDate: Record<string, number> = {};
    const sortedOrders = [...orders].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    sortedOrders.forEach(order => {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      revenueByDate[date] = (revenueByDate[date] || 0) + (order.total_price || 0);
    });

    return {
      labels: Object.keys(revenueByDate),
      datasets: [
        {
          label: '일별 매출 (원)',
          fill: true,
          tension: 0.3,
          backgroundColor: 'rgba(79, 70, 229, 0.2)',
          borderColor: 'rgba(79, 70, 229, 1)',
          pointBorderColor: 'rgba(79, 70, 229, 1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 2,
          pointHoverRadius: 5,
          pointRadius: 4,
          data: Object.values(revenueByDate),
        }
      ]
    };
  });

  let doughnutChartData = $derived.by(() => {
    if (!products || products.length === 0) return { labels: [], datasets: [] };

    const statusCounts: Record<string, number> = {
      '판매중': 0,
      '준비중': 0,
      '품절': 0,
      '숨김': 0
    };

    products.forEach(p => {
      const label = statusMap[p.status]?.label || '기타';
      if (statusCounts[label] !== undefined) {
        statusCounts[label]++;
      }
    });

    const labels = Object.keys(statusCounts).filter(k => statusCounts[k] > 0);
    const data = labels.map(k => statusCounts[k]);

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            '#10b981', '#3b82f6', '#f43f5e', '#9ca3af'
          ],
          hoverBackgroundColor: [
            '#059669', '#2563eb', '#e11d48', '#6b7280'
          ],
          borderWidth: 0,
        }
      ]
    };
  });

  const stats = [
    { label: '전체 상품', value: () => products.length, icon: '📦', color: 'bg-indigo-50 text-indigo-600' },
    { label: '누적 주문', value: () => orders.length, icon: '🧾', color: 'bg-amber-50 text-amber-600' },
    { label: '재고 있음', value: () => products.filter((p: any) => p.stock_quantity > 0).length, icon: '✅', color: 'bg-emerald-50 text-emerald-600' },
    { label: '총 누적 매출', value: () => `${totalRevenue.toLocaleString()}원`, icon: '💰', color: 'bg-blue-50 text-blue-600' },
  ];
</script>

<div class="space-y-8">
  <!-- 통계 카드 -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
    {#each stats as stat}
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="w-10 h-10 rounded-xl {stat.color} flex items-center justify-center text-xl">
            {stat.icon}
          </div>
        </div>
        <div class="text-3xl font-extrabold text-gray-900">{stat.value()}</div>
        <div class="text-sm text-gray-500 mt-1">{stat.label}</div>
      </div>
    {/each}
  </div>

  <!-- 차트 영역 -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- 라인 차트: 매출 추이 -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
      <h2 class="font-bold text-gray-800 mb-4">일별 매출 추이</h2>
      <div class="h-64 relative">
        {#if lineChartData.labels.length > 0}
          <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
        {:else}
          <div class="flex h-full items-center justify-center text-gray-400">데이터가 없습니다.</div>
        {/if}
      </div>
    </div>

    <!-- 도넛 차트: 상품 상태 -->
    <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-1">
      <h2 class="font-bold text-gray-800 mb-4">상품 현황 비율</h2>
      <div class="h-64 relative flex items-center justify-center">
        {#if doughnutChartData.labels.length > 0}
          <Doughnut data={doughnutChartData} options={{ responsive: true, maintainAspectRatio: false, cutout: '70%' }} />
        {:else}
          <div class="text-gray-400">데이터가 없습니다.</div>
        {/if}
      </div>
    </div>
  </div>

  <!-- 상품 목록 미리보기 -->
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
      <h2 class="font-bold text-gray-800">최근 상품 목록</h2>
      <a href="/products" class="text-sm text-indigo-600 hover:underline">전체보기 →</a>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-gray-500 text-xs uppercase">
          <tr>
            <th class="px-6 py-3 text-left">ID</th>
            <th class="px-6 py-3 text-left">상품명</th>
            <th class="px-6 py-3 text-left">가격</th>
            <th class="px-6 py-3 text-left">재고</th>
            <th class="px-6 py-3 text-left">상태</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          {#each products.slice(0, 5) as p}
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 text-gray-400">#{p.id}</td>
              <td class="px-6 py-4 font-medium text-gray-800">{p.name}</td>
              <td class="px-6 py-4 text-indigo-600 font-semibold">{p.price?.toLocaleString()}원</td>
              <td class="px-6 py-4 text-gray-600">{p.stock_quantity}개</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 {statusMap[p.status]?.color || 'bg-gray-100 text-gray-600'} text-xs rounded-full font-medium">
                  {statusMap[p.status]?.label || p.status}
                </span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      {#if products.length === 0}
        <div class="text-center py-12 text-gray-400">상품 데이터를 불러오는 중...</div>
      {/if}
    </div>
  </div>
</div>
