package com.ecomsense.inventoryservice.controller;

import com.ecomsense.inventoryservice.entity.DailyInventorySnapshot;
import com.ecomsense.inventoryservice.service.ForecastService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/predict")
public class ForecastController {

    private final ForecastService forecastService;

    public ForecastController(ForecastService forecastService) {
        this.forecastService = forecastService;
    }

    @GetMapping("/latest")
    public ResponseEntity<?> predictLatest() {
        try {
            Map<String, Object> result = forecastService.predictLatest();
            return ResponseEntity.ok(result);
        } catch (HttpClientErrorException ex) {
            return ResponseEntity.status(ex.getStatusCode())
                    .body(Map.of(
                            "error", "Model prediction failed",
                            "message", ex.getMessage(),
                            "code", ex.getStatusCode().value()
                    ));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Internal server error",
                            "message", ex.getMessage(),
                            "code", "INTERNAL_SERVER_ERROR"
                    ));
        }
    }
}
