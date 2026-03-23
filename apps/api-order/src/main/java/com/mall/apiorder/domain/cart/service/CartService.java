package com.mall.apiorder.domain.cart.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mall.apiorder.domain.cart.dto.Cart;
import com.mall.apiorder.domain.cart.dto.CartItem;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class CartService {
    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private static final String CART_PREFIX = "cart:";

    public Cart getCart(String userId) {
        String json = redisTemplate.opsForValue().get(CART_PREFIX + userId);
        if (json == null) {
            return Cart.builder().userId(userId).build();
        }
        try {
            return objectMapper.readValue(json, Cart.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize cart", e);
        }
    }

    public void addToCart(String userId, CartItem item) {
        Cart cart = getCart(userId);
        cart.addItem(item);
        saveCart(userId, cart);
    }

    public void removeFromCart(String userId, Long productId) {
        Cart cart = getCart(userId);
        cart.removeItem(productId);
        saveCart(userId, cart);
    }

    private void saveCart(String userId, Cart cart) {
        try {
            String json = objectMapper.writeValueAsString(cart);
            redisTemplate.opsForValue().set(CART_PREFIX + userId, json, 1, TimeUnit.DAYS);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize cart", e);
        }
    }
}
