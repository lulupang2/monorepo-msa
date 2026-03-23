package com.mall.apiorder.domain.order.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderPlaceRequest {
    @JsonProperty("user_id")
    private String userId;
    
    @JsonProperty("recipient_name")
    private String recipientName;
    
    private String phone;
    private String zipcode;
    private String address;
    private String detail;
    
    @JsonProperty("save_as_default")
    private boolean saveAsDefault;
    
    @JsonProperty("address_name")
    private String addressName; // 배송지 별칭 (저장 시 사용)
}
