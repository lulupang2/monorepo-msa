package com.mall.apiorder.domain.order.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "shipping_addresses")
@Getter
@Setter
@NoArgsConstructor
public class ShippingAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    @JsonProperty("user_id")
    private String userId;

    @Column(nullable = false)
    private String name; // 배송지 별칭 (집, 회사 등)

    @Column(name = "recipient_name", nullable = false)
    @JsonProperty("recipient_name")
    private String recipientName;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String zipcode;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String detail;

    @Column(name = "is_default")
    @JsonProperty("is_default")
    private boolean isDefault;
}
