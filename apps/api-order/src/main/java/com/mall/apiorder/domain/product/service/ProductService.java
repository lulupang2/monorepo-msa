package com.mall.apiorder.domain.product.service;

import com.mall.apiorder.domain.product.entity.Category;
import com.mall.apiorder.domain.product.entity.Product;
import com.mall.apiorder.domain.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;

    public ProductService(ProductRepository productRepository, CategoryService categoryService) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));
    }

    @Transactional
    public Product createProduct(Product product, Long categoryId) {
        if (categoryId != null) {
            Category category = categoryService.getCategoryById(categoryId);
            product.setCategory(category);
        }
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, Product updateData, Long categoryId) {
        Product product = getProductById(id);
        product.setName(updateData.getName());
        product.setDescription(updateData.getDescription());
        product.setPrice(updateData.getPrice());
        product.setStockQuantity(updateData.getStockQuantity());
        product.setStatus(updateData.getStatus());
        product.setImageUrl(updateData.getImageUrl());
        product.setContent(updateData.getContent());
        
        if (categoryId != null) {
            Category category = categoryService.getCategoryById(categoryId);
            product.setCategory(category);
        } else {
            product.setCategory(null);
        }
        
        return product;
    }

    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
