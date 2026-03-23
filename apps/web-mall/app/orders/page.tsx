"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../../lib/authStore";
import api from "../../lib/api";
import { Card, CardContent, Badge } from "@mall/ui";
import { Package, Truck, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const { user, isLoggedIn } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const currentUserId = isLoggedIn && user?.id ? user.id : "guest-user";
        const { data } = await api.get(`/api/order/api/orders/user/${currentUserId}`);
        setOrders(data || []);
      } catch (e) {
        console.error("Failed to fetch orders", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [user?.id, isLoggedIn]);

  const getStatusConfig = (status: string) => {
    switch(status) {
      case "결제완료": return { color: "bg-indigo-100 text-indigo-700", icon: Package };
      case "배송중": return { color: "bg-blue-100 text-blue-700", icon: Truck };
      case "배송완료": return { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 };
      default: return { color: "bg-slate-100 text-slate-700", icon: Package };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 px-8 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">주문 내역 📦</h1>
          <p className="text-slate-500 mt-2">지금까지 주문하신 상품들을 확인해 보세요.</p>
        </div>

        {isLoading ? (
          <div className="py-32 flex flex-col items-center text-slate-400 font-bold space-y-4">
            <Loader2 className="animate-spin text-indigo-500" size={48} />
            <p>주문 내역을 불러오는 중...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in duration-500">
            <div className="text-6xl mb-6">📭</div>
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">주문 내역이 없네요!</h2>
            <p className="text-slate-500 mb-8">아직 구매하신 상품이 없습니다.</p>
            <Link href="/">
              <button className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg transition-all active:scale-95">쇼핑하러 가기</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const StatusIcon = getStatusConfig(order.status).icon;
              return (
                <Card key={order.id} className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl hover:shadow-md transition-shadow animate-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-slate-100/50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {new Date(order.created_at).toLocaleDateString("ko-KR", {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })} 주문
                      </span>
                      <span className="text-sm font-mono text-slate-400">ORD-{order.id}</span>
                    </div>
                    <Badge className={`${getStatusConfig(order.status).color} px-3 py-1 text-sm border-0 font-bold flex items-center gap-2 shadow-sm`}>
                      <StatusIcon size={16} />
                      {order.status}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center cursor-pointer group">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                          🛍️
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                            총 {order.item_count}개 상품
                          </h3>
                          <p className="text-slate-500 mt-1">
                            총 결제 금액: <span className="font-bold text-slate-800 dark:text-slate-200">{order.total_price.toLocaleString()}원</span>
                          </p>
                        </div>
                      </div>
                      <button className="p-3 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 rounded-full transition-colors flex flex-col items-center text-xs gap-1 font-bold">
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}
