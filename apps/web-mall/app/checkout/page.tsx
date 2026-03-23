"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "../../lib/store";
import { useAuthStore } from "../../lib/authStore";
import { useToastStore } from "../../lib/toastStore";
import { Button, Card, CardContent } from "@mall/ui";
import { MapPin, Ticket, CreditCard, ChevronDown, CheckCircle2, ShieldCheck, Loader2, Search, X } from "lucide-react";
import api from "../../lib/api";

const PAYMENT_METHODS = [
  { id: "card", name: "신용/체크카드", icon: "💳" },
  { id: "kakao", name: "카카오페이", icon: "💛" },
  { id: "naver", name: "네이버페이", icon: "💚" },
  { id: "toss", name: "토스페이", icon: "💙" },
  { id: "vbank", name: "무통장입금", icon: "🏦" },
];

// --- 주소 검색 모달 컴포넌트 ---
function AddressSearchModal({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (addr: any) => void }) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!keyword.trim()) return;

    setIsLoading(true);
    setSearched(true);
    try {
      // 행안부 도로명주소 API (.env.local의 환경변수 사용)
      const API_KEY = process.env.NEXT_PUBLIC_JUSO_CONFIRM_KEY; 
      const res = await fetch(`https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${API_KEY}&currentPage=1&countPerPage=10&keyword=${encodeURIComponent(keyword)}&resultType=json`);
      const data = await res.json();
      
      if (data.results?.common?.errorCode !== "0") {
        console.error("API Error:", data.results?.common?.errorMessage);
        setResults([]);
      } else {
        setResults(data.results.juso || []);
      }
    } catch (error) {
      console.error("Search failed", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">주소 찾기 📍</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"><X size={20} /></button>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                autoFocus
                type="text" 
                placeholder="도로명, 건물명 또는 지번 입력" 
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <Button type="submit" className="bg-slate-900 dark:bg-indigo-600 rounded-2xl px-6 font-bold shadow-lg">검색</Button>
          </form>

          <div className="max-h-[400px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
                <Loader2 className="animate-spin text-indigo-500" size={40} />
                <p className="font-bold">주소를 찾는 중...</p>
              </div>
            ) : results.length > 0 ? (
              results.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => onSelect(item)}
                  className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 cursor-pointer transition-all group"
                >
                  <div className="flex gap-3 items-start">
                    <span className="mt-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-[10px] font-black text-slate-500 rounded uppercase shrink-0 tracking-tighter">도로명</span>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">{item.roadAddr}</p>
                  </div>
                  <div className="flex gap-3 items-start mt-2 opacity-60">
                    <span className="mt-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-[10px] font-black text-slate-500 rounded uppercase shrink-0 tracking-tighter">지번</span>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.jibunAddr}</p>
                  </div>
                  <p className="mt-3 text-xs font-mono text-indigo-500 font-black">{item.zipNo}</p>
                </div>
              ))
            ) : searched ? (
              <div className="py-20 text-center text-slate-400">
                <p className="text-4xl mb-4">🔍</p>
                <p className="font-bold">검색 결과가 없습니다.</p>
                <p className="text-sm mt-1">검색어를 다시 확인해주세요.</p>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-300">
                <p className="text-sm font-medium">찾으시려는 도로명이나 지번을 입력해주세요.</p>
                <p className="text-xs mt-2 opacity-60">예: 테헤란로 123, 가산디지털2로 1</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 나의 배송지 목록 모달 컴포넌트 ---
function AddressListModal({ isOpen, onClose, onSelect, userId }: { isOpen: boolean, onClose: () => void, onSelect: (addr: any) => void, userId: string }) {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchAddresses();
    }
  }, [isOpen, userId]);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/api/order/api/shipping-addresses/user/${userId}`);
      setAddresses(data || []);
    } catch (error) {
      console.error("Failed to fetch shipping addresses", error);
      // Mock data for demo if API fails
      setAddresses([
        { id: 1, name: "우리집", recipient_name: "김로키", phone: "010-1234-5678", zipcode: "06236", address: "서울특별시 강남구 테헤란로 123", detail: "스파크플러스 15층", is_default: true },
        { id: 2, name: "회사", recipient_name: "김로키", phone: "010-1234-5678", zipcode: "08501", address: "서울특별시 금천구 가산디지털2로 1", detail: "IT타워 1004호", is_default: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 italic">MY ADDRESSES 🏠</h3>
          <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-all shadow-sm active:scale-95"><X size={20} /></button>
        </div>
        
        <div className="p-6 max-h-[500px] overflow-y-auto space-y-4 custom-scrollbar bg-white dark:bg-slate-900">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-indigo-500" size={40} />
              <p className="font-bold text-slate-400">배송지를 불러오는 중...</p>
            </div>
          ) : addresses.length > 0 ? (
            addresses.map((addr) => (
              <div 
                key={addr.id} 
                onClick={() => onSelect(addr)}
                className="p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 cursor-pointer transition-all group relative overflow-hidden"
              >
                {addr.is_default && (
                  <span className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl shadow-lg">DEFAULT</span>
                )}
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-black text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{addr.name}</h4>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-bold text-slate-700 dark:text-slate-300">{addr.recipient_name} <span className="text-slate-400 font-medium ml-2">|</span> <span className="ml-2">{addr.phone}</span></p>
                  <p className="text-slate-500 dark:text-slate-400 leading-snug">
                    ({addr.zipcode}) {addr.address} {addr.detail}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-slate-400">
              <p className="text-4xl mb-4">🏚️</p>
              <p className="font-bold">저장된 배송지가 없습니다.</p>
              <p className="text-sm mt-1">새 배송지를 등록해보세요!</p>
            </div>
          )}
        </div>
        
        <div className="p-6 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800">
          <Button className="w-full bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-2xl font-black h-12 hover:scale-[1.02] transition-transform" onClick={onClose}>닫기</Button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, fetchCart, userId, clearCart } = useCartStore();
  const { isLoggedIn, user } = useAuthStore();
  const { showToast } = useToastStore();
  const [isProcessing, setIsProcessing] = useState(false);
   const [selectedPayment, setSelectedPayment] = useState("card");
  const [isAddrModalOpen, setIsAddrModalOpen] = useState(false);
  const [isAddrListModalOpen, setIsAddrListModalOpen] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const router = useRouter();

  // 폼 상태
  const [form, setForm] = useState({
    name: "",
    phone: "",
    zipcode: "",
    address: "",
    detail: "",
    memo: "",
  });

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0; 
  const shippingFee = 0;
  const finalPrice = totalPrice - discount + shippingFee;

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items.length, router]);

  const handlePlaceOrder = async () => {
    if (isProcessing) return;
    if (!form.name || !form.phone || !form.address) {
      showToast("배송지 정보를 모두 입력해주세요.", "error");
      return;
    }

    setIsProcessing(true);
    try {
      const idempotencyKey = crypto.randomUUID();
      const payload = {
        user_id: userId,
        recipient_name: form.name,
        phone: form.phone,
        zipcode: form.zipcode,
        address: form.address,
        detail: form.detail,
        save_as_default: saveAddress,
        address_name: "기본배송지" // 필요 시 추가 입력받을 수 있음
      };

      const { data } = await api.post(
        `/api/order/api/orders/place`,
        payload,
        {
          headers: { "Idempotency-Key": idempotencyKey }
        }
      );
      clearCart();
      showToast("주문이 완료되었습니다! 💳", "success");
      router.push(`/order/success/${data.id}`);
    } catch (e: any) {
      console.error("Checkout failed", e);
      showToast(e?.response?.data?.message || "결제 중 오류가 발생했습니다.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddrSelect = (selected: any) => {
    setForm(prev => ({
      ...prev,
      zipcode: selected.zipNo,
      address: selected.roadAddr,
      detail: ""
    }));
    setIsAddrModalOpen(false);
  };

  const handleAddrListSelect = (addr: any) => {
    setForm({
      name: addr.recipient_name,
      phone: addr.phone,
      zipcode: addr.zipcode,
      address: addr.address,
      detail: addr.detail,
      memo: form.memo,
    });
    setIsAddrListModalOpen(false);
  };

  if (items.length === 0) return null;

  return (
    <>
       <AddressSearchModal 
        isOpen={isAddrModalOpen} 
        onClose={() => setIsAddrModalOpen(false)} 
        onSelect={handleAddrSelect} 
      />
      <AddressListModal
        isOpen={isAddrListModalOpen}
        onClose={() => setIsAddrListModalOpen(false)}
        onSelect={handleAddrListSelect}
        userId={userId}
      />
      
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 space-y-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-8">주문/결제 💳</h1>
            </div>

            {/* 배송지 정보 */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-indigo-500" size={24} />
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">배송지 정보</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">받는 분</label>
                  <input type="text" name="name" value={form.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">연락처</label>
                  <input type="text" name="phone" value={form.phone} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                   <div className="flex justify-between items-center mb-1.5">
                    <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">배송 주소</label>
                    {isLoggedIn && (
                      <button 
                        onClick={() => setIsAddrListModalOpen(true)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline transition-all"
                      >
                        <MapPin size={14} /> 나의 배송지 목록
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2 mb-2">
                    <input type="text" name="zipcode" value={form.zipcode} onChange={handleInputChange} className="w-1/3 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none" placeholder="우편번호" readOnly />
                    <Button 
                      variant="outline" 
                      className="h-[50px] rounded-xl font-bold bg-white text-slate-700 border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
                      onClick={() => setIsAddrModalOpen(true)}
                    >
                      주소 찾기
                    </Button>
                  </div>
                  <input type="text" name="address" value={form.address} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none mb-2" readOnly />
                  <input type="text" name="detail" value={form.detail} onChange={handleInputChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="상세 주소를 입력해주세요" />
                </div>

                {isLoggedIn && (
                  <div className="md:col-span-2 flex items-center gap-2 py-2">
                    <input 
                      type="checkbox" 
                      id="save-address" 
                      checked={saveAddress} 
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="save-address" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                      이 배송지를 기본 배송지로 등록
                    </label>
                  </div>
                )}
                
                <div className="space-y-1.5 md:col-span-2 text-sm">
                  <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">배송 요청사항</label>
                  <select name="memo" value={form.memo} onChange={handleInputChange} className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer">
                    <option>문 앞에 두고 가주세요.</option>
                    <option>경비실에 맡겨주세요.</option>
                    <option>배송 전 연락 바랍니다.</option>
                    <option>직접 입력</option>
                  </select>
                </div>
              </div>
            </section>

            {/* 쿠폰 & 할인 */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <Ticket className="text-rose-500" size={24} />
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">할인 / 포인트</h2>
              </div>
              <div className="flex gap-4 items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                <div className="flex-1">
                  <p className="font-bold text-slate-800 dark:text-slate-200">보유 쿠폰 <span className="text-rose-500">2장</span></p>
                  <p className="text-sm text-slate-500">적용 가능한 쿠폰을 선택하세요.</p>
                </div>
                <Button variant="outline" className="rounded-xl font-bold">쿠폰 선택</Button>
              </div>
            </section>

            {/* 결제 수단 */}
            <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="text-emerald-500" size={24} />
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">결제 수단</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <div 
                    key={method.id} 
                    onClick={() => setSelectedPayment(method.id)}
                    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPayment === method.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 active:scale-95'}`}
                  >
                    {selectedPayment === method.id && (
                      <div className="absolute top-2 right-2 text-indigo-500">
                        <CheckCircle2 size={20} className="fill-indigo-100" />
                      </div>
                    )}
                    <div className="text-2xl mb-2">{method.icon}</div>
                    <div className={`font-bold ${selectedPayment === method.id ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>{method.name}</div>
                  </div>
                ))}
              </div>

              {selectedPayment === 'card' && (
                 <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                   안전한 신용카드 간편 결제를 지원합니다. 💳 (무이자 할부 적용 가능)
                 </div>
              )}
              {selectedPayment === 'toss' && (
                 <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm tracking-tight text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/30 font-semibold">
                   토스페이 결제 시 랜덤 캐시백 지급! 💙
                 </div>
              )}
            </section>
          </div>

          {/* Right Column: Sticky Summary */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xl sticky top-24">
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-6">최종 결제 금액</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>총 상품금액</span>
                  <span className="text-slate-800 dark:text-slate-200">{totalPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>배송비</span>
                  <span className="text-slate-800 dark:text-slate-200">+{shippingFee}원</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>할인금액</span>
                  <span className="text-rose-500">-{discount}원</span>
                </div>
              </div>

              <div className="h-px bg-slate-100 dark:bg-slate-800 w-full mb-6" />

              <div className="flex justify-between items-end mb-8">
                <span className="text-lg font-bold text-slate-800 dark:text-slate-200">총 결제예정금액</span>
                <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                  {finalPrice.toLocaleString()}<span className="text-xl ml-1">원</span>
                </span>
              </div>

              <Button 
                size="lg" 
                className={`w-full h-16 rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all ${isProcessing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1'}`}
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    결제 승인 중...
                  </>
                ) : (
                  `총 ${finalPrice.toLocaleString()}원 결제하기`
                )}
              </Button>

              <div className="mt-6 flex items-start gap-2 text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                <ShieldCheck size={18} className="text-emerald-500 flex-shrink-0" />
                <p>주문 내용을 확인하였으며 결제에 동의합니다. 안전결제 에스크로 서비스가 적용되어 있습니다.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
