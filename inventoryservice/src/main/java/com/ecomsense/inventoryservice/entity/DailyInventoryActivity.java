package com.ecomsense.inventoryservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class DailyInventoryActivity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String productId;
    private String storeId;
    private LocalDateTime activityDate;
    private String changeType; // e.g., SOLD, RESTOCKED
    private int quantity;
    private double unitPrice;
    private String source;
    private String note;
    private LocalDateTime loggedAt;
}
