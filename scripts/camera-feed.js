/**
 * PARALLAX - AI-Powered Retail Intelligence Platform
 * Simulated Edge AI Computer Vision Overlay over Real Camera Video Feed
 * Renders real-time bounding boxes, tracking IDs, shelf segmentation masks,
 * and Qualcomm Hexagon NPU inference overlays transparently over real video.
 */

class EdgeCameraSimulator {
  constructor(canvasId, videoId = 'realCameraVideo') {
    this.canvas = document.getElementById(canvasId);
    this.video = document.getElementById(videoId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.activeCamera = 'CAM-08';
    this.showBoundingBoxes = true;
    this.showSegmentation = true;
    this.showTrackingIds = true;
    this.showConfidence = true;

    this.frameCounter = 0;
    this.animId = null;

    this.entities = [];
    this.initCameraEntities();
    this.setupResize();
    this.startRenderLoop();
  }

  setupResize() {
    const setCanvasSize = () => {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.scale(dpr, dpr);
      this.width = rect.width;
      this.height = rect.height;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
  }

  setCamera(camId) {
    this.activeCamera = camId;
    this.initCameraEntities();
  }

  initCameraEntities() {
    this.entities = [];
    const w = this.width || 640;
    const h = this.height || 400;

    if (this.activeCamera === 'CAM-08') {
      // High-velocity Aisle 3 with walking pedestrians and critical shelf stock-out
      this.entities = [
        { type: 'person', id: 'SHP-104', x: w * 0.45, y: h * 0.60, vx: 0, vy: 0, label: 'Shopper #104', conf: 0.98, dwellSec: 28 },
        { type: 'product', id: 'PROD-A', x: w * 0.35, y: h * 0.40, w: 40, h: 50, label: 'Product A', conf: 0.99 },
        { type: 'product', id: 'PROD-B', x: w * 0.55, y: h * 0.38, w: 45, h: 50, label: 'Product B', conf: 0.96 },
        { type: 'shelf_empty', id: 'BAY-3B', x: w * 0.74, y: h * 0.18, w: w * 0.23, h: h * 0.58, label: 'BAY 3B [SHELF STOCK = 0]', conf: 0.99, isAnomaly: true, sku: 'Red Bull 250ml' }
      ];
    } else if (this.activeCamera === 'CAM-13') {
      // Checkout lanes
      this.entities = [
        { type: 'person', id: 'Q-01', x: w * 0.24, y: h * 0.50, vx: 0.08, vy: 0.02, label: 'Customer in Q1', conf: 0.97, dwellSec: 110 },
        { type: 'person', id: 'Q-02', x: w * 0.45, y: h * 0.52, vx: -0.04, vy: 0.01, label: 'Customer in Q2', conf: 0.95, dwellSec: 195 },
        { type: 'queue_zone', id: 'LANE-2', x: w * 0.36, y: h * 0.25, w: w * 0.32, h: h * 0.65, label: 'LANE 2 [CONGESTION RISK]', conf: 0.98, waitMin: 4.4 }
      ];
    } else if (this.activeCamera === 'CAM-05') {
      // Aisle 2
      this.entities = [
        { type: 'person', id: 'SHP-301', x: w * 0.40, y: h * 0.50, vx: 0.25, vy: 0.1, label: 'Shopper #301', conf: 0.95, dwellSec: 42 },
        { type: 'person', id: 'SHP-308', x: w * 0.66, y: h * 0.55, vx: -0.18, vy: -0.06, label: 'Shopper #308', conf: 0.92, dwellSec: 33 }
      ];
    } else {
      // Entrance
      this.entities = [
        { type: 'person', id: 'ENT-01', x: w * 0.30, y: h * 0.45, vx: 0.45, vy: 0.15, label: 'Inbound #01', conf: 0.98, dwellSec: 5 },
        { type: 'person', id: 'ENT-02', x: w * 0.60, y: h * 0.48, vx: -0.35, vy: 0.18, label: 'Inbound #02', conf: 0.97, dwellSec: 8 }
      ];
    }
  }

  updateEntities() {
    const w = this.width || 640;
    const h = this.height || 400;

    this.entities.forEach(entity => {
      if (entity.type === 'person') {
        if (this.frameCounter % 60 === 0) {
          entity.dwellSec += 1;
        }
      }
    });
  }

  render() {
    this.frameCounter++;
    this.updateEntities();

    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Clear canvas so the real video behind is 100% visible
    ctx.clearRect(0, 0, w, h);

    // Draw Computer Vision Overlays Directly Over Real Video
    this.entities.forEach(entity => {
      if (entity.type === 'person') {
        const boxW = 62;
        const boxH = 130;
        const bx = entity.x - boxW / 2;
        const by = entity.y - boxH / 2;

        if (this.showBoundingBoxes) {
          // Bounding Box (Electric Blue with Corner Brackets)
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(bx, by, boxW, boxH);

          // Corner brackets
          const clen = 10;
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2.5;
          // top-left
          ctx.beginPath();
          ctx.moveTo(bx, by + clen); ctx.lineTo(bx, by); ctx.lineTo(bx + clen, by);
          // top-right
          ctx.moveTo(bx + boxW - clen, by); ctx.lineTo(bx + boxW, by); ctx.lineTo(bx + boxW, by + clen);
          // bottom-left
          ctx.moveTo(bx, by + boxH - clen); ctx.lineTo(bx, by + boxH); ctx.lineTo(bx + clen, by + boxH);
          // bottom-right
          ctx.moveTo(bx + boxW - clen, by + boxH); ctx.lineTo(bx + boxW, by + boxH); ctx.lineTo(bx + boxW, by + boxH - clen);
          ctx.stroke();
        }

        // Tracking Tag
        if (this.showTrackingIds) {
          const labelText = `${entity.label} [${entity.dwellSec}s]`;
          ctx.font = '700 10px JetBrains Mono, monospace';
          const textWidth = ctx.measureText(labelText).width;

          ctx.fillStyle = 'rgba(2, 132, 199, 0.92)';
          ctx.fillRect(bx, by - 18, textWidth + 12, 16);

          ctx.fillStyle = '#ffffff';
          ctx.fillText(labelText, bx + 6, by - 6);
        }

        // Confidence Score Tag
        if (this.showConfidence) {
          ctx.font = '700 9px JetBrains Mono, monospace';
          ctx.fillStyle = '#10b981';
          ctx.fillText(`${(entity.conf * 100).toFixed(1)}%`, bx + 2, by + boxH + 13);
        }

      } else if (entity.type === 'product') {
        const boxW = entity.w;
        const boxH = entity.h;
        const bx = entity.x - boxW / 2;
        const by = entity.y - boxH / 2;

        if (this.showBoundingBoxes) {
          ctx.strokeStyle = '#10b981'; // Green for product
          ctx.lineWidth = 1.5;
          ctx.strokeRect(bx, by, boxW, boxH);
        }

        if (this.showTrackingIds) {
          const labelText = entity.label;
          ctx.font = '700 10px JetBrains Mono, monospace';
          const textWidth = ctx.measureText(labelText).width;
          ctx.fillStyle = 'rgba(16, 185, 129, 0.92)';
          ctx.fillRect(bx, by - 18, textWidth + 12, 16);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(labelText, bx + 6, by - 6);
        }

      } else if (entity.type === 'shelf_empty' && this.showSegmentation) {
        // Shelf Stock-out Anomaly Overlay
        const pulse = 0.65 + Math.sin(this.frameCounter * 0.08) * 0.3;
        
        ctx.fillStyle = `rgba(220, 38, 38, ${0.18 * pulse})`;
        ctx.fillRect(entity.x, entity.y, entity.w, entity.h);

        ctx.strokeStyle = `rgba(220, 38, 38, ${pulse})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(entity.x, entity.y, entity.w, entity.h);
        ctx.setLineDash([]);

        // Anomaly Label Tag
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(entity.x, entity.y - 22, entity.w, 20);

        ctx.font = '800 10px JetBrains Mono, monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`🚨 ${entity.label}`, entity.x + 8, entity.y - 8);

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.fillRect(entity.x + 4, entity.y + 6, 130, 16);
        ctx.font = '700 9px JetBrains Mono, monospace';
        ctx.fillStyle = '#fca5a5';
        ctx.fillText(`SKU: ${entity.sku}`, entity.x + 8, entity.y + 18);

      } else if (entity.type === 'queue_zone') {
        ctx.fillStyle = 'rgba(217, 119, 6, 0.15)';
        ctx.fillRect(entity.x, entity.y, entity.w, entity.h);

        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.strokeRect(entity.x, entity.y, entity.w, entity.h);

        ctx.fillStyle = '#d97706';
        ctx.fillRect(entity.x, entity.y - 20, 180, 18);
        ctx.font = '800 10px JetBrains Mono, monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`⚠️ ${entity.label} (${entity.waitMin}m)`, entity.x + 6, entity.y - 7);
      }
    });

    // Qualcomm Hexagon NPU Edge Inference Watermark
    ctx.font = '800 10px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillText('QUALCOMM HEXAGON™ NPU • REAL-TIME EDGE TENSORS', 12, h - 36);

    this.animId = requestAnimationFrame(() => this.render());
  }

  startRenderLoop() {
    if (!this.animId) {
      this.render();
    }
  }

  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }
}

window.EdgeCameraSimulator = EdgeCameraSimulator;
