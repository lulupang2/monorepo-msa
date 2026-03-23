package com.mall.apiorder.domain.review.service;

import com.mall.apiorder.domain.review.entity.Review;
import com.mall.apiorder.domain.review.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public List<Review> getReviewsByProductId(Long productId) {
        return reviewRepository.findByProduct_IdOrderByCreatedAtDesc(productId);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }

    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }
}
