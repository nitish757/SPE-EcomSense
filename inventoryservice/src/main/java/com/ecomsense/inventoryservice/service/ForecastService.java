package com.ecomsense.inventoryservice.service;

import com.ecomsense.inventoryservice.entity.DailyInventorySnapshot;
import com.ecomsense.inventoryservice.repo.DailyInventorySnapshotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;

@Service
public class ForecastService {

    private final RestTemplate restTemplate;
    private final DailyInventorySnapshotRepository repository;

    public ForecastService(RestTemplateBuilder builder, DailyInventorySnapshotRepository repository) {
        this.restTemplate = builder.build();
        this.repository = repository;
    }

    @Value("${ml.service.host}")
    private String mlHost;

    @Value("${ml.service.port}")
    private int mlPort;

    public Map<String, Object> predictLatest() {
        String url = "http://" + mlHost + ":" + mlPort + "/predict";

        return repository.findLatestByDate()
                .map(this::preparePayload)
                .map(payload -> restTemplate.postForObject(url, payload, Map.class))
                .orElseThrow(() -> new RuntimeException("No inventory data found"));
    }
//    public Map<String, Object> predictLatest() {
//        return repository.findLatestByDate()
//                .map(this::preparePayload)
//                .map(payload -> restTemplate.postForObject("http://localhost:8000/predict", payload, Map.class))
//                .orElseThrow(() -> new RuntimeException("No inventory data found"));
//    }

    private Map<String, Object> preparePayload(DailyInventorySnapshot snapshot) {
        Map<String, Object> payload = new HashMap<>();

        payload.put("store_id", snapshot.getStoreId());
        payload.put("product_id", snapshot.getProductId());

        // Safely map known categories only
        String seasonality = snapshot.getSeasonality(); // e.g. "Normal"
        String safeSeasonality = getSafeValue(seasonality, Arrays.asList("Winter", "Summer", "Autumn"));
        payload.put("seasonality", safeSeasonality);

        String weatherCondition = snapshot.getWeatherCondition();
        payload.put("weather_condition", getSafeValue(weatherCondition, Arrays.asList("Cloudy","Snowy", "Rainy")));

        payload.put("category", "Electronics"); // should match training data
        payload.put("region", "North");         // same here
        payload.put("price", snapshot.getPrice());
        payload.put("discount", 0);            // replace with actual if available
        payload.put("competitor_pricing", snapshot.getCompetitorPricing());

        // Lagged features (you already have these)
        payload.put("units_sold_lag_1", snapshot.getUnitsSold());
        payload.put("units_sold_lag_7", Math.max(0, snapshot.getUnitsSold() - 5));
        payload.put("units_sold_lag_14", Math.max(0, snapshot.getUnitsSold() - 10));
        payload.put("units_sold_rollmean_7", snapshot.getUnitsSold() * 0.9);
        payload.put("units_sold_rollmean_14", snapshot.getUnitsSold() * 0.85);
        payload.put("units_sold_rollmean_28", snapshot.getUnitsSold() * 0.8);
        payload.put("holiday", false); // add logic if needed

        return payload;
    }

    private boolean isHoliday(LocalDate date) {
        // Simple example: Christmas and New Year are holidays
        return (date.getMonthValue() == 12 && date.getDayOfMonth() == 25) ||
                (date.getMonthValue() == 1 && date.getDayOfMonth() == 1);
    }
    private String getSafeValue(String value, List<String> allowedValues) {
        if (allowedValues.contains(value)) {
            return value;
        } else {
            System.err.println("Unseen label encountered: " + value);
            return "<UNKNOWN>";
        }
    }
}
