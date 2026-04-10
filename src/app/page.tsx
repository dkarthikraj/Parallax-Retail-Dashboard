"use client";

import React, { useState, useEffect, useRef } from "react";

export default function ParallaxDashboard() {
  const [activeTab, setActiveTab] = useState<string>("tab-overview");
  const [activeCam, setActiveCam] = useState<string>("CAM-08");
  const [activeCamName, setActiveCamName] = useState<string>("CAM-08 • AISLE 3 (CHILLED BEVERAGES)");
  const [activeCamImg, setActiveCamImg] = useState<string>("assets/image1_opencv.jpg");
  
  // Real-time Telemetry State
  const [npuLoad, setNpuLoad] = useState<number>(52);
  const [fps, setFps] = useState<number>(60.2);
  const [latency, setLatency] = useState<number>(3.8);
  const [activeShoppers, setActiveShoppers] = useState<number>(58);
  const [counter5Active, setCounter5Active] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Switch Live Camera Stream
  const handleSwitchCam = (camId: string, camName: string, imgSrc: string) => {
    setActiveCam(camId);
    setActiveCamName(camName);
    setActiveCamImg(imgSrc);
  };

  // Toast notification timer
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Demo Action Dispatchers
  const handleDispatchAssociate = (who: string, bay: string, sku: string) => {
    showToast(`Dispatched ${who} to ${bay} for ${sku}.`);
  };

  const handleOpenCounter = (n: number, who: string) => {
    showToast(`Counter ${n} opening — ${who} notified.`);
    if (n === 5) setCounter5Active(true);
  };

  // Telemetry jitter simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setNpuLoad(Math.floor(48 + Math.random() * 8));
      setFps(parseFloat((59.5 + Math.random() * 1.2).toFixed(1)));
      setLatency(parseFloat((3.5 + Math.random() * 0.6).toFixed(1)));
      setActiveShoppers((prev) => Math.max(45, Math.min(75, prev + Math.floor(Math.random() * 3) - 1)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Canvas AI Bounding Box Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let step = 0;

    const boxes = [
      { x: 120, y: 140, w: 95, h: 180, label: "SHOPPER #104 (DWELL 3.4m)" },
      { x: 310, y: 110, w: 85, h: 165, label: "SHOPPER #108 (DWELL 1.2m)" },
      { x: 520, y: 160, w: 90, h: 175, label: "SHOPPER #112 (DWELL 4.1m)" },
    ];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      step += 0.05;

      boxes.forEach((b, idx) => {
        const offsetY = Math.sin(step + idx) * 3;
        ctx.strokeStyle = idx === 0 ? "#00ffcc" : "#3b82f6";
        ctx.lineWidth = 2;
        ctx.strokeRect(b.x, b.y + offsetY, b.w, b.h);

        ctx.fillStyle = idx === 0 ? "#00ffcc" : "#3b82f6";
        ctx.fillRect(b.x, b.y + offsetY - 18, b.w, 18);

        ctx.fillStyle = "#000000";
        ctx.font = "bold 9px monospace";
        ctx.fillText(b.label, b.x + 4, b.y + offsetY - 5);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [activeCam]);

  return (
    <div className="app-container">
      {/* Toast Overlay */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#000",
            color: "#fff",
            border: "2px solid #fff",
            padding: "10px 16px",
            fontSize: "12px",
            fontWeight: "bold",
            zIndex: 9999,
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* HEADER */}
      <header className="top-header">
        <div className="header-inner">
          <div className="brand-section">
            <div className="brand-title-group">
              <h1>
                PARALLAX
                <span className="qc-tag">QUALCOMM EDGE AI</span>
              </h1>
              <div className="brand-subtitle">
                AI-Powered Retail Intelligence Platform &bull; Smart India Hackathon 2026 (PS ID: 26179)
              </div>
            </div>
          </div>

          <div className="telemetry-strip">
            <div className="telemetry-node">
              <span className="pulse-indicator"></span>
              <span>Hexagon™ NPU:</span>
              <strong>{npuLoad}%</strong>
            </div>
            <span style={{ color: "#cbd5e1" }}>|</span>
            <div className="telemetry-node">
              <span>Inference:</span>
              <strong style={{ color: "var(--color-blue)" }}>{fps} FPS</strong>
            </div>
            <span style={{ color: "#cbd5e1" }}>|</span>
            <div className="telemetry-node">
              <span>Latency:</span>
              <strong style={{ color: "var(--color-green)" }}>{latency} ms</strong>
            </div>
            <span style={{ color: "#cbd5e1" }}>|</span>
            <div className="telemetry-node">
              <span>DPDP Privacy:</span>
              <strong style={{ color: "var(--color-green)" }}>100% On-Device</strong>
            </div>
          </div>

          <div>
            <span className="store-badge">📍 Store #104 (Indiranagar, Bengaluru)</span>
          </div>
        </div>
      </header>

      {/* SIDEBAR NAVIGATION */}
      <nav className="nav-tab-strip">
        <div className="nav-tabs-inner">
          <button
            className={`nav-tab-btn ${activeTab === "tab-overview" ? "active" : ""}`}
            onClick={() => setActiveTab("tab-overview")}
          >
            Live Command Center
          </button>
          <button
            className={`nav-tab-btn ${activeTab === "tab-inventory" ? "active" : ""}`}
            onClick={() => setActiveTab("tab-inventory")}
          >
            Inventory & Out-of-Stock
            <span className="badge-alert">2 ALERTS</span>
          </button>
          <button
            className={`nav-tab-btn ${activeTab === "tab-heatmap" ? "active" : ""}`}
            onClick={() => setActiveTab("tab-heatmap")}
          >
            Store Heatmap (Video Feed)
          </button>
          <button
            className={`nav-tab-btn ${activeTab === "tab-queue" ? "active" : ""}`}
            onClick={() => setActiveTab("tab-queue")}
          >
            Billing & Queues
          </button>
          <button
            className={`nav-tab-btn ${activeTab === "tab-architecture" ? "active" : ""}`}
            onClick={() => setActiveTab("tab-architecture")}
          >
            Qualcomm Edge Hardware
          </button>
        </div>

        <div className="sidebar-brand">
          <div className="sidebar-brand-mark"></div>
          <div>
            <div className="sidebar-brand-text">PARALLAX</div>
            <div className="sidebar-brand-sub">EDGE AI v2.0 (React TS)</div>
          </div>
        </div>
      </nav>

      {/* MAIN VIEWPORT */}
      <main className="main-content">
        {/* TAB 1: LIVE COMMAND CENTER */}
        {activeTab === "tab-overview" && (
          <section className="tab-pane active" id="tab-overview">
            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-label">Active Shoppers</div>
                <div className="kpi-value-row">
                  <span className="kpi-value bold-number">{activeShoppers}</span>
                  <span className="kpi-subtext">customers inside</span>
                </div>
                <div className="kpi-subtext">
                  <b>+14%</b> vs yesterday &bull; <b>184</b> footfall/hr
                </div>
              </div>

              <div className="kpi-card" style={{ borderLeft: "4px solid var(--color-red)" }}>
                <div className="kpi-label" style={{ color: "var(--color-red)" }}>
                  Out-of-Stock Alerts
                </div>
                <div className="kpi-value-row">
                  <span className="kpi-value bold-number" style={{ color: "var(--color-red)" }}>
                    2 SKUs
                  </span>
                </div>
                <div className="kpi-subtext">
                  <b style={{ color: "var(--color-red)" }}>Shelf = 0, Backroom &gt; 0</b> &bull; <b>₹5,190/hr</b> loss
                </div>
              </div>

              <div className="kpi-card" style={{ borderLeft: "4px solid var(--color-amber)" }}>
                <div className="kpi-label">Average Queue Wait</div>
                <div className="kpi-value-row">
                  <span className="kpi-value bold-number">2.8 min</span>
                </div>
                <div className="kpi-subtext">
                  <b style={{ color: "var(--color-amber)" }}>Lane 2 spike (4.4 min)</b> &bull; Target: <b>&lt; 3.0 min</b>
                </div>
              </div>

              <div className="kpi-card" style={{ borderLeft: "4px solid var(--color-green)" }}>
                <div className="kpi-label">Bandwidth Saved on Edge</div>
                <div className="kpi-value-row">
                  <span className="kpi-value bold-number" style={{ color: "var(--color-green)" }}>
                    94.2%
                  </span>
                </div>
                <div className="kpi-subtext">
                  <b>482.6 GB/day</b> offload &bull; <b>$3,840/mo</b> saved
                </div>
              </div>
            </div>

            <div className="overview-grid">
              <div>
                <div className="card-panel">
                  <div className="card-panel-header">
                    <h2>Live Vision AI Stream</h2>
                    <div className="cam-tabs">
                      <button
                        className={`cam-btn ${activeCam === "CAM-08" ? "active" : ""}`}
                        onClick={() => handleSwitchCam("CAM-08", "CAM-08 • AISLE 3 (CHILLED BEVERAGES)", "assets/image1_opencv.jpg")}
                      >
                        CAM-08 (Aisle 3 Chilled CPG)
                      </button>
                      <button
                        className={`cam-btn ${activeCam === "CAM-13" ? "active" : ""}`}
                        onClick={() => handleSwitchCam("CAM-13", "CAM-13 • CHECKOUT QUEUES", "assets/image2_opencv.jpg")}
                      >
                        CAM-13 (Checkout)
                      </button>
                      <button
                        className={`cam-btn ${activeCam === "CAM-05" ? "active" : ""}`}
                        onClick={() => handleSwitchCam("CAM-05", "CAM-05 • DAIRY & FROZEN", "assets/image1_opencv.jpg")}
                      >
                        CAM-05 (Dairy)
                      </button>
                      <button
                        className={`cam-btn ${activeCam === "CAM-01" ? "active" : ""}`}
                        onClick={() => handleSwitchCam("CAM-01", "CAM-01 • ENTRANCE & FOOTFALL", "assets/image2_opencv.jpg")}
                      >
                        CAM-01 (Entrance)
                      </button>
                    </div>
                  </div>

                  <div className="video-container" style={{ position: "relative", width: "100%", height: "340px" }}>
                    <img
                      src={activeCamImg}
                      alt="Camera Stream"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <canvas
                      ref={canvasRef}
                      width={700}
                      height={340}
                      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
                    />
                    <div className="video-hud-header">
                      <span className="rec-dot"></span>
                      <span>{activeCamName}</span>
                    </div>

                    <div className="video-hud-footer">
                      <span>QUALCOMM HEXAGON™ NPU: <b>{fps} FPS</b> (INT8)</span>
                      <span><b>ZERO CLOUD VIDEO STREAMING</b></span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="card-panel">
                  <div className="card-panel-header">
                    <h2>Action Required (Live AI Decisions)</h2>
                    <span className="badge-alert">2 IMMEDIATE ACTIONS</span>
                  </div>

                  <div className="action-cards">
                    <div className="action-card urgent">
                      <div className="action-card-top">
                        <span className="badge-status red">OUT OF STOCK (SHELF VOID)</span>
                        <span className="action-time">1 min ago</span>
                      </div>
                      <h3>Aisle 3 Bay B: Amul Taza Milk 1L</h3>
                      <p>Shelf void area ratio <b>A_void / A_shelf = 42% (&gt;35% threshold)</b>. Stock in backroom freezer: <b>48 units</b>.</p>
                      <div className="action-buttons">
                        <button
                          className="action-btn primary"
                          onClick={() => handleDispatchAssociate("Ramesh (Staff #04)", "Aisle 3 Bay B", "Amul Taza Milk 1L")}
                        >
                          Dispatch Staff (Ramesh - Aisle 3)
                        </button>
                      </div>
                    </div>

                    <div className="action-card warning">
                      <div className="action-card-top">
                        <span className="badge-status yellow">QUEUE CONGESTION FORECAST</span>
                        <span className="action-time">3 mins ago</span>
                      </div>
                      <h3>Counter #3 & #4 Peak Spike</h3>
                      <p>Shopper arrival rate <b>λ = 14/min</b> exceeds service rate <b>μ = 9/min</b>. Predicted queue delay: <b>4.8 minutes</b> in 3 mins.</p>
                      <div className="action-buttons">
                        <button
                          className="action-btn primary"
                          onClick={() => handleOpenCounter(5, "Priya (Cashier #05)")}
                        >
                          Open Counter #5 (Call Cashier Priya)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: INVENTORY & OUT-OF-STOCK */}
        {activeTab === "tab-inventory" && (
          <section className="tab-pane active" id="tab-inventory">
            <div className="kpi-grid">
              <div className="kpi-card" style={{ borderLeft: "4px solid var(--color-red)" }}>
                <div className="kpi-label" style={{ color: "var(--color-red)" }}>
                  Out-of-Stock SKUs
                </div>
                <div className="kpi-value-row">
                  <span className="kpi-value bold-number" style={{ color: "var(--color-red)" }}>
                    2 SKUs
                  </span>
                </div>
                <div className="kpi-subtext">Immediate restock required</div>
              </div>

              <div className="kpi-card" style={{ borderLeft: "4px solid var(--color-amber)" }}>
                <div className="kpi-label">Low Stock Warning</div>
                <div className="kpi-value-row">
                  <span className="kpi-value bold-number">4 SKUs</span>
                </div>
                <div className="kpi-subtext">Under 25% shelf capacity</div>
              </div>

              <div className="kpi-card" style={{ borderLeft: "4px solid var(--color-green)" }}>
                <div className="kpi-label">Planogram Compliance</div>
                <div className="kpi-value-row">
                  <span className="kpi-value bold-number" style={{ color: "var(--color-green)" }}>
                    96.8%
                  </span>
                </div>
                <div className="kpi-subtext">RT-DETR Facings Model Audit</div>
              </div>

              <div className="kpi-card">
                <div className="kpi-label">Daily Loss Prevented</div>
                <div className="kpi-value-row">
                  <span className="kpi-value bold-number">₹14,200</span>
                </div>
                <div className="kpi-subtext">Faster restock turnover</div>
              </div>
            </div>

            <div className="card-panel">
              <div className="card-panel-header">
                <h2>Real-Time Shelf Inventory & Planogram Compliance</h2>
                <span className="badge-status green">LIVE NPU MONITORING</span>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Zone / Aisle</th>
                    <th>Product Name</th>
                    <th>Shelf Void Ratio</th>
                    <th>Backroom Stock</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>Aisle 3 Bay B</b></td>
                    <td>Amul Taza Milk 1L</td>
                    <td><b style={{ color: "var(--color-red)" }}>42% Void</b></td>
                    <td>48 Units</td>
                    <td><span className="badge-alert">CRITICAL VOID</span></td>
                    <td>
                      <button className="action-btn primary" onClick={() => handleDispatchAssociate("Staff #04", "Aisle 3 Bay B", "Amul Taza Milk 1L")}>
                        Dispatch Restock
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td><b>Aisle 2 Bay C</b></td>
                    <td>Lays Classic Salted 50g</td>
                    <td><b style={{ color: "var(--color-amber)" }}>28% Void</b></td>
                    <td>120 Units</td>
                    <td><span className="badge-status yellow">LOW STOCK</span></td>
                    <td>
                      <button className="action-btn" onClick={() => handleDispatchAssociate("Staff #02", "Aisle 2 Bay C", "Lays Chips")}>
                        Schedule Restock
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td><b>Aisle 1 Bay A</b></td>
                    <td>Britannia Good Day 100g</td>
                    <td>4% Void</td>
                    <td>200 Units</td>
                    <td><span className="badge-status green">IN STOCK</span></td>
                    <td><button className="action-btn" disabled style={{ opacity: 0.5 }}>Optimal</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 3: STORE HEATMAP */}
        {activeTab === "tab-heatmap" && (
          <section className="tab-pane active" id="tab-heatmap">
            <div className="card-panel">
              <div className="card-panel-header">
                <h2>CCTV Thermal Density Surveillance (CAM-03)</h2>
                <span className="badge-status green">2D FLOORPLAN HOMOGRAPHY</span>
              </div>
              <div style={{ padding: "16px", background: "#000", color: "#fff", fontFamily: "monospace" }}>
                <div style={{ marginBottom: "10px" }}>MAP OVERLAY: AISLE DWELL TIME & TRAFFIC HEATMAP</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", textAlign: "center" }}>
                  <div style={{ padding: "20px", background: "#7f1d1d", border: "1px solid #ef4444" }}>
                    <b>ZONE A: CHILLED CPG</b>
                    <br />Dwell: 4.8 min (HIGH)
                  </div>
                  <div style={{ padding: "20px", background: "#78350f", border: "1px solid #f59e0b" }}>
                    <b>ZONE B: SNACKS & RACKS</b>
                    <br />Dwell: 2.4 min (MED)
                  </div>
                  <div style={{ padding: "20px", background: "#064e3b", border: "1px solid #10b981" }}>
                    <b>ZONE C: BAKERY & BREAD</b>
                    <br />Dwell: 1.1 min (LOW)
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: BILLING & QUEUES */}
        {activeTab === "tab-queue" && (
          <section className="tab-pane active" id="tab-queue">
            <div className="kpi-grid">
              <div className="kpi-card" style={{ borderLeft: "4px solid var(--color-amber)" }}>
                <div className="kpi-label">Active Billing Lines</div>
                <div className="kpi-value-row">
                  <span className="kpi-value bold-number">4 Registers</span>
                </div>
                <div className="kpi-subtext">Register #5 Ready to open</div>
              </div>

              <div className="kpi-card">
                <div className="kpi-label">Customer Arrival Rate (λ)</div>
                <div className="kpi-value-row">
                  <span className="kpi-value bold-number">14 / min</span>
                </div>
                <div className="kpi-subtext">XGBoost Early Warning active</div>
              </div>

              <div className="kpi-card" style={{ borderLeft: "4px solid var(--color-green)" }}>
                <div className="kpi-label">Average Checkout Time</div>
                <div className="kpi-value-row">
                  <span className="kpi-value bold-number" style={{ color: "var(--color-green)" }}>
                    42 sec
                  </span>
                </div>
                <div className="kpi-subtext">POS Scan Speed Optimal</div>
              </div>

              <div className="kpi-card">
                <div className="kpi-label">Predicted Wait in 5 Min</div>
                <div className="kpi-value-row">
                  <span className="kpi-value bold-number">4.8 min</span>
                </div>
                <div className="kpi-subtext">Call cashier to open counter 5</div>
              </div>
            </div>

            <div className="card-panel">
              <div className="card-panel-header">
                <h2>Real-Time Checkout Line Analytics</h2>
                <button className="action-btn primary" onClick={() => handleOpenCounter(5, "Priya (Cashier #05)")}>
                  {counter5Active ? "Counter #5 Active" : "Open Reserve Counter #5"}
                </button>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>Register #</th>
                    <th>Assigned Cashier</th>
                    <th>Queue Length</th>
                    <th>Est. Wait Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>Counter #1</b></td>
                    <td>Suresh K.</td>
                    <td>3 Persons</td>
                    <td>2.1 min</td>
                    <td><span className="badge-status green">HEALTHY</span></td>
                  </tr>
                  <tr>
                    <td><b>Counter #2</b></td>
                    <td>Anitha M.</td>
                    <td>6 Persons</td>
                    <td><b style={{ color: "var(--color-amber)" }}>4.4 min</b></td>
                    <td><span className="badge-status yellow">CONGESTED</span></td>
                  </tr>
                  <tr>
                    <td><b>Counter #5</b></td>
                    <td>Priya R. (Reserve)</td>
                    <td>{counter5Active ? "2 Persons" : "0 Persons"}</td>
                    <td>{counter5Active ? "1.2 min" : "Standby"}</td>
                    <td>
                      <span className={`badge-status ${counter5Active ? "green" : "grey"}`}>
                        {counter5Active ? "ACTIVE" : "STANDBY"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 5: QUALCOMM EDGE HARDWARE */}
        {activeTab === "tab-architecture" && (
          <section className="tab-pane active" id="tab-architecture">
            <div className="card-panel">
              <div className="card-panel-header">
                <h2>Qualcomm Snapdragon / RB5 Edge Hardware Telemetry</h2>
                <span className="badge-status green">3 NODES ACTIVE</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", padding: "16px" }}>
                <div className="card-panel" style={{ padding: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <b>Node Alpha (Qualcomm RB5)</b>
                    <span className="badge-status green">ONLINE</span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "10px" }}>
                    CAM 01-04 (Entrance & Bakery)
                  </div>
                  <div style={{ fontSize: "0.85rem" }}>
                    NPU Load: <b>{npuLoad}%</b> &bull; FPS: <b>{fps}</b> &bull; Latency: <b>{latency}ms</b>
                  </div>
                </div>

                <div className="card-panel" style={{ padding: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <b>Node Beta (Qualcomm RB5)</b>
                    <span className="badge-status green">ONLINE</span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "10px" }}>
                    CAM 05-08 (Aisle 2 & 3 CPG)
                  </div>
                  <div style={{ fontSize: "0.85rem" }}>
                    NPU Load: <b>58%</b> &bull; FPS: <b>59.8</b> &bull; Latency: <b>4.1ms</b>
                  </div>
                </div>

                <div className="card-panel" style={{ padding: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <b>Node Gamma (Snapdragon Edge)</b>
                    <span className="badge-status green">ONLINE</span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "10px" }}>
                    CAM 09-12 (Aisle 4 & 5)
                  </div>
                  <div style={{ fontSize: "0.85rem" }}>
                    NPU Load: <b>32%</b> &bull; FPS: <b>60.0</b> &bull; Latency: <b>3.2ms</b>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
