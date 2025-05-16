package com.ecomsense.inventoryservice.repo;

import com.ecomsense.inventoryservice.entity.DailyInventoryActivity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyInventoryActivityRepository extends JpaRepository<DailyInventoryActivity, Long> {}
