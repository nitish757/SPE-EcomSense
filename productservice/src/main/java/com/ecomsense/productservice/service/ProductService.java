package com.ecomsense.productservice.service;

import com.ecomsense.productservice.entity.Product;
import com.ecomsense.productservice.repo.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
    }

    public List<Product> getProductsByCategory(String category) {

//        return productRepository.findByCategory(category);
        return productRepository.findByCategoryIgnoreCaseContaining(category);
        // or use searchByCategory(category);
    }

//    public Product createProduct(Product product) {
////        product.setProductId();
//        product.setCreatedAt(LocalDateTime.now());
//        product.setUpdatedAt(LocalDateTime.now());
//        return productRepository.save(product);
//    }

    public Product createProduct(Product product) {
    // Generate product ID (e.g., P0020)
        String newProductId = "P" + String.format("%04d", productRepository.count() + 1);
        product.setProductId(newProductId);
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product productDetails) {
        Product product = getProductById(id);

        product.setCategory(productDetails.getCategory());
        product.setUnitPrice(productDetails.getUnitPrice());
//        product.setDescription(productDetails.getDescription());
//        product.setImageUrl(productDetails.getImageUrl());
//        product.setActive(productDetails.isActive());
        product.setUpdatedAt(LocalDateTime.now());

        return productRepository.save(product);
    }

    public void deleteProduct(String id) {
        Product product = getProductById(id);
        // Soft delete
        product.setActive(false);
        product.setUpdatedAt(LocalDateTime.now());
        productRepository.save(product);
    }

    public Product restoreProduct(String id) {
        Product product = getProductById(id);
        product.setActive(true);
        product.setUpdatedAt(LocalDateTime.now());
        return productRepository.save(product);
    }
}