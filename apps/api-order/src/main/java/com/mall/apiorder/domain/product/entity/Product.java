package com.mall.apiorder.domain.product.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.mall.apiorder.common.exception.BusinessException;
import com.mall.apiorder.common.exception.ErrorCode;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(name = "stock_quantity", nullable = false)
    @JsonProperty("stock_quantity")
    private Integer stockQuantity;

    @Column(nullable = false)
    @JsonProperty("status")
    private String status = "ACTIVE"; // PREPARING, ACTIVE, OUT_OF_STOCK, HIDDEN

    @Column(name = "image_url", columnDefinition = "TEXT")
    @JsonProperty("image_url")
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonIgnore
    private Category category;

    @Column(name = "created_at", nullable = false, updatable = false)
    @JsonProperty("created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Product(String name, String description, BigDecimal price, Integer stockQuantity, String status, String imageUrl, String content) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stockQuantity = stockQuantity;
        this.status = status != null ? status : "ACTIVE";
        this.imageUrl = imageUrl;
        this.content = content;
    }

    @JsonProperty("category_id")
    public Long getCategoryId() {
        return category != null ? category.getId() : null;
    }

    @JsonProperty("category_name")
    public String getCategoryName() {
        return category != null ? category.getName() : null;
    }

    public void decreaseStock(int quantity) {
        int restStock = this.stockQuantity - quantity;
        if (restStock < 0) {
            throw new BusinessException(ErrorCode.OUT_OF_STOCK);
        }
        this.stockQuantity = restStock;
    }
}
