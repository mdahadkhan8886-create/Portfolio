/**
 * AHAD KHAN // SILKY-SMOOTH VARIABLE FONT TEXT PRESSURE
 * Continuous RAF interpolation loop with spring physics for fluid letter reaction
 */

(function () {
  const container = document.querySelector('.text-pressure-title');
  if (!container) return;

  const spans = Array.from(container.querySelectorAll('span'));
  if (spans.length === 0) return;

  // State per letter for buttery spring interpolation
  const letters = spans.map((span) => ({
    el: span,
    currentWeight: 200,
    targetWeight: 200,
    currentWidth: 75,
    targetWidth: 75,
    currentScale: 1.0,
    targetScale: 1.0,
    currentY: 0,
    targetY: 0,
    glow: 0,
    targetGlow: 0,
  }));

  const mouse = {
    x: -9999,
    y: -9999,
    targetX: -9999,
    targetY: -9999,
    active: false,
  };

  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
    mouse.targetX = -9999;
    mouse.targetY = -9999;
  });

  // Smooth RAF physics loop
  function loop() {
    // Smooth mouse position
    mouse.x += (mouse.targetX - mouse.x) * 0.25;
    mouse.y += (mouse.targetY - mouse.y) * 0.25;

    letters.forEach((item) => {
      if (mouse.active) {
        const rect = item.el.getBoundingClientRect();
        const charCenterX = rect.left + rect.width / 2;
        const charCenterY = rect.top + rect.height / 2;

        const dx = mouse.x - charCenterX;
        const dy = mouse.y - charCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const maxDist = 240;
        if (dist < maxDist) {
          const factor = Math.cos((dist / maxDist) * (Math.PI / 2)); // Smooth cosine curve
          item.targetWeight = 200 + factor * 700; // 200 -> 900
          item.targetWidth = 70 + factor * 70; // 70 -> 140
          item.targetScale = 1.0 + factor * 0.16; // 1.0 -> 1.16
          item.targetY = -factor * 14; // Lift letter
          item.targetGlow = factor;
        } else {
          item.targetWeight = 200;
          item.targetWidth = 75;
          item.targetScale = 1.0;
          item.targetY = 0;
          item.targetGlow = 0;
        }
      } else {
        item.targetWeight = 200;
        item.targetWidth = 75;
        item.targetScale = 1.0;
        item.targetY = 0;
        item.targetGlow = 0;
      }

      // Time-smoothed lerp
      const ease = 0.14;
      item.currentWeight += (item.targetWeight - item.currentWeight) * ease;
      item.currentWidth += (item.targetWidth - item.currentWidth) * ease;
      item.currentScale += (item.targetScale - item.currentScale) * ease;
      item.currentY += (item.targetY - item.currentY) * ease;
      item.glow += (item.targetGlow - item.glow) * ease;

      // Apply GPU-accelerated transform & variable font settings
      item.el.style.fontVariationSettings = `'wght' ${Math.round(item.currentWeight)}, 'wdth' ${Math.round(item.currentWidth)}`;
      item.el.style.transform = `translate3d(0, ${item.currentY.toFixed(2)}px, 0) scale(${item.currentScale.toFixed(3)})`;

      if (item.glow > 0.15) {
        item.el.style.color = '#FC6B2F';
        item.el.style.textShadow = `0 0 ${(item.glow * 30).toFixed(1)}px rgba(252, 107, 47, ${(item.glow * 0.8).toFixed(2)})`;
      } else {
        item.el.style.color = 'rgba(255, 255, 255, 0.88)';
        item.el.style.textShadow = 'none';
      }
    });

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
