package com.mall.apiorder.domain.order.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mall.apiorder.domain.cart.dto.Cart;
import com.mall.apiorder.domain.cart.service.CartService;
import com.mall.apiorder.domain.order.dto.OrderPlaceRequest;
import com.mall.apiorder.domain.order.entity.Order;
import com.mall.apiorder.domain.order.entity.OrderItem;
import com.mall.apiorder.domain.order.entity.ShippingAddress;
import com.mall.apiorder.domain.order.repository.OrderRepository;
import com.mall.apiorder.domain.order.repository.ShippingAddressRepository;
import com.mall.apiorder.domain.product.entity.Product;
import com.mall.apiorder.domain.product.repository.ProductRepository;

import com.mall.apiorder.common.exception.BusinessException;
import com.mall.apiorder.common.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ShippingAddressRepository shippingAddressRepository;
    private final CartService cartService;
    private final RedisTemplate<String, String> redisTemplate;
    private final ProductRepository productRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Order> getOrdersByUserId(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Order placeOrder(OrderPlaceRequest request, String idempotencyKey) {
        String userId = request.getUserId();
        String redisKey = null;

        if (idempotencyKey != null && !idempotencyKey.isEmpty()) {
            redisKey = "idempotency:order:" + idempotencyKey;
            
            // 1. Try to acquire lock
            Boolean acquired = redisTemplate.opsForValue().setIfAbsent(redisKey, "processing", java.time.Duration.ofHours(24));
            if (Boolean.FALSE.equals(acquired)) {
                throw new BusinessException(ErrorCode.DUPLICATE_REQUEST);
            }
        }

        try {
            Cart cart = cartService.getCart(userId);
            if (cart.getItems() == null || cart.getItems().isEmpty()) {
                throw new BusinessException(ErrorCode.CART_EMPTY);
            }

            Order order = new Order(userId, "결제완료");
            // 배송지 정보 세팅 (주문에 박제)
            order.setRecipientName(request.getRecipientName());
            order.setPhone(request.getPhone());
            order.setZipcode(request.getZipcode());
            order.setAddress(request.getAddress());
            order.setDetail(request.getDetail());

            for (var item : cart.getItems()) {
                Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND));
                
                if (product.getStockQuantity() < item.getQuantity()) {
                    throw new BusinessException(ErrorCode.OUT_OF_STOCK);
                }
                
                product.decreaseStock(item.getQuantity());

                OrderItem orderItem = new OrderItem(
                    product.getId(),
                    item.getQuantity(),
                    product.getPrice()
                );
                order.addOrderItem(orderItem);
            }

            Order savedOrder = orderRepository.save(order);

            // "기본 배송지로 저장" 체크된 경우 처리
            if (request.isSaveAsDefault()) {
                saveOrUpdateShippingAddress(request);
            }

            // 주문 완료 후 장바구니 비우기
            redisTemplate.delete("cart:" + userId);

            if (redisKey != null) {
                redisTemplate.opsForValue().set(redisKey, savedOrder.getId().toString(), java.time.Duration.ofHours(24));
            }

            return savedOrder;
        } catch (Exception e) {
            if (redisKey != null) {
                redisTemplate.delete(redisKey);
            }
            throw e;
        }
    }

    private void saveOrUpdateShippingAddress(OrderPlaceRequest request) {
        // 기존 기본 배송지 해제
        Optional<ShippingAddress> existingDefault = shippingAddressRepository.findByUserIdAndIsDefaultTrue(request.getUserId());
        existingDefault.ifPresent(addr -> {
            addr.setDefault(false);
            shippingAddressRepository.save(addr);
        });

        ShippingAddress newAddr = new ShippingAddress();
        newAddr.setUserId(request.getUserId());
        newAddr.setName(request.getAddressName() != null ? request.getAddressName() : "기본배송지");
        newAddr.setRecipientName(request.getRecipientName());
        newAddr.setPhone(request.getPhone());
        newAddr.setZipcode(request.getZipcode());
        newAddr.setAddress(request.getAddress());
        newAddr.setDetail(request.getDetail());
        newAddr.setDefault(true);
        shippingAddressRepository.save(newAddr);
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order updateStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
