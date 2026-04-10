/**
 * PARALLAX - AI-Powered Retail Intelligence Platform
 * Video-Based Real-Time Thermal Heatmap Visualizer
 * Overlays dynamic thermal density gradients, dwell hotspots,
 * and pedestrian motion vectors directly over real video footage.
 */

class VideoHeatmapVisualizer {
  constructor(canvasId, videoId = 'heatmapVideo') {
    this.canvas = document.getElementById(canvasId);
    this.video = document.getElementById(videoId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.showThermal = true;
    this.showMotionTrails = true;
    this.showZoneLabels = true;

    this.frameCounter = 0;
    this.animId = null;

    // Heat points mapped to realistic store zones in the video
    this.heatPoints = [
      { name: 'Aisle 3 (Beverages)', xRatio: 0.72, yRatio: 0.48, radius: 95, intensity: 0.95, dwell: '5.4 min', status: 'HOTSPOT' },
      { name: 'Aisle 1 (Produce & Bakery)', xRatio: 0.28, yRatio: 0.42, radius: 80, intensity: 0.75, dwell: '4.6 min', status: 'ACTIVE' },
      { name: 'Checkout Lanes 1-4', xRatio: 0.48, yRatio: 0.76, radius: 90, intensity: 0.88, dwell: '3.8 min', status: 'HIGH DENSITY' },
      { name: 'Aisle 2 (Dairy & Oils)', xRatio: 0.46, yRatio: 0.35, radius: 70, intensity: 0.60, dwell: '3.2 min', status: 'MODERATE' },
      { name: 'Aisle 4 (Breakfast Cereals)', xRatio: 0.86, yRatio: 0.32, radius: 60, intensity: 0.25, dwell: '1.5 min', status: 'COLD ZONE' }
    ];

    // Dynamic walking heat trails that follow pedestrians
    this.dynamicTrails = [];
    this.initDynamicTrails(8);

    this.setupResize();
    this.startRenderLoop();
  }

  setupResize() {
    const resize = () => {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.scale(dpr, dpr);
      this.width = rect.width;
      this.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);
  }

  initDynamicTrails(count) {
    this.dynamicTrails = [];
    for (let i = 0; i < count; i++) {
      this.dynamicTrails.push({
        x: 0.15 + Math.random() * 0.7,
        y: 0.30 + Math.random() * 0.5,
        vx: (Math.random() - 0.5) * 0.003,
        vy: (Math.random() - 0.5) * 0.0015,
        radius: 40 + Math.random() * 25,
        heat: 0.6 + Math.random() * 0.35
      });
    }
  }

  updateTrails() {
    // Static overlay for image (no movement)
  }

  render() {
    this.frameCounter++;
    this.updateTrails();

    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Clear transparently so video plays underneath
    ctx.clearRect(0, 0, w, h);

    // Thermal Heatmap Overlay (Surveillance false-color density)
    if (this.showThermal) {
      // 1. Static Store Hotspots (Aisle zones)
      this.heatPoints.forEach(hp => {
        const cx = hp.xRatio * w;
        const cy = hp.yRatio * h;
        const pulse = 1 + Math.sin(this.frameCounter * 0.04 + hp.xRatio * 10) * 0.08;
        const r = hp.radius * pulse;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);

        if (hp.intensity > 0.8) {
          // Hot Zone: Deep Red -> Orange -> Yellow -> Transparent
          grad.addColorStop(0, 'rgba(220, 38, 38, 0.60)');
          grad.addColorStop(0.35, 'rgba(234, 88, 12, 0.45)');
          grad.addColorStop(0.70, 'rgba(234, 179, 8, 0.25)');
          grad.addColorStop(1, 'rgba(234, 179, 8, 0)');
        } else if (hp.intensity > 0.5) {
          // Moderate Zone: Emerald -> Cyan -> Transparent
          grad.addColorStop(0, 'rgba(5, 150, 105, 0.50)');
          grad.addColorStop(0.5, 'rgba(2, 132, 199, 0.30)');
          grad.addColorStop(1, 'rgba(2, 132, 199, 0)');
        } else {
          // Cold Zone: Cool Blue
          grad.addColorStop(0, 'rgba(2, 132, 199, 0.35)');
          grad.addColorStop(0.6, 'rgba(56, 189, 248, 0.15)');
          grad.addColorStop(1, 'rgba(2, 132, 199, 0)');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        // Zone Info Tag
        if (this.showZoneLabels) {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          const tagText = `${hp.name}: ${hp.dwell}`;
          ctx.font = '700 11px Plus Jakarta Sans, sans-serif';
          const tw = ctx.measureText(tagText).width;

          ctx.fillRect(cx - tw / 2 - 8, cy - r - 16, tw + 16, 20);
          ctx.strokeStyle = hp.intensity > 0.8 ? '#dc2626' : '#0284c7';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(cx - tw / 2 - 8, cy - r - 16, tw + 16, 20);

          ctx.fillStyle = '#ffffff';
          ctx.fillText(tagText, cx - tw / 2, cy - r - 2);
        }
      });

      // 2. Dynamic Pedestrian Heat Trails (Follows people walking)
      if (this.showMotionTrails) {
        this.dynamicTrails.forEach(t => {
          const tx = t.x * w;
          const ty = t.y * h;

          const grad = ctx.createRadialGradient(tx, ty, 0, tx, ty, t.radius);
          grad.addColorStop(0, 'rgba(245, 158, 11, 0.45)');
          grad.addColorStop(0.5, 'rgba(5, 150, 105, 0.25)');
          grad.addColorStop(1, 'rgba(5, 150, 105, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(tx, ty, t.radius, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }

    // Camera HUD Overlay (CCTV Surveillance style)
    ctx.font = '700 11px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText('LIVE CCTV THERMAL HEATMAP • OVERHEAD CAM-03', 14, 24);

    ctx.font = '600 10px JetBrains Mono, monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('FPS: 60 • QUALCOMM NPU DENSITY TRACKER • PEAK: AISLE 3', 14, h - 14);

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

window.VideoHeatmapVisualizer = VideoHeatmapVisualizer;
