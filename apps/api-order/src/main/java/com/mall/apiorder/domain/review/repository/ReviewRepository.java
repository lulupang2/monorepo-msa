package com.mall.apiorder.domain.review.repository;

import com.mall.apiorder.domain.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct_IdOrderByCreatedAtDesc(Long productId);
    List<Review> findAllByOrderByCreatedAtDesc();
}
