<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { api } from '$lib/api';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import Quill from 'quill';
  import 'quill/dist/quill.snow.css';

  let categories: any[] = $state([]);
  let isEdit = $derived(!!page.params.id);
  let productId = $derived(page.params.id);
  
  let form = $state({
    name: '',
    description: '',
    price: 0,
    stock_quantity: 10,
    status: 'ACTIVE',
    category_id: null as number | null,
    image_url: '',
    content: ''
  });

  let editorElement: HTMLDivElement;
  let quill: Quill;
  let isLoading = $state(false);

  onMount(async () => {
    isLoading = true;
    try {
      categories = await api.get('/api/order/api/categories');
      if (isEdit) {
        const product = await api.get(`/api/order/api/products/${productId}`);
        form = {
          name: product.name,
          description: product.description,
          price: product.price,
          stock_quantity: product.stock_quantity,
          status: product.status || 'ACTIVE',
          category_id: product.category_id || null,
          image_url: product.image_url || '',
          content: product.content || ''
        };
      }
      
    } finally {
      isLoading = false;
    }
    await tick();
    initQuill();
  });

  function initQuill() {
    if (!editorElement) return;
    
    quill = new Quill(editorElement, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link', 'image', 'code-block'],
          ['clean']
        ]
      },
      placeholder: '상품의 상세 정보를 풍성하게 채워주세요... ✨'
    });

    if (form.content) {
      quill.root.innerHTML = form.content;
    }

    quill.on('text-change', () => {
      form.content = quill.root.innerHTML;
    });
  }

  async function save() {
    try {
      if (isEdit) {
        await api.put(`/api/order/api/products/${productId}`, form);
      } else {
        await api.post('/api/order/api/products', form);
      }
      alert(isEdit ? '상품이 수정됐어요! ✨' : '상품이 등록됐어요! ✅');
      goto('/products');
    } catch (e) {
      alert('저장 실패 😢');
    }
  }

  async function deleteProduct() {
    if (!confirm('정말 이 상품을 삭제할까요? 😱')) return;
    try {
      await api.delete(`/api/order/api/products/${productId}`);
      alert('삭제 완료 🗑️');
      goto('/products');
    } catch (e) {
      alert('삭제 실패 😭');
    }
  }
</script>

<div class="max-w-5xl mx-auto space-y-8 pb-20">
  <div class="flex items-center justify-between">
    <div class="space-y-1">
      <button onclick={() => goto('/products')} class="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1 mb-2 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        목록으로 돌아가기
      </button>
      <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">
        {isEdit ? '상품 정보 수정 📝' : '새 상품 등록 ✨'}
      </h2>
    </div>
    
    <div class="flex gap-3">
      {#if isEdit}
        <button onclick={deleteProduct} class="px-6 py-2.5 text-rose-500 font-bold hover:bg-rose-50 rounded-2xl transition-all border-2 border-transparent hover:border-rose-100">
          삭제하기
        </button>
      {/if}
      <button onclick={save} class="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
        {isEdit ? '변경사항 저장' : '상품 등록 완료'}
      </button>
    </div>
  </div>

  {#if isLoading}
    <div class="py-20 text-center text-gray-400">데이터 로딩 중... 🚀</div>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 기본 정보 섹션 -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 class="text-lg font-bold text-gray-800 border-b pb-4 border-gray-50">기본 정보</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2 font-mono uppercase tracking-tighter opacity-70">Product Name</label>
              <input bind:value={form.name} class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-lg font-bold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all placeholder:text-slate-300" placeholder="매력적인 상품 이름을 입력하세요" />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2 font-mono uppercase tracking-tighter opacity-70">Short Description</label>
              <textarea bind:value={form.description} rows="2" class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none placeholder:text-slate-300" placeholder="리스트에서 보여질 짧은 설명을 적어주세요"></textarea>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-bold text-gray-700 font-mono uppercase tracking-tighter opacity-70">Detailed Content (WYSIWYG)</label>
              <div class="editor-container rounded-2xl border-2 border-slate-100 overflow-hidden bg-white shadow-inner min-h-[450px]">
                <div bind:this={editorElement} class="h-[400px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 우측 설정 섹션 -->
      <div class="space-y-6">
        <!-- 판매 정보 -->
        <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 class="text-lg font-bold text-gray-800 border-b pb-4 border-gray-50">판매 설정</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2 font-mono uppercase tracking-tighter opacity-70">Price</label>
              <div class="relative">
                <input type="number" bind:value={form.price} class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-xl font-black text-indigo-600 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all pl-12" />
                <span class="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₩</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2 font-mono uppercase tracking-tighter opacity-70">Stock</label>
              <input type="number" bind:value={form.stock_quantity} class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2 font-mono uppercase tracking-tighter opacity-70">Status</label>
              <select bind:value={form.status} class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-base font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22currentColor%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m19%209-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_20px_center] bg-no-repeat">
                <option value="PREPARING">준비중 ⏳</option>
                <option value="ACTIVE">판매중 🚀</option>
                <option value="OUT_OF_STOCK">품절 🚫</option>
                <option value="HIDDEN">숨김 (판매종료) 🔒</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2 font-mono uppercase tracking-tighter opacity-70">Category</label>
              <select bind:value={form.category_id} class="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 text-base font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22currentColor%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m19%209-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px_20px] bg-[right_20px_center] bg-no-repeat">
                <option value={null}>미배정</option>
                {#each categories as cat}
                  <option value={cat.id}>{cat.name}</option>
                  {#each cat.children || [] as child}
                    <option value={child.id}>&nbsp;&nbsp;ㄴ {child.name}</option>
                  {/each}
                {/each}
              </select>
            </div>
          </div>
        </div>

        <!-- 이미지 정보 -->
        <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h3 class="text-lg font-bold text-gray-800 border-b pb-4 border-gray-50">이미지 설정</h3>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2 font-mono uppercase tracking-tighter opacity-70">Image URLs</label>
            <textarea bind:value={form.image_url} rows="4" class="w-full bg-indigo-50/30 border-2 border-indigo-50/30 rounded-2xl px-5 py-4 text-[10px] font-mono text-indigo-600 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none" placeholder="https://..."></textarea>
            <p class="mt-3 text-[10px] text-slate-400 leading-relaxed italic">* 엔터(줄바꿈)로 여러 개를 입력하면 사용자 상세 페이지에 자동으로 롤링 캐러셀이 생성됩니다.</p>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  :global(.ql-toolbar.ql-snow) {
    border: none !important;
    background: #f8fafc;
    padding: 12px 16px !important;
  }
  :global(.ql-container.ql-snow) {
    border: none !important;
    font-family: inherit !important;
    font-size: 16px !important;
  }
  :global(.ql-editor) {
    padding: 20px !important;
    min-height: 350px !important;
  }
  
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
