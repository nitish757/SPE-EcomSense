package com.ecomsense.inventoryservice.controller;

import com.ecomsense.inventoryservice.service.FeatureEngineeringService;
import com.ecomsense.inventoryservice.service.MLServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/features")
@RequiredArgsConstructor
public class FeatureController {
    private final FeatureEngineeringService featureService;
    private final MLServiceClient mlServiceClient;

    @PostMapping("/send-to-ml")
    public void sendFeaturesToMl(
            @RequestParam String storeId,
            @RequestParam String productId,
            @RequestParam String date // format: yyyy-MM-dd
    ) {
        LocalDate localDate = LocalDate.parse(date);
        Map<String, Object> features = featureService.calculateFeatures(storeId, productId, localDate);

        // Add store_id and product_id to the payload
        features.put("store_id", storeId);
        features.put("product_id", productId);

        mlServiceClient.sendFeaturesToMl(features);
    }
}
