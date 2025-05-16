package com.ecomsense.inventoryservice.repo;

import com.ecomsense.inventoryservice.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {}
