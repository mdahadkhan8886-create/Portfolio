/**
 * AHAD KHAN // SILKY-SMOOTH PRELOADER & CONTROLLER
 * High-precision RAF easing curve for preloader counter + particle animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Silky-Smooth Preloader Counter (RAF Easing Curve)
  const preloader = document.querySelector('.loading-screen');
  const counterEl = document.querySelector('.loading-counter');
  const fillBar = document.querySelector('.loading-bar-fill');

  const startTime = performance.now();
  const duration = 1600; // 1.6 seconds smooth curve

  function updatePreloader(now) {
    const elapsed = now - startTime;
    const rawProgress = Math.min(1, elapsed / duration);
    // Cubic ease-out: starts with purposeful momentum, softly settles at 100
    const easedProgress = 1 - Math.pow(1 - rawProgress, 3);
    const count = Math.min(100, Math.floor(easedProgress * 100));

    if (counterEl) counterEl.textContent = count;
    if (fillBar) fillBar.style.width = (easedProgress * 100).toFixed(1) + '%';

    if (rawProgress < 1) {
      requestAnimationFrame(updatePreloader);
    } else {
      if (counterEl) counterEl.textContent = '100';
      if (fillBar) fillBar.style.width = '100%';

      setTimeout(() => {
        if (preloader) {
          preloader.classList.add('loaded');
          // Trigger hero elements reveal smoothly
          const heroElements = document.querySelectorAll('.hero-pill-top, .hero-bio-bottom, .hero-cta-bottom, .hero-scroll-cue');
          heroElements.forEach((el) => {
            el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            el.style.opacity = '1';
            el.style.transform = 'translate3d(0, 0, 0)';
          });
        }
      }, 350);
    }
  }

  requestAnimationFrame(updatePreloader);

  // 2. Generate 20 Floating Dust Particles
  const dustContainer = document.querySelector('.dust-container');
  if (dustContainer) {
    const dustSpecs = [
      { size: 2.1, isEmber: true, top: 12, left: 8, dur: 6.2, delay: 0 },
      { size: 1.5, isEmber: false, top: 25, left: 82, dur: 7.4, delay: 0.6 },
      { size: 2.8, isEmber: false, top: 40, left: 15, dur: 5.8, delay: 1.2 },
      { size: 1.2, isEmber: true, top: 58, left: 91, dur: 8.1, delay: 1.8 },
      { size: 2.4, isEmber: false, top: 72, left: 24, dur: 6.9, delay: 2.4 },
      { size: 1.8, isEmber: false, top: 18, left: 64, dur: 5.5, delay: 3.0 },
      { size: 2.6, isEmber: true, top: 84, left: 45, dur: 7.8, delay: 3.6 },
      { size: 1.4, isEmber: false, top: 33, left: 37, dur: 6.1, delay: 4.2 },
      { size: 2.2, isEmber: false, top: 67, left: 78, dur: 8.5, delay: 4.8 },
      { size: 1.6, isEmber: true, top: 50, left: 6, dur: 5.2, delay: 5.4 },
      { size: 2.5, isEmber: false, top: 28, left: 95, dur: 7.1, delay: 6.0 },
      { size: 1.3, isEmber: false, top: 88, left: 12, dur: 6.6, delay: 6.6 },
      { size: 2.0, isEmber: true, top: 15, left: 48, dur: 8.0, delay: 7.2 },
      { size: 1.7, isEmber: false, top: 44, left: 71, dur: 5.9, delay: 7.8 },
      { size: 2.3, isEmber: false, top: 79, left: 58, dur: 7.3, delay: 8.4 },
      { size: 1.1, isEmber: true, top: 62, left: 31, dur: 6.4, delay: 9.0 },
      { size: 2.7, isEmber: false, top: 92, left: 84, dur: 8.3, delay: 9.6 },
      { size: 1.9, isEmber: false, top: 38, left: 52, dur: 5.6, delay: 10.2 },
    ];

    dustSpecs.forEach((spec) => {
      const d = document.createElement('div');
      d.className = 'dust';
      d.style.width = `${spec.size}px`;
      d.style.height = `${spec.size}px`;
      d.style.background = spec.isEmber ? 'rgba(252, 107, 47, 0.6)' : 'rgba(255, 255, 255, 0.25)';
      d.style.top = `${spec.top}%`;
      d.style.left = `${spec.left}%`;
      d.style.animation = `float ${spec.dur}s ease-in-out infinite`;
      d.style.animationDelay = `${spec.delay}s`;
      dustContainer.appendChild(d);
    });
  }

  // 3. Interactive Labs
  const mathBtn = document.getElementById('btn-math-calc');
  const mathInp = document.getElementById('math-inp');
  const mathOut = document.getElementById('math-out');
  if (mathBtn && mathInp && mathOut) {
    mathBtn.addEventListener('click', () => {
      const n = parseInt(mathInp.value);
      if (isNaN(n) || n < 1 || n > 100) {
        mathOut.innerHTML = '<span style="color:#ef4444;">Please enter an integer between 1 and 100.</span>';
        return;
      }
      const isPrime = new Array(n + 1).fill(true);
      isPrime[0] = isPrime[1] = false;
      const primes = [];
      for (let p = 2; p <= n; p++) {
        if (isPrime[p]) {
          primes.push(p);
          for (let i = p * p; i <= n; i += p) isPrime[i] = false;
        }
      }
      mathOut.innerHTML = `<strong>Primes ≤ ${n} (${primes.length}):</strong> [${primes.join(', ')}]`;
    });
  }

  // AI Temperature Slider
  const tempSlider = document.getElementById('temp-slider');
  const tempNum = document.getElementById('temp-num');
  const tempText = document.getElementById('temp-text');
  if (tempSlider && tempNum && tempText) {
    tempSlider.addEventListener('input', () => {
      const v = parseFloat(tempSlider.value);
      tempNum.textContent = v.toFixed(1);
      if (v < 0.3) {
        tempText.innerHTML = '<strong>Deterministic / Exact</strong> — Optimal for Java code generation and competitive math logic.';
      } else if (v <= 0.8) {
        tempText.innerHTML = '<strong>Balanced Reasoning</strong> — Standard exploratory temperature for conversational agents.';
      } else {
        tempText.innerHTML = '<strong>High Entropy / Creative</strong> — High variance sampling suitable for video editing ideas.';
      }
    });
  }

  // 4. Contact Form Handler
  const contactForm = document.getElementById('portfolio-form');
  const successBox = document.getElementById('contact-success');
  if (contactForm && successBox) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.style.display = 'none';
      successBox.style.display = 'block';
    });
  }
});
