package com.mall.apiorder.common.exception;

import org.springframework.http.HttpStatus;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    OUT_OF_STOCK(HttpStatus.BAD_REQUEST, "재고가 부족합니다."),
    PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND, "상품을 찾을 수 없습니다."),
    CART_EMPTY(HttpStatus.BAD_REQUEST, "장바구니가 비어 있습니다."),
    ORDER_NOT_FOUND(HttpStatus.NOT_FOUND, "주문을 찾을 수 없습니다."),
    DUPLICATE_REQUEST(HttpStatus.CONFLICT, "이미 처리 중이거나 완료된 결제 요청입니다.");

    private final HttpStatus status;
    private final String message;
}
