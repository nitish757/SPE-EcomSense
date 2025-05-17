package com.ecomsense.inventoryservice.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class MLServiceClient {
    private final RestTemplate restTemplate = new RestTemplate();
    // Update this to your ML service endpoint
    private final String mlServiceUrl = "http://localhost:4000/predict";

    public void sendFeaturesToMl(Map<String, Object> features) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(features, headers);

        // Send POST request, ignore response
        try {
            restTemplate.postForEntity(mlServiceUrl, request, String.class);
        } catch (Exception ex) {
            // Optionally log or handle errors
            ex.printStackTrace();
        }
    }
}

