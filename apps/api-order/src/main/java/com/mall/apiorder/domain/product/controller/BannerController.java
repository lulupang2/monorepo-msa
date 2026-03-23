package com.mall.apiorder.domain.product.controller;

import com.mall.apiorder.domain.product.entity.Banner;
import com.mall.apiorder.domain.product.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerController {
    private final BannerRepository bannerRepository;

    @GetMapping
    public List<Banner> getAllBanners(@RequestParam(required = false) Boolean activeOnly) {
        if (Boolean.TRUE.equals(activeOnly)) {
            return bannerRepository.findAllByIsActiveTrueOrderBySortOrderAsc();
        }
        return bannerRepository.findAllByOrderBySortOrderAsc();
    }

    @PostMapping
    public Banner createBanner(@RequestBody Banner banner) {
        return bannerRepository.save(banner);
    }

    @PutMapping("/{id}")
    public Banner updateBanner(@PathVariable Long id, @RequestBody Banner bannerDetails) {
        Banner banner = bannerRepository.findById(id).orElseThrow();
        banner.setTitle(bannerDetails.getTitle());
        banner.setDescription(bannerDetails.getDescription());
        banner.setImageUrl(bannerDetails.getImageUrl());
        banner.setLinkUrl(bannerDetails.getLinkUrl());
        banner.setSortOrder(bannerDetails.getSortOrder());
        banner.setActive(bannerDetails.isActive());
        return bannerRepository.save(banner);
    }

    @DeleteMapping("/{id}")
    public void deleteBanner(@PathVariable Long id) {
        bannerRepository.deleteById(id);
    }
}
