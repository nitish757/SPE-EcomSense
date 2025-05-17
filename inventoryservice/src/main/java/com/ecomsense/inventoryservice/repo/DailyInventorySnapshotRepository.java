package com.ecomsense.inventoryservice.repo;

import com.ecomsense.inventoryservice.entity.DailyInventorySnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Pageable;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface DailyInventorySnapshotRepository extends JpaRepository<DailyInventorySnapshot, Long> {
    Optional<DailyInventorySnapshot> findByProductIdAndStoreIdAndDate(String productId, String storeId, LocalDate date);

    @Query("SELECT s FROM DailyInventorySnapshot s WHERE YEAR(s.date) = :year")
    List<DailyInventorySnapshot> findByYear(@Param("year") int year);

    @Query("SELECT s FROM DailyInventorySnapshot s WHERE YEAR(s.date) = :year AND MONTH(s.date) = :month")
    List<DailyInventorySnapshot> findByYearAndMonth(@Param("year") int year, @Param("month") int month);

    List<DailyInventorySnapshot> findByDate(LocalDate date);

    List<DailyInventorySnapshot> findAllByOrderByDateDesc(Pageable pageable);
}

