package com.mall.apiorder.domain.product.service;

import com.mall.apiorder.domain.product.entity.Category;
import com.mall.apiorder.domain.product.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getRootCategories() {
        return categoryRepository.findByParentIsNull();
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다."));
    }

    @Transactional
    public Category createCategory(Category category, Long parentId) {
        if (parentId != null) {
            Category parent = getCategoryById(parentId);
            category.setParent(parent);
        }
        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Long id, Category updateData) {
        Category category = getCategoryById(id);
        category.setName(updateData.getName());
        category.setDescription(updateData.getDescription());
        return category;
    }

    @Transactional
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
