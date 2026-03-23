package com.mall.apiorder.domain.cart.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cart implements Serializable {
    @JsonProperty("user_id")
    private String userId;
    
    @Builder.Default
    private List<CartItem> items = new ArrayList<>();

    public void addItem(CartItem newItem) {
        if (items == null) {
            items = new ArrayList<>();
        }
        items.removeIf(item -> item.getProductId().equals(newItem.getProductId()));
        items.add(newItem);
    }

    public void removeItem(Long productId) {
        if (items != null) {
            items.removeIf(item -> item.getProductId().equals(productId));
        }
    }
}
