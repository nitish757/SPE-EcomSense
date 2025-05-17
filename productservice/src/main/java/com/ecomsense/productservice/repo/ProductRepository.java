package com.ecomsense.productservice.repo;

import com.ecomsense.productservice.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findByCategory(String category);
    List<Product> findByActiveTrue();

    List<Product> findByCategoryIgnoreCaseContaining(String category);

    // OR, for more control (native query for PostgreSQL):
    @Query("SELECT p FROM Product p WHERE LOWER(p.category) LIKE LOWER(CONCAT('%', :category, '%'))")
    List<Product> searchByCategory(@Param("category") String category);
}
