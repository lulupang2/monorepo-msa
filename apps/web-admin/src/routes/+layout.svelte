<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';

  const navItems = [
    { href: '/', icon: '📊', label: '대시보드' },
    { href: '/banners', icon: '🚩', label: '히어로 배너 관리' },
    { href: '/products', icon: '📦', label: '상품 관리' },
    { href: '/categories', icon: '📂', label: '카테고리 관리' },
    { href: '/orders', icon: '🛒', label: '주문 관리' },
    { href: '/users', icon: '👥', label: '회원 관리' },
    { href: '/reviews', icon: '⭐', label: '리뷰 관리' },
  ];
</script>

<div class="flex h-screen bg-gray-100">
  <!-- 사이드바 -->
  <aside class="w-64 bg-[#1e1e2e] text-white flex flex-col shadow-2xl">
    <div class="px-6 py-6 border-b border-white/10">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-lg">🛍️</div>
        <div>
          <p class="font-extrabold text-lg leading-none">Mall Admin</p>
          <p class="text-xs text-slate-400 mt-0.5">관리자 콘솔</p>
        </div>
      </div>
    </div>

    <nav class="flex-1 px-4 py-4 space-y-1">
      {#each navItems as item}
        {@const isActive = page.url.pathname === item.href}
        <a
          href={item.href}
          class="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium
            {isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' : 'text-slate-400 hover:bg-white/10 hover:text-white'}"
        >
          <span class="text-base">{item.icon}</span>
          {item.label}
        </a>
      {/each}
    </nav>

    <div class="px-6 py-4 border-t border-white/10">
      <p class="text-xs text-slate-500">Mall Admin v1.0</p>
    </div>
  </aside>

  <!-- 메인 -->
  <div class="flex-1 flex flex-col overflow-hidden">
    <header class="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
      <h1 class="text-xl font-bold text-gray-800">
        {navItems.find(n => page.url.pathname === n.href)?.label ?? '관리자 페이지'}
      </h1>
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">A</div>
        <span class="text-sm font-medium text-gray-600">Admin</span>
      </div>
    </header>
    <main class="flex-1 overflow-auto p-8">
      <slot />
    </main>
  </div>
</div>
