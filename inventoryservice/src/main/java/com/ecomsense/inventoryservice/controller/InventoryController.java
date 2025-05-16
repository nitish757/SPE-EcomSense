package com.ecomsense.inventoryservice.controller;

import com.ecomsense.inventoryservice.entity.DailyInventorySnapshot;
import com.ecomsense.inventoryservice.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;

    @GetMapping("/snapshots")
    public List<DailyInventorySnapshot> getSnapshots() {
        return inventoryService.getSnapshots();
    }

    @PostMapping("/snapshots")
    public DailyInventorySnapshot addSnapshot(@RequestBody DailyInventorySnapshot snapshot) {
        return inventoryService.saveSnapshot(snapshot);
    }

    @PutMapping("/stock")
    public void updateStock(
            @RequestParam String productId,
            @RequestParam String storeId,
            @RequestParam int quantityChange,
            @RequestParam String date // Format: yyyy-MM-dd
    ) {
        inventoryService.updateStock(productId, storeId, LocalDate.parse(date), quantityChange);
    }
}
