package com.ecomsense.inventoryservice.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class Store {
    @Id
    private String storeId;
    private String region;
}
