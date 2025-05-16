package com.ecomsense.inventoryservice.service;

import com.ecomsense.inventoryservice.entity.DailyInventorySnapshot;
import com.ecomsense.inventoryservice.repo.DailyInventorySnapshotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {
    private final DailyInventorySnapshotRepository snapshotRepo;

    public List<DailyInventorySnapshot> getSnapshots() {
        return snapshotRepo.findAll();
    }

    public DailyInventorySnapshot getSnapshot(String productId, String storeId, LocalDate date) {
        return snapshotRepo.findByProductIdAndStoreIdAndSnapshotDate(productId, storeId, date)
                .orElse(null);
    }

    public DailyInventorySnapshot saveSnapshot(DailyInventorySnapshot snapshot) {
        return snapshotRepo.save(snapshot);
    }

    public void updateStock(String productId, String storeId, LocalDate date, int quantityChange) {
        DailyInventorySnapshot snapshot = getSnapshot(productId, storeId, date);
        if (snapshot == null) {
            snapshot = new DailyInventorySnapshot();
            snapshot.setProductId(productId);
            snapshot.setStoreId(storeId);
            snapshot.setSnapshotDate(date);
            snapshot.setQuantityAtBod(0);
            snapshot.setQuantityAtEod(0);
        }
        snapshot.setQuantityAtEod(snapshot.getQuantityAtEod() + quantityChange);
        snapshotRepo.save(snapshot);
    }
}
