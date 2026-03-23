package com.mall.apiorder.domain.order.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    @JsonProperty("user_id")
    private String userId;

    @Column(name = "item_count", nullable = false)
    @JsonProperty("item_count")
    private Integer itemCount;

    @Column(name = "total_price", nullable = false)
    @JsonProperty("total_price")
    private BigDecimal totalPrice;

    @Column(nullable = false)
    private String status; // 결제완료, 배송중, 배송완료, 취소

    @Column(name = "created_at", nullable = false, updatable = false)
    @JsonProperty("created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "recipient_name")
    @JsonProperty("recipient_name")
    private String recipientName;

    @Column(name = "phone")
    private String phone;

    @Column(name = "zipcode")
    private String zipcode;

    @Column(name = "address")
    private String address;

    @Column(name = "detail")
    private String detail;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonProperty("items")
    private java.util.List<OrderItem> items = new java.util.ArrayList<>();

    public Order(String userId, String status) {
        this.userId = userId;
        this.status = status;
        this.itemCount = 0;
        this.totalPrice = BigDecimal.ZERO;
    }

    public void addOrderItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
        calculateTotals();
    }

    private void calculateTotals() {
        this.itemCount = items.size();
        this.totalPrice = items.stream()
            .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
