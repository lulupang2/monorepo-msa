package com.mall.apiorder.domain.order.repository;

import com.mall.apiorder.domain.order.entity.ShippingAddress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShippingAddressRepository extends JpaRepository<ShippingAddress, Long> {
    List<ShippingAddress> findByUserId(String userId);
    Optional<ShippingAddress> findByUserIdAndIsDefaultTrue(String userId);
}
