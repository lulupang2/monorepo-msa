package com.mall.apiorder.domain.product.controller;

import com.mall.apiorder.domain.product.entity.Product;
import com.mall.apiorder.domain.product.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Map<String, Object> body) {
        Product product = new Product(
            (String) body.get("name"),
            (String) body.get("description"),
            body.get("price") != null ? new java.math.BigDecimal(body.get("price").toString()) : null,
            body.get("stock_quantity") != null ? Integer.valueOf(body.get("stock_quantity").toString()) : null,
            (String) body.get("status"),
            (String) body.get("image_url"),
            (String) body.get("content")
        );
        Long categoryId = body.get("category_id") != null ? Long.valueOf(body.get("category_id").toString()) : null;
        return ResponseEntity.ok(productService.createProduct(product, categoryId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Product product = new Product(
            (String) body.get("name"),
            (String) body.get("description"),
            body.get("price") != null ? new java.math.BigDecimal(body.get("price").toString()) : null,
            body.get("stock_quantity") != null ? Integer.valueOf(body.get("stock_quantity").toString()) : null,
            (String) body.get("status"),
            (String) body.get("image_url"),
            (String) body.get("content")
        );
        Long categoryId = body.get("category_id") != null ? Long.valueOf(body.get("category_id").toString()) : null;
        return ResponseEntity.ok(productService.updateProduct(id, product, categoryId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
