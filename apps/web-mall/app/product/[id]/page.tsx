"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import api from "@/lib/api";
import { Button, Badge, Card, CardContent, CardHeader, CardTitle, Input } from "@mall/ui";
import { useCartStore } from "@/lib/store";
import { useAuthStore } from "@/lib/authStore";
import { useToastStore } from "@/lib/toastStore";
import { ArrowLeft, ShoppingCart, Package, Star, Send, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useCallback } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
  content?: string;
}

interface Review {
  id: number;
  product_id: number;
  nickname: string;
  rating: number;
  content: string;
  created_at: string;
}

const fetchProduct = async (id: string): Promise<Product> => {
  const { data } = await api.get(`/api/order/api/products/${id}`);
  return data;
};

const fetchReviews = async (productId: string): Promise<Review[]> => {
  const { data } = await api.get(`/api/order/api/reviews/product/${productId}`);
  return Array.isArray(data) ? data : [];
};

const PRODUCT_EMOJIS: Record<number, string> = {
  1: "💻",
  2: "📱",
  3: "🎧",
  4: "⌨️",
  5: "🖥️",
};

function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={24}
            className={(hovered || value) >= star ? "fill-amber-400 text-amber-400" : "text-slate-200"}
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const { showToast } = useToastStore();
  const { user, isLoggedIn } = useAuthStore();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => fetchReviews(id),
    enabled: !!id,
  });

  const reviewMutation = useMutation({
    mutationFn: (review: { product_id: number; nickname: string; rating: number; content: string }) =>
      api.post("/api/order/api/reviews", review),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      setContent("");
      setRating(5);
      showToast("리뷰가 등록됐어요! 🎉", "success");
    },
  });

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: 1,
    });
    showToast(`🛒 "${product.name}" 을(를) 장바구니에 담았어요!`, "success");
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !content.trim()) return;
    reviewMutation.mutate({
      product_id: product.id,
      nickname: user?.nickname ?? "익명",
      rating,
      content,
    });
  };

  // Hooks moved to top to follow React Rules
  const images = product?.image_url?.split("\n").filter(Boolean) || [];
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-2xl font-bold text-indigo-600 animate-bounce">로딩 중... 🚀</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <p className="text-xl text-slate-500">상품을 찾을 수 없어요 🥲</p>
        <Button onClick={() => router.push("/")} variant="outline">
          홈으로 돌아가기
        </Button>
      </div>
    );
  }

  const emoji = PRODUCT_EMOJIS[product.id] ?? "🛍️";
  const isInStock = product.stock_quantity > 0;
  const avgRating = reviews.length > 0
    ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)
    : 4;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">뒤로가기</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24 space-y-8">
        {/* 상품 카드 */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className={`aspect-square bg-slate-100 relative group/carousel ${images.length > 0 ? 'overflow-hidden' : 'flex items-center justify-center'}`}>
              {images.length > 1 ? (
                <>
                  <div className="overflow-hidden h-full" ref={emblaRef}>
                    <div className="flex h-full">
                      {images.map((url, idx) => (
                        <div key={idx} className="flex-[0_0_100%] min-w-0 h-full">
                          <img 
                            src={url} 
                            alt={`${product.name} ${idx + 1}`} 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/images/no-image.png";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* 슬라이드 화살표 */}
                  <button 
                    onClick={() => emblaApi?.scrollPrev()}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-slate-800 opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-white active:scale-90 z-20"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => emblaApi?.scrollNext()}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center text-slate-800 opacity-0 group-hover/carousel:opacity-100 transition-all hover:bg-white active:scale-90 z-20"
                  >
                    <ChevronRight size={20} />
                  </button>
                  {/* 슬라이드 인디케이터 */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {images.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === selectedIndex ? 'bg-indigo-600 w-6' : 'bg-white/40 border border-black/5'}`} 
                      />
                    ))}
                  </div>
                </>
              ) : images.length === 1 ? (
                <img 
                  src={images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/no-image.png";
                  }}
                />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <img src="/images/no-image.png" alt="No Image" className="w-1/2 opacity-50" />
                  <span className="text-slate-300 font-bold tracking-tighter">IMAGE NOT FOUND</span>
                </div>
              )}

              {product.id === 2 && (
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="destructive" className="text-sm animate-pulse px-3 py-1">🔥 HOT</Badge>
                </div>
              )}
              {!isInStock && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                  <span className="bg-white text-slate-700 font-bold px-6 py-2 rounded-full text-lg">품절 😢</span>
                </div>
              )}
            </div>

            <div className="p-10 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < avgRating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                  ))}
                  <span className="text-sm text-slate-400 ml-2">({reviews.length}개 리뷰)</span>
                </div>

                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 leading-tight mb-3">{product.name}</h1>
                  <p className="text-slate-500 leading-relaxed text-base">{product.description}</p>
                </div>

                <div className="border-t border-b border-slate-100 py-6">
                  <p className="text-sm text-slate-400 mb-1">판매가</p>
                  <div className="text-4xl font-extrabold text-indigo-600">
                    {product.price.toLocaleString()}
                    <span className="text-lg font-normal text-slate-400 ml-1">원</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Package size={16} className={isInStock ? "text-emerald-500" : "text-rose-400"} />
                  <span className={isInStock ? "text-emerald-600 font-medium" : "text-rose-500 font-medium"}>
                    {isInStock ? `재고 ${product.stock_quantity}개 있음` : "현재 품절 상태입니다"}
                  </span>
                </div>
              </div>

              <div className="mt-10 space-y-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className="w-full h-14 text-base font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-40"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  {isInStock ? "장바구니에 담기" : "품절"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="w-full h-12 rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  쇼핑 계속하기
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 상품 상세 설명란 */}
        {product.content && (
          <div className="bg-white rounded-3xl shadow-sm p-8 md:p-12 mb-8">
            <h2 className="text-xl font-extrabold text-slate-900 mb-6 border-b border-slate-100 pb-4">
              상품 상세 정보 📜
            </h2>
            <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-[15px]">
              {product.content}
            </div>
          </div>
        )}

        {/* 리뷰 섹션 */}
        <div className="bg-white rounded-3xl shadow-sm p-8">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6">
            구매 후기 ⭐ <span className="text-slate-400 text-base font-normal ml-1">{reviews.length}개</span>
          </h2>

          {reviews.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <p className="text-3xl mb-3">🙈</p>
              <p>아직 작성된 리뷰가 없어요. 첫 번째 후기를 남겨보세요!</p>
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {reviews.map((review) => (
                <div key={review.id} className="border border-slate-100 rounded-2xl p-5 hover:border-indigo-100 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600">
                        {review.nickname[0]}
                      </div>
                      <span className="font-semibold text-slate-700">{review.nickname}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed pl-11">{review.content}</p>
                  <p className="text-xs text-slate-300 pl-11 mt-2">
                    {review.created_at ? new Date(review.created_at).toLocaleDateString("ko-KR") : "방금 전"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* 리뷰 작성 */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="font-bold text-slate-700 mb-4">
              {isLoggedIn ? "리뷰 작성하기 ✍️" : "로그인 후 리뷰를 작성할 수 있어요"}
            </h3>
            {isLoggedIn ? (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500 w-12">별점</span>
                  <StarRatingInput value={rating} onChange={setRating} />
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="솔직한 후기를 남겨주세요 🙏"
                  required
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-400 resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={reviewMutation.isPending}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 h-10"
                  >
                    <Send size={15} className="mr-2" />
                    {reviewMutation.isPending ? "등록 중..." : "후기 등록"}
                  </Button>
                </div>
              </form>
            ) : (
              <Button
                variant="outline"
                onClick={() => router.push("/login")}
                className="rounded-xl border-indigo-200 text-indigo-600 hover:bg-indigo-50"
              >
                로그인하고 후기 쓰기
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
