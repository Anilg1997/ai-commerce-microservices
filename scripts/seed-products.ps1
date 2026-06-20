$products = @(
  @{ name = "AI Starter Laptop"; description = "Developer laptop for Java, Angular, Docker, and local AI demos. Intel i7, 32GB RAM, 1TB SSD."; price = 899; stock = 12; imageUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80"; category = "Laptops"; rating = 4.5; features = @("Intel i7-13700H", "32GB DDR5 RAM", "1TB NVMe SSD", "NVIDIA RTX 4060", "15.6\" FHD Display") }
  @{ name = "Kafka Event Kit"; description = "A learning bundle for event-driven ecommerce workflows with Apache Kafka and Redpanda."; price = 149; stock = 40; imageUrl = "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80"; category = "Books"; rating = 4.8; features = @("Kafka in Action Guide", "Redpanda Quick Start", "Event Sourcing Patterns", "Real-time Analytics Examples") }
  @{ name = "RAG Knowledge Pack"; description = "Demo dataset and prompts for retrieval augmented ecommerce AI assistants."; price = 79; stock = 100; imageUrl = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"; category = "Books"; rating = 4.2; features = @("1000+ Knowledge Documents", "Vector Embeddings Included", "LangChain4j Examples", "Spring AI Integration Guide") }
  @{ name = "Wireless Headphones Pro"; description = "Premium noise-cancelling wireless headphones with 30hr battery and spatial audio."; price = 299; stock = 25; imageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"; category = "Electronics"; rating = 4.3; features = @("Active Noise Cancellation", "30hr Battery Life", "Spatial Audio", "Bluetooth 5.3", "USB-C Charging") }
  @{ name = "Smart Watch Ultra"; description = "Health tracking smartwatch with ECG, SpO2, GPS, and 7-day battery life."; price = 199; stock = 18; imageUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"; category = "Electronics"; rating = 4.6; features = @("ECG Monitoring", "Blood Oxygen (SpO2)", "Built-in GPS", "7-Day Battery", "Water Resistant 50m") }
  @{ name = "USB-C Hub 7-in-1"; description = "Multi-port USB-C adapter with HDMI, Ethernet, SD card, and 100W PD charging."; price = 49; stock = 100; imageUrl = "https://images.unsplash.com/photo-1625723044791-5b272a5c0d8b?auto=format&fit=crop&w=900&q=80"; category = "Accessories"; rating = 4.2; features = @("HDMI 4K@60Hz", "Gigabit Ethernet", "SD/MicroSD Reader", "100W PD Pass-Through", "USB 3.2 Gen 2") }
  @{ name = "Mechanical Keyboard"; description = "RGB mechanical keyboard with hot-swappable switches for developers."; price = 159; stock = 30; imageUrl = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80"; category = "Accessories"; rating = 4.7; features = @("Hot-Swappable Switches", "Per-Key RGB", "Aluminum Frame", "USB-C Detachable Cable", "NKRO Anti-Ghosting") }
  @{ name = "Microservices Design Pattern Book"; description = "Complete guide to microservices with Spring Boot, Kafka, and cloud-native patterns."; price = 59; stock = 60; imageUrl = "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80"; category = "Books"; rating = 4.9; features = @("Spring Boot 3.x Coverage", "Event-Driven Architecture", "Kafka Deep Dive", "Deployment Strategies") }
  @{ name = "4K Webcam Pro"; description = "Ultra HD 4K webcam with auto-focus, built-in ring light, and noise-cancelling mic."; price = 129; stock = 45; imageUrl = "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=900&q=80"; category = "Electronics"; rating = 4.4; features = @("4K@30fps Video", "Auto-Focus", "Built-in Ring Light", "Dual Noise-Cancelling Mics", "Plug-and-Play USB-C") }
  @{ name = "Ergonomic Standing Desk"; description = "Electric height-adjustable standing desk with memory presets and cable management."; price = 449; stock = 8; imageUrl = "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=900&q=80"; category = "Accessories"; rating = 4.5; features = @("Electric Dual Motor", "Memory Presets (4)", "60x30 inch Surface", "Cable Management Tray", "Max Load 350 lbs") }
)

foreach ($product in $products) {
  $json = $product | ConvertTo-Json -Depth 10
  Write-Host "Creating: $($product.name)..."
  try {
    $result = Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/catalog/products" -ContentType "application/json" -Body $json
    Write-Host "  OK - ID: $($result.data.id)" -ForegroundColor Green
  } catch {
    Write-Host "  ERROR: $_" -ForegroundColor Red
  }
}

Write-Host "`nSeeding complete!" -ForegroundColor Cyan
