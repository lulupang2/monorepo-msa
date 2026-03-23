package com.mall.apiorder.domain.order.controller;

import com.mall.apiorder.domain.order.entity.ShippingAddress;
import com.mall.apiorder.domain.order.repository.ShippingAddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipping-addresses")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ShippingAddressController {

    private final ShippingAddressRepository shippingAddressRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ShippingAddress>> getAddressesByUser(@PathVariable String userId) {
        return ResponseEntity.ok(shippingAddressRepository.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<ShippingAddress> addAddress(@RequestBody ShippingAddress address) {
        return ResponseEntity.ok(shippingAddressRepository.save(address));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        shippingAddressRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
