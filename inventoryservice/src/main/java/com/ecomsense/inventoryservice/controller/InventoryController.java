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
    public List<DailyInventorySnapshot> getLatestSnapshots(
            @RequestParam(defaultValue = "50") int limit) {
        return inventoryService.getLatestSnapshots(limit);
    }

    @PostMapping("/snapshots")
    public DailyInventorySnapshot addSnapshot(@RequestBody DailyInventorySnapshot snapshot) {
        return inventoryService.saveSnap(snapshot);
    }

    @GetMapping("/year/{year}")
    public List<DailyInventorySnapshot> getByYear(@PathVariable int year) {
        return inventoryService.getSnapshotsByYear(year);
    }

    @GetMapping("/year/{year}/month/{month}")
    public List<DailyInventorySnapshot> getByYearAndMonth(@PathVariable int year, @PathVariable int month) {
        return inventoryService.getSnapshotsByYearAndMonth(year, month);
    }

    @GetMapping("/date/{date}")
    public List<DailyInventorySnapshot> getByDate(@PathVariable String date) {
        return inventoryService.getSnapshotsByDate(LocalDate.parse(date));
    }

    @PostMapping("/newstock")
    public void addNewStock(@RequestBody List<DailyInventorySnapshot> snapshots) {
        inventoryService.saveSnapshots(snapshots);
    }
}