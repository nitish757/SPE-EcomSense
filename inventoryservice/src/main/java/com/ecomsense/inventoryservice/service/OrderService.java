package com.ecomsense.inventoryservice.service;

import com.ecomsense.inventoryservice.entity.Order;
import com.ecomsense.inventoryservice.entity.OrderItem;
import com.ecomsense.inventoryservice.repo.OrderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepo;
    private final InventoryService inventoryService;

    @Transactional
    public Order createOrder(Order order) {
        order.setStatus("PLACED");
        double total = 0.0;
        if (order.getItems() != null) {
            for (OrderItem item : order.getItems()) {
                item.setOrder(order);
                total += item.getQuantity() * item.getUnitPrice() - item.getDiscount();
                // Update inventory for each item
                inventoryService.updateStock(
                        item.getProductId(),
                        order.getStoreId(),
                        order.getOrderDate(),
                        -item.getQuantity()
                );
            }
        }
        order.setTotalAmount(total);
        return orderRepo.save(order);
    }

    public java.util.List<Order> getAllOrders() {
        return orderRepo.findAll();
    }
}
