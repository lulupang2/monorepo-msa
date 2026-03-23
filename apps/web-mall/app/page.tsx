"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import api from "../lib/api";
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Badge } from "@mall/ui";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
  content?: string;
}

const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await api.get("/api/order/api/products");
  return Array.isArray(data) ? data : data.id ? [data] : [];
};

import { HeroCarousel } from "../components/ui/HeroCarousel";

import { useCartStore } from "../lib/store";

export default function Home() {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product) => {
    addItem({
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: 1,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-2xl font-bold text-indigo-600 animate-bounce">로딩 중... 🚀</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center">
      {/* Hero Carousel Section */}
      <HeroCarousel />

      {/* Product List Section */}
      <main className="w-full max-w-7xl px-8 md:px-12 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">추천 상품 🔥</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">고객님을 위한 특별한 상품들을 모아봤어요.</p>
          </div>
          <Badge variant="outline" className="text-sm px-4 py-1.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">전체보기 ➔</Badge>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-slate-300 rounded-2xl">
            <p className="text-slate-500 text-lg">아직 등록된 상품이 없네요 🥲 </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <Card key={product.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white/70 backdrop-blur-md">
                <Link href={`/product/${product.id}`}>
                  <div className="aspect-[4/3] bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center cursor-pointer overflow-hidden relative group-hover:scale-105 transition-transform duration-500">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => { e.currentTarget.src = "/images/no-image.png"; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100">
                        <img src="/images/no-image.png" alt="No image available" className="w-1/3 opacity-50 grayscale" />
                      </div>
                    )}
                  </div>
                </Link>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Link href={`/product/${product.id}`}>
                      <CardTitle className="text-xl font-bold hover:text-indigo-600 transition-colors cursor-pointer">{product.name}</CardTitle>
                    </Link>
                    {product.id === 2 && <Badge variant="destructive" className="animate-pulse">HOT</Badge>}
                  </div>
                  <CardDescription className="line-clamp-2 mt-2">{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-extrabold text-indigo-600">
                    {product.price.toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground ml-1">원</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md transition-all active:scale-95"
                  >
                    장바구니 담기
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
