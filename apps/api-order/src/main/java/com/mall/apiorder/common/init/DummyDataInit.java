package com.mall.apiorder.common.init;

import com.mall.apiorder.domain.product.entity.Product;
import com.mall.apiorder.domain.product.repository.ProductRepository;
import com.mall.apiorder.domain.review.entity.Review;
import com.mall.apiorder.domain.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DummyDataInit implements CommandLineRunner {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        if (reviewRepository.count() == 0) {
            List<Product> products = productRepository.findAll();
            if (products.isEmpty()) {
                System.out.println("⚠️ [DummyDataInit] 등록된 상품이 없어 리뷰 더미를 생성하지 않습니다.");
                return;
            }

            Product p1 = products.get(0);
            Product p2 = products.size() > 1 ? products.get(1) : p1;
            Product p3 = products.size() > 2 ? products.get(2) : p1;

            List<Review> reviews = List.of(
                new Review(p1, "행복한쇼퍼", 5, "배송도 빠르고 상품도 너무 마음에 들어요! 강력 추천합니다."),
                new Review(p1, "고민남", 4, "생각보다 괜찮네요. 가성비 좋은 것 같습니다."),
                new Review(p1, "단골손님", 5, "역시 여기서 사는 건 실패가 없어요. 최고!"),
                new Review(p2, "까탈쟁이", 3, "그냥 무난무난합니다. 배송이 하루 늦었어요."),
                new Review(p3, "패션피플", 5, "핏이 너무 예뻐서 매일 입고 다닙니다 ㅎㅎㅎ")
            );
            reviewRepository.saveAll(reviews);
            System.out.println("✅ [DummyDataInit] 리뷰 더미 데이터 5건 생성 완료!");
        }
    }
}
