package com.ecomsense.inventoryservice.service;

import com.ecomsense.inventoryservice.entity.DailyInventorySnapshot;
import com.ecomsense.inventoryservice.repo.DailyInventorySnapshotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
        return snapshotRepo.findByProductIdAndStoreIdAndDate(productId, storeId, date)
                .orElse(null);
    }

    public DailyInventorySnapshot saveSnap(DailyInventorySnapshot snapshot) {
        return snapshotRepo.save(snapshot);
    }

    public void saveSnapshots(List<DailyInventorySnapshot> snapshots) {
        snapshotRepo.saveAll(snapshots);
    }

    public List<DailyInventorySnapshot> getSnapshotsByYear(int year) {
        return snapshotRepo.findByYear(year);
    }

    public List<DailyInventorySnapshot> getSnapshotsByYearAndMonth(int year, int month) {
        return snapshotRepo.findByYearAndMonth(year, month);
    }

    public List<DailyInventorySnapshot> getSnapshotsByDate(LocalDate date) {
        return snapshotRepo.findByDate(date);
    }

    public List<DailyInventorySnapshot> getLatestSnapshots(int limit) {
        return snapshotRepo.findAllByOrderByDateDesc(PageRequest.of(0, limit));
    }
}