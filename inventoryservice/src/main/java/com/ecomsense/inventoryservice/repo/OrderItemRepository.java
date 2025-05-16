package com.ecomsense.inventoryservice.repo;

import com.ecomsense.inventoryservice.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {}

