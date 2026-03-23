package com.mall.apiorder.domain.cart.controller;

import com.mall.apiorder.domain.cart.dto.Cart;
import com.mall.apiorder.domain.cart.dto.CartItem;
import com.mall.apiorder.domain.cart.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {
    private final CartService cartService;

    @GetMapping("/{userId}")
    public Cart getCart(@PathVariable String userId) {
        return cartService.getCart(userId);
    }

    @PostMapping("/{userId}/add")
    public void addToCart(@PathVariable String userId, @RequestBody CartItem item) {
        cartService.addToCart(userId, item);
    }

    @DeleteMapping("/{userId}/remove/{productId}")
    public void removeFromCart(@PathVariable String userId, @PathVariable Long productId) {
        cartService.removeFromCart(userId, productId);
    }
}
