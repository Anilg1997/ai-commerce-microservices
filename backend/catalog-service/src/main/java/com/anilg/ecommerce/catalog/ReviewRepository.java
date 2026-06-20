package com.anilg.ecommerce.catalog;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByProductId(String productId);
}
