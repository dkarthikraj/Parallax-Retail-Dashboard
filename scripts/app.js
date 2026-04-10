/* PARALLAX — V2 UI: visual effects + wiring (content/images untouched) */
(function () {
  /* === Animated number counters on load === */
  function animateCounters() {
    var counters = document.querySelectorAll('.bold-number, .kpi-value, .counter-box b, .bold-number');
    var seen = new Set();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !seen.has(entry.target)) {
          seen.add(entry.target);
          var el = entry.target;
          var text = el.textContent.trim();
          var num = parseFloat(text.replace(/[^0-9.\-]/g, ''));
          if (!isNaN(num) && text.length < 20) {
            var suffix = text.replace(/^[-0-9.]*/, '');
            var duration = 1200;
            var start = performance.now();
            function tick(now) {
              var progress = Math.min((now - start) / duration, 1);
              var eased = 1 - Math.pow(1 - progress, 3);
              var current = (num * eased).toFixed(progress >= 1 ? (suffix.indexOf('.') > -1 ? 1 : 0) : 1);
              el.textContent = current + suffix;
              if (progress < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
          }
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.kpi-value, .bold-number').forEach(function (el) { observer.observe(el); });
  }

  /* === Scroll-reveal for cards === */
  function initScrollReveal() {
    var cards = document.querySelectorAll('.kpi-card, .action-card, .counter-box, .card-panel');
    cards.forEach(function (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    var revealed = new Set();
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !revealed.has(entry.target)) {
          revealed.add(entry.target);
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.08 });
    cards.forEach(function (c) { obs.observe(c); });
  }

  /* === Toast === */
  function showToast(msg) {
    var c = document.querySelector('.toast-container');
    if (!c) {
      c = document.createElement('div');
      c.className = 'toast-container';
      document.body.appendChild(c);
    }
    var t = document.createElement('div');
    t.className = 'toast-msg';
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; }, 3200);
    setTimeout(function () { t.remove(); }, 3700);
  }
  window.showToast = showToast;

  /* === Dismiss card === */
  window.dismissCard = function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.style.transition = 'opacity .25s, transform .25s';
      el.style.opacity = '0';
      el.style.transform = 'translateY(-4px)';
      setTimeout(function () { el.style.display = 'none'; }, 260);
    }
  };

  /* === Tabs === */
  var tabBtns = Array.prototype.slice.call(document.querySelectorAll('.nav-tab-btn'));
  var panes = Array.prototype.slice.call(document.querySelectorAll('.tab-pane'));
  function activateTab(id) {
    panes.forEach(function (p) { p.classList.toggle('active', p.id === id); });
    tabBtns.forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-tab') === id); });
    if (window.__parallaxResize) window.__parallaxResize();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    /* Re-trigger scroll reveal on new tab */
    setTimeout(initScrollReveal, 100);
  }
  tabBtns.forEach(function (b) {
    b.addEventListener('click', function () { activateTab(b.getAttribute('data-tab')); });
  });
  window.__activateParallaxTab = activateTab;

  /* === Demo actions === */
  window.demoDispatchAssociate = function (who, bay, sku, cardId) {
    showToast('Dispatched ' + who + ' to ' + bay + ' for ' + sku + '.');
    if (cardId) window.dismissCard(cardId);
  };
  window.demoOpenCounter = function (n, who, cardId) {
    showToast('Counter ' + n + ' opening — ' + who + ' notified.');
    var badge = document.getElementById('counter5Badge');
    if (badge) { badge.textContent = 'ACTIVE'; badge.className = 'badge-status green'; }
    var c = document.getElementById('counterCard5');
    if (c) { c.classList.remove('standby'); c.classList.add('healthy'); }
    if (cardId) window.dismissCard(cardId);
  };
  window.demoResolveMisplace = function (cardId) {
    showToast('Retrieval runner assigned.');
    if (cardId) window.dismissCard(cardId);
  };
  window.demoRestockTable = function (skuId, name, bay) {
    showToast('Restock task created: ' + name + ' from ' + bay + '.');
    var row = document.getElementById('row-' + skuId);
    if (row) row.style.background = 'rgba(0, 230, 138, 0.05)';
  };
  window.switchCam = function (camId, btn) {
    document.querySelectorAll('.cam-btn').forEach(function (b) { b.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    var hud = document.getElementById('camHudId');
    if (hud) hud.textContent = camId + ' • LIVE FEED';
    if (window.__camSim && window.__camSim.setCamera) window.__camSim.setCamera(camId);
  };
  window.toggleCamOverlay = function () {};
  window.toggleHeatmapOpt = function () {};

  /* === Boot visualizers + effects === */
  function boot() {
    try {
      if (window.EdgeCameraSimulator && document.getElementById('camOverlay')) {
        window.__camSim = new window.EdgeCameraSimulator('camOverlay', 'realCameraVideo');
      }
      if (window.VideoHeatmapVisualizer && document.getElementById('heatmapOverlay')) {
        window.__heat1 = new window.VideoHeatmapVisualizer('heatmapOverlay', 'heatmapVideo');
      }
      if (window.VideoHeatmapVisualizer && document.getElementById('heatmapOverlayDedicated')) {
        window.__heat2 = new window.VideoHeatmapVisualizer('heatmapOverlayDedicated', 'heatmapVideoDedicated');
      }
    } catch (e) {}
    animateCounters();
    initScrollReveal();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
