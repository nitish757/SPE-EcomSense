package com.ecomsense.inventoryservice.service;

import com.ecomsense.inventoryservice.entity.DailyInventorySnapshot;
import com.ecomsense.inventoryservice.repo.DailyInventorySnapshotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeatureEngineeringService {
    private final DailyInventorySnapshotRepository snapshotRepo;

    public Map<String, Object> calculateFeatures(String storeId, String productId, LocalDate date) {
        // Fetch all previous sales for this store/product, ordered by date ascending
        List<DailyInventorySnapshot> history = snapshotRepo
                .findAll().stream()
                .filter(s -> s.getStoreId().equals(storeId) && s.getProductId().equals(productId) && s.getDate().isBefore(date))
                .sorted(Comparator.comparing(DailyInventorySnapshot::getDate))
                .collect(Collectors.toList());

        List<Integer> unitsSoldHistory = history.stream()
                .map(DailyInventorySnapshot::getUnitsSold)
                .collect(Collectors.toList());

        int size = unitsSoldHistory.size();
        Map<String, Object> features = new HashMap<>();

        // Lag features
        features.put("units_sold_lag_1", size > 0 ? unitsSoldHistory.get(size - 1) : null);
        features.put("units_sold_lag_7", size > 6 ? unitsSoldHistory.get(size - 7) : null);
        features.put("units_sold_lag_14", size > 13 ? unitsSoldHistory.get(size - 14) : null);

        // Rolling mean features
        features.put("units_sold_rollmean_7", size > 6 ?
                unitsSoldHistory.subList(size - 7, size).stream().mapToInt(i -> i).average().orElse(0) : null);
        features.put("units_sold_rollmean_14", size > 13 ?
                unitsSoldHistory.subList(size - 14, size).stream().mapToInt(i -> i).average().orElse(0) : null);
        features.put("units_sold_rollmean_28", size > 27 ?
                unitsSoldHistory.subList(size - 28, size).stream().mapToInt(i -> i).average().orElse(0) : null);

        return features;
    }
}

