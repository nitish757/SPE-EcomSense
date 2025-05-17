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
    private LocalDate date;                  // corresponds to 'date' column
    private String storeId;                  // corresponds to 'store_id'
    private String productId;                // corresponds to 'product_id'
    private int inventoryLevel;              // corresponds to 'inventory_level'
    private int unitsSold;                   // corresponds to 'units_sold'
    private int unitsOrdered;                // corresponds to 'units_ordered'
    private double demandForecast;           // corresponds to 'demand_forecast'
    private double price;                    // corresponds to 'price'
    private double discount;                 // corresponds to 'discount'
    private String weatherCondition;         // corresponds to 'weather_condition'
    private boolean holidayPromotion;        // corresponds to 'holiday_promotion'
    private double competitorPricing;        // corresponds to 'competitor_pricing'
    private String seasonality;              // corresponds to 'seasonality'
}
