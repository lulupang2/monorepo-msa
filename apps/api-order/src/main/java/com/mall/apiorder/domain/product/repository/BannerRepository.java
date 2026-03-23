package com.mall.apiorder.domain.product.repository;

import com.mall.apiorder.domain.product.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Long> {
    List<Banner> findAllByOrderBySortOrderAsc();
    List<Banner> findAllByIsActiveTrueOrderBySortOrderAsc();
}
