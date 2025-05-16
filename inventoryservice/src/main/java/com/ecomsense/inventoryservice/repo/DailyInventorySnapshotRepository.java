package com.ecomsense.inventoryservice.repo;

import com.ecomsense.inventoryservice.entity.DailyInventorySnapshot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface DailyInventorySnapshotRepository extends JpaRepository<DailyInventorySnapshot, Long> {
    Optional<DailyInventorySnapshot> findByProductIdAndStoreIdAndSnapshotDate(String productId, String storeId, LocalDate date);
}
