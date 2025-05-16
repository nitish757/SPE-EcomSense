package com.ecomsense.inventoryservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class DailyInventorySnapshot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String productId;
    private String storeId;
    private LocalDate snapshotDate;
    private int quantityAtBod;
    private int quantityAtEod;
    private double unitPrice;
    private double demandForecast;
    private String weatherCondition;
    private boolean holidayPromotion;
    private String seasonality;
    private double competitorPricing;
    private double discount;
//    private int salesQuantity;
//    private double salesAmount;
//    private int promotion;
//    private double footTraffic;
}
