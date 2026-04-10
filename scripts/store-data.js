/**
 * PARALLAX - AI-Powered Retail Intelligence Platform
 * Store Configuration & Initial State Database
 * Smart India Hackathon 2026 - Qualcomm Problem Statement
 */

const STORE_CONFIG = {
  storeId: "QLC-IN-BLR-104",
  storeName: "PARALLAX Flagship Store #104",
  location: "Indiranagar, Bengaluru, Karnataka",
  totalAreaSqFt: 14500,
  installedCameras: 16,
  edgeGateways: 4, // Qualcomm RB5 & Snapdragon Edge AI Gateways
  openingHours: "07:00 - 23:00 IST",
  currency: "₹"
};

// Initial SKUs with realistic retail metrics, shelf vs backroom quantities
const INITIAL_SKUS = [
  {
    id: "SKU-8041",
    name: "Red Bull Energy Drink (250ml)",
    category: "Beverages",
    aisle: "Aisle 3 - Chilled CPG",
    shelfLocation: "Bay 3B - Level 3",
    backroomBay: "Bay R-04",
    shelfStock: 0, // Critical Anomaly: Shelf = 0, Backroom = 48!
    backroomStock: 48,
    maxShelfCapacity: 30,
    price: 125,
    unitCost: 88,
    velocityPerHour: 18,
    status: "CRITICAL_STOCKOUT", // "CRITICAL_STOCKOUT", "HEALTHY", "WARNING", "MISPLACED"
    misplacedLocation: null,
    estLostRevenuePerHour: 2250,
    imageIcon: "⚡",
    facingCount: 4
  },
  {
    id: "SKU-3120",
    name: "Oat Milk Barista Edition (1L)",
    category: "Dairy & Plant Alternatives",
    aisle: "Aisle 2 - Organic & Dairy",
    shelfLocation: "Bay 2A - Level 2",
    backroomBay: "Bay R-01",
    shelfStock: 3,
    backroomStock: 36,
    maxShelfCapacity: 24,
    price: 320,
    unitCost: 240,
    velocityPerHour: 8,
    status: "WARNING",
    misplacedLocation: null,
    estLostRevenuePerHour: 960,
    imageIcon: "🥛",
    facingCount: 3
  },
  {
    id: "SKU-9942",
    name: "Extra Virgin Olive Oil (500ml)",
    category: "Gourmet & Oils",
    aisle: "Aisle 2 - Gourmet & Oils",
    shelfLocation: "Bay 2D - Level 2",
    backroomBay: "Bay R-07",
    shelfStock: 12,
    backroomStock: 20,
    maxShelfCapacity: 15,
    price: 650,
    unitCost: 480,
    velocityPerHour: 3,
    status: "MISPLACED", // Found dumped in Cereal Bay 4A
    misplacedLocation: "Aisle 4 (Breakfast Cereals)",
    estLostRevenuePerHour: 0,
    imageIcon: "🫒",
    facingCount: 2
  },
  {
    id: "SKU-1084",
    name: "Whole Wheat Sourdough Loaf (400g)",
    category: "Bakery & Fresh",
    aisle: "Aisle 1 - Artisan Bakery",
    shelfLocation: "Bay 1C - Level 1",
    backroomBay: "Bakery Holding Unit 1",
    shelfStock: 14,
    backroomStock: 22,
    maxShelfCapacity: 20,
    price: 95,
    unitCost: 55,
    velocityPerHour: 11,
    status: "HEALTHY",
    misplacedLocation: null,
    estLostRevenuePerHour: 0,
    imageIcon: "🍞",
    facingCount: 4
  },
  {
    id: "SKU-5521",
    name: "Single Origin Arabica Beans (250g)",
    category: "Beverages",
    aisle: "Aisle 3 - Coffee & Tea",
    shelfLocation: "Bay 3A - Level 2",
    backroomBay: "Bay R-03",
    shelfStock: 0, // Shelf = 0, Backroom = 16
    backroomStock: 16,
    maxShelfCapacity: 12,
    price: 490,
    unitCost: 350,
    velocityPerHour: 6,
    status: "CRITICAL_STOCKOUT",
    misplacedLocation: null,
    estLostRevenuePerHour: 2940,
    imageIcon: "☕",
    facingCount: 2
  },
  {
    id: "SKU-4402",
    name: "Dark Chocolate 85% Sea Salt (100g)",
    category: "Confectionery",
    aisle: "Aisle 5 - Impulse & Sweets",
    shelfLocation: "Bay 5B - Level 3",
    backroomBay: "Bay R-09",
    shelfStock: 18,
    backroomStock: 60,
    maxShelfCapacity: 25,
    price: 180,
    unitCost: 110,
    velocityPerHour: 14,
    status: "HEALTHY",
    misplacedLocation: null,
    estLostRevenuePerHour: 0,
    imageIcon: "🍫",
    facingCount: 5
  },
  {
    id: "SKU-7729",
    name: "Hydrating Coconut Water (500ml)",
    category: "Beverages",
    aisle: "Aisle 3 - Chilled CPG",
    shelfLocation: "Bay 3C - Level 1",
    backroomBay: "Bay R-04",
    shelfStock: 4,
    backroomStock: 40,
    maxShelfCapacity: 28,
    price: 65,
    unitCost: 40,
    velocityPerHour: 15,
    status: "WARNING",
    misplacedLocation: null,
    estLostRevenuePerHour: 650,
    imageIcon: "🥥",
    facingCount: 3
  },
  {
    id: "SKU-6103",
    name: "Avocado Hass Imported (Pack of 2)",
    category: "Produce & Fresh",
    aisle: "Aisle 1 - Fresh Produce",
    shelfLocation: "Bay 1A - Chilled Bins",
    backroomBay: "Cold Store CS-2",
    shelfStock: 16,
    backroomStock: 30,
    maxShelfCapacity: 20,
    price: 240,
    unitCost: 170,
    velocityPerHour: 7,
    status: "HEALTHY",
    misplacedLocation: null,
    estLostRevenuePerHour: 0,
    imageIcon: "🥑",
    facingCount: 3
  }
];

// Aisles and Spatial Zones for Heatmap & Analytics
const STORE_AISLES = [
  {
    id: "zone-entrance",
    name: "Main Entrance & Welcome Lobby",
    code: "Z-ENT",
    category: "Entryway",
    dwellTimeAvgMin: 0.8,
    hourlyTraffic: 184,
    engagementScore: 42,
    x: 40,
    y: 350,
    width: 120,
    height: 180,
    color: "rgba(56, 189, 248, 0.15)",
    heatLevel: 0.55
  },
  {
    id: "zone-aisle1",
    name: "Aisle 1: Fresh Produce & Artisan Bakery",
    code: "A-01",
    category: "Fresh & Perishables",
    dwellTimeAvgMin: 4.6,
    hourlyTraffic: 142,
    engagementScore: 84,
    x: 200,
    y: 80,
    width: 140,
    height: 280,
    color: "rgba(34, 197, 94, 0.15)",
    heatLevel: 0.82
  },
  {
    id: "zone-aisle2",
    name: "Aisle 2: Dairy, Plant Milks & Gourmet Oils",
    code: "A-02",
    category: "Dairy & Staples",
    dwellTimeAvgMin: 3.2,
    hourlyTraffic: 118,
    engagementScore: 71,
    x: 380,
    y: 80,
    width: 140,
    height: 280,
    color: "rgba(234, 179, 8, 0.15)",
    heatLevel: 0.68
  },
  {
    id: "zone-aisle3",
    name: "Aisle 3: Chilled CPG, Energy Drinks & Coffee",
    code: "A-03",
    category: "High-Velocity CPG",
    dwellTimeAvgMin: 5.4,
    hourlyTraffic: 205,
    engagementScore: 92,
    x: 560,
    y: 80,
    width: 140,
    height: 280,
    color: "rgba(239, 68, 68, 0.2)",
    heatLevel: 0.95 // HOTTEST ZONE
  },
  {
    id: "zone-aisle4",
    name: "Aisle 4: Breakfast Cereals & Health Snacks",
    code: "A-04",
    category: "Packaged Goods",
    dwellTimeAvgMin: 1.5,
    hourlyTraffic: 62,
    engagementScore: 35,
    x: 740,
    y: 80,
    width: 140,
    height: 280,
    color: "rgba(148, 163, 184, 0.12)",
    heatLevel: 0.28 // COLD ZONE! Needs merchandising attention
  },
  {
    id: "zone-checkout",
    name: "Checkout Zone & Billing Counters 1-6",
    code: "Z-POS",
    category: "Checkout & POS",
    dwellTimeAvgMin: 3.8,
    hourlyTraffic: 175,
    engagementScore: 60,
    x: 200,
    y: 400,
    width: 680,
    height: 140,
    color: "rgba(168, 85, 247, 0.15)",
    heatLevel: 0.88
  }
];

// Billing Counters
const INITIAL_COUNTERS = [
  { id: 1, name: "Counter 1 (Express < 10)", status: "ACTIVE", cashier: "Arjun Verma", queueLength: 4, avgWaitTimeMin: 2.1, throughputPerHour: 34 },
  { id: 2, name: "Counter 2 (Standard)", status: "ACTIVE", cashier: "Sneha Patil", queueLength: 6, avgWaitTimeMin: 4.4, throughputPerHour: 22 },
  { id: 3, name: "Counter 3 (Standard)", status: "ACTIVE", cashier: "Rohan Nair", queueLength: 5, avgWaitTimeMin: 3.8, throughputPerHour: 24 },
  { id: 4, name: "Counter 4 (Self-Checkout)", status: "ACTIVE", cashier: "AI Monitored", queueLength: 2, avgWaitTimeMin: 1.2, throughputPerHour: 48 },
  { id: 5, name: "Counter 5 (Overflow Standby)", status: "STANDBY", cashier: "Assigned: Maya K. (Ready)", queueLength: 0, avgWaitTimeMin: 0, throughputPerHour: 0 },
  { id: 6, name: "Counter 6 (Maintenance)", status: "CLOSED", cashier: "Unassigned", queueLength: 0, avgWaitTimeMin: 0, throughputPerHour: 0 }
];

// Proactive AI Recommendations ("What, Why, Next Action")
const INITIAL_RECOMMENDATIONS = [
  {
    id: "REC-101",
    timestamp: "Just now",
    priority: "CRITICAL",
    layer: "INVENTORY",
    title: "Critical Phantom Stock-Out Detected",
    what: "Shelf 3B (Red Bull 250ml) count reached 0 units while 48 units remain in Backroom Bay R-04.",
    why: "Sudden footfall spike in Aisle 3 (22 shoppers in last 12 min) combined with 100% conversion rate emptied the shelf.",
    nextAction: "Dispatch associate Rahul Sen to Backroom Bay R-04 to restock 24 units immediately. Prevents ₹2,250/hr sales leakage.",
    actionLabel: "Dispatch Rahul Sen (Bay R-04)",
    resolved: false,
    skuId: "SKU-8041"
  },
  {
    id: "REC-102",
    timestamp: "2 mins ago",
    priority: "HIGH",
    layer: "QUEUE",
    title: "Billing Queue Congestion Predicted",
    what: "Counter 2 wait time spiked to 4.4 min. Combined queue length across active lanes is 17 shoppers.",
    why: "Qualcomm Edge AI vision detected 7 high-volume shopping carts in Aisles 2 & 3 moving towards checkout within the next 4 minutes.",
    nextAction: "Proactively activate Counter 5 (Standby). Notify associate Maya K. to log in to Counter 5 POS now.",
    actionLabel: "Open Counter 5 (Notify Maya K.)",
    resolved: false,
    counterId: 5
  },
  {
    id: "REC-103",
    timestamp: "6 mins ago",
    priority: "MEDIUM",
    layer: "INVENTORY",
    title: "High-Value Misplaced Item Flagged",
    what: "Extra Virgin Olive Oil 500ml (₹650) abandoned in Aisle 4 (Breakfast Cereals shelf).",
    why: "Customer changed purchasing decision after picking olive oil and placed it on top of cornflakes facing.",
    nextAction: "Task floor runner to return SKU-9942 to Gourmet Bay 2D to prevent shrinkage and facing clutter.",
    actionLabel: "Assign Retrieval Task",
    resolved: false,
    skuId: "SKU-9942"
  },
  {
    id: "REC-104",
    timestamp: "14 mins ago",
    priority: "LOW",
    layer: "SHOPPER",
    title: "Cold Zone Underperformance Alert",
    what: "Aisle 4 (Breakfast Cereals) traffic dropped 42% below daily benchmark. Dwell time is only 1.5 mins.",
    why: "Lack of promotional endcap hook and poor aisle lighting detected near rear junction.",
    nextAction: "Deploy dynamic endcap signage featuring combo discount on Muesli + Almond Milk to boost aisle penetration.",
    actionLabel: "View Merchandising Insight",
    resolved: false,
    zoneId: "zone-aisle4"
  }
];

// Qualcomm Edge Architecture Telemetry Data
const QUALCOMM_EDGE_STATS = {
  edgeGateways: [
    { name: "Node Alpha (RB5)", ip: "192.168.1.101", npuLoad: 44, tempC: 48.2, fps: 60.2, latencyMs: 3.6, cameras: ["CAM-01 (Entrance)", "CAM-02 (Aisle 1)", "CAM-03 (Aisle 1B)", "CAM-04 (Bakery)"] },
    { name: "Node Beta (RB5)", ip: "192.168.1.102", npuLoad: 58, tempC: 51.0, fps: 59.8, latencyMs: 4.1, cameras: ["CAM-05 (Aisle 2)", "CAM-06 (Aisle 2B)", "CAM-07 (Aisle 3)", "CAM-08 (Aisle 3B)"] },
    { name: "Node Gamma (Snapdragon Edge)", ip: "192.168.1.103", npuLoad: 51, tempC: 49.5, fps: 60.0, latencyMs: 3.9, cameras: ["CAM-09 (Aisle 4)", "CAM-10 (Aisle 5)", "CAM-11 (Gourmet)", "CAM-12 (Snacks)"] },
    { name: "Node Delta (Snapdragon Edge)", ip: "192.168.1.104", npuLoad: 62, tempC: 52.4, fps: 59.5, latencyMs: 4.4, cameras: ["CAM-13 (POS 1-3)", "CAM-14 (POS 4-6)", "CAM-15 (Exit)", "CAM-16 (Backroom Access)"] }
  ],
  bandwidthSavedGbPerDay: 482.6,
  cloudCostSavingsPerMonthUsd: 3840,
  dpdpPrivacyCompliance: 100, // Zero raw video uploaded; only anonymized bounding box tensors & counts
  onDeviceModelSuite: [
    { model: "YOLO-v11n (Qualcomm NPU Int8)", task: "Shopper Detection & Localization", latencyMs: 1.8 },
    { model: "ByteTrack-Edge", task: "Multi-Object Trajectory & Dwell Analysis", latencyMs: 0.6 },
    { model: "ShelfSeg-MobileNetV4", task: "Facing Count & Out-of-Stock Segmentation", latencyMs: 1.2 },
    { model: "QueueHead-Transformer", task: "Cart Tally & Billing Delay Forecasting", latencyMs: 0.8 }
  ]
};

window.PARALLAX_DATA = {
  config: STORE_CONFIG,
  skus: INITIAL_SKUS,
  aisles: STORE_AISLES,
  counters: INITIAL_COUNTERS,
  recommendations: INITIAL_RECOMMENDATIONS,
  edgeStats: QUALCOMM_EDGE_STATS
};
