/**
 * PARALLAX - AI-Powered Retail Intelligence Platform
 * Real-Time Edge Simulation Engine
 * Simulates Qualcomm edge NPU telemetry, shopper arrivals, shelf stock-out anomalies,
 * and queue fluctuations across scenarios.
 */

class EdgeSimulationEngine {
  constructor(data, onTickCallback) {
    this.data = data;
    this.onTick = onTickCallback || (() => {});
    this.scenario = 'NORMAL'; // 'NORMAL', 'PEAK_RUSH', 'STOCKOUT_SURGE', 'QUEUE_CONGESTION'

    this.liveShoppers = 58;
    this.hourlyRate = 184;
    this.totalAnomalies = 2;
    this.avgWaitTime = 2.9;

    this.timer = null;
    this.start();
  }

  start() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => this.tick(), 2500);
  }

  setScenario(newScenario) {
    this.scenario = newScenario;
    if (newScenario === 'PEAK_RUSH') {
      this.liveShoppers = 94;
      this.avgWaitTime = 4.8;
      // Push traffic to Aisle 3
      const a3 = this.data.aisles.find(a => a.id === 'zone-aisle3');
      if (a3) { a3.hourlyTraffic = 280; a3.heatLevel = 0.98; }
      // Expand queues
      this.data.counters[1].queueLength = 8;
      this.data.counters[1].avgWaitTimeMin = 5.2;
      this.data.counters[2].queueLength = 7;
    } else if (newScenario === 'STOCKOUT_SURGE') {
      // Deplete Arabica Beans too
      const arabica = this.data.skus.find(s => s.id === 'SKU-5521');
      if (arabica) {
        arabica.shelfStock = 0;
        arabica.status = 'CRITICAL_STOCKOUT';
        arabica.estLostRevenuePerHour = 3200;
      }
      this.totalAnomalies = 3;
    } else if (newScenario === 'QUEUE_CONGESTION') {
      this.data.counters[1].queueLength = 9;
      this.data.counters[1].avgWaitTimeMin = 6.1;
      this.avgWaitTime = 5.4;
    } else {
      // NORMAL
      this.liveShoppers = 54;
      this.avgWaitTime = 2.8;
      this.data.counters[1].queueLength = 5;
      this.data.counters[1].avgWaitTimeMin = 3.8;
    }

    this.onTick({ scenarioChange: true, scenario: this.scenario });
  }

  tick() {
    // 1. Telemetry jitter (Qualcomm Hexagon NPU load & latency)
    this.data.edgeStats.edgeGateways.forEach(gw => {
      gw.npuLoad = Math.min(88, Math.max(35, Math.round(gw.npuLoad + (Math.random() - 0.5) * 4)));
      gw.fps = +(59.6 + (Math.random() * 0.8)).toFixed(1);
      gw.latencyMs = +(3.7 + (Math.random() * 0.5)).toFixed(1);
      gw.tempC = +(49.0 + (Math.random() * 2.5)).toFixed(1);
    });

    // 2. Shopper count slight jitter
    const delta = Math.floor((Math.random() - 0.48) * 3);
    this.liveShoppers = Math.max(20, this.liveShoppers + delta);

    // 3. Queue dynamics
    this.data.counters.forEach(c => {
      if (c.status === 'ACTIVE') {
        if (Math.random() > 0.6 && c.queueLength > 1) {
          c.queueLength--; // Served customer
        } else if (Math.random() > 0.55 && c.queueLength < 10) {
          c.queueLength++; // New customer arrived
        }
        c.avgWaitTimeMin = +(c.queueLength * 0.75 + Math.random() * 0.3).toFixed(1);
      }
    });

    // Calculate overall average wait
    const activeCounters = this.data.counters.filter(c => c.status === 'ACTIVE');
    const totalWait = activeCounters.reduce((acc, c) => acc + c.avgWaitTimeMin, 0);
    this.avgWaitTime = +(totalWait / activeCounters.length).toFixed(1);

    // Count current critical anomalies
    this.totalAnomalies = this.data.skus.filter(s => s.status === 'CRITICAL_STOCKOUT').length;

    this.onTick({
      liveShoppers: this.liveShoppers,
      avgWaitTime: this.avgWaitTime,
      totalAnomalies: this.totalAnomalies
    });
  }

  // Action: Restock SKU from backroom
  restockSku(skuId, qty = 24) {
    const sku = this.data.skus.find(s => s.id === skuId);
    if (!sku) return false;

    if (sku.backroomStock >= qty) {
      sku.backroomStock -= qty;
      sku.shelfStock += qty;
    } else {
      sku.shelfStock += sku.backroomStock;
      sku.backroomStock = 0;
    }

    sku.status = sku.shelfStock > 10 ? 'HEALTHY' : 'WARNING';
    sku.estLostRevenuePerHour = 0;

    // Mark matching recommendation resolved
    const rec = this.data.recommendations.find(r => r.skuId === skuId);
    if (rec) rec.resolved = true;

    this.tick();
    return true;
  }

  // Action: Open Standby Counter
  openStandbyCounter(counterId) {
    const counter = this.data.counters.find(c => c.id === counterId);
    if (!counter) return false;

    counter.status = 'ACTIVE';
    counter.cashier = 'Maya K. (Online)';
    counter.queueLength = 1;
    counter.avgWaitTimeMin = 0.9;
    counter.throughputPerHour = 28;

    // Distribute queue load from congested Counter 2
    if (this.data.counters[1].queueLength > 3) {
      this.data.counters[1].queueLength -= 2;
    }

    // Mark matching recommendation resolved
    const rec = this.data.recommendations.find(r => r.counterId === counterId);
    if (rec) rec.resolved = true;

    this.tick();
    return true;
  }

  // Action: Resolve Misplaced item
  resolveMisplacement(skuId) {
    const sku = this.data.skus.find(s => s.id === skuId);
    if (!sku) return false;

    sku.status = 'HEALTHY';
    sku.misplacedLocation = null;

    const rec = this.data.recommendations.find(r => r.skuId === skuId);
    if (rec) rec.resolved = true;

    this.tick();
    return true;
  }
}

window.EdgeSimulationEngine = EdgeSimulationEngine;
