<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api';

  interface User {
    id: number;
    email: string;
    nickname: string | null;
    createdAt: string;
  }

  let users: User[] = $state([]);
  let loading = $state(true);
  let error = $state('');
  let search = $state('');

  onMount(async () => {
    try {
      users = await api.get('/api/auth/users');
    } catch (e) {
      error = '회원 데이터를 불러오지 못했어요 😢';
    } finally {
      loading = false;
    }
  });

  let filtered = $derived(
    search
      ? users.filter(u => u.email.includes(search) || u.nickname?.includes(search))
      : users
  );
</script>

<div class="space-y-6">
  <div class="flex justify-between items-center gap-4">
    <h2 class="text-lg font-bold text-gray-800">회원 목록 ({users.length}명)</h2>
    <input
      bind:value={search}
      placeholder="이메일/닉네임 검색..."
      class="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-64"
    />
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
              <th class="px-6 py-3 text-left">ID</th>
              <th class="px-6 py-3 text-left">이메일</th>
              <th class="px-6 py-3 text-left">닉네임</th>
              <th class="px-6 py-3 text-left">가입일</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            {#each filtered as u}
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 text-gray-400 font-mono">#{u.id}</td>
                <td class="px-6 py-4 font-medium text-gray-800">{u.email}</td>
                <td class="px-6 py-4 text-gray-600">{u.nickname ?? '-'}</td>
                <td class="px-6 py-4 text-gray-500">
                  {new Date(u.createdAt).toLocaleDateString('ko-KR')}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
        {#if filtered.length === 0}
          <div class="text-center py-16 text-gray-400">
            {search ? '검색 결과가 없어요.' : '가입한 회원이 없어요.'}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
