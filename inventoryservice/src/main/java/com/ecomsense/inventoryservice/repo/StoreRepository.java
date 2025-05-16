package com.ecomsense.inventoryservice.repo;

import com.ecomsense.inventoryservice.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreRepository extends JpaRepository<Store, String> {}

