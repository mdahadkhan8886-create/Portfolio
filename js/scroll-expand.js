/**
 * AHAD KHAN // SILKY-SMOOTH SCROLL-EXPAND "THE PHILOSOPHY"
 * RAF damped interpolation loop for buttery-smooth clip-path and crossfade
 */

(function () {
  const track = document.querySelector('.scroll-expand__track');
  const frame = document.querySelector('.scroll-expand__frame');
  const title = document.querySelector('.scroll-expand__title');
  const hint = document.querySelector('.scroll-expand__hint');
  const overlay = document.querySelector('.scroll-expand__overlay');

  if (!track || !frame) return;

  let targetProgress = 0;
  let currentProgress = 0;

  function onScroll() {
    const rect = track.getBoundingClientRect();
    const trackHeight = track.offsetHeight - window.innerHeight;
    if (trackHeight <= 0) return;

    const scrollY = -rect.top;
    targetProgress = Math.max(0, Math.min(1, scrollY / trackHeight));
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function animate() {
    // Smooth lerp damping for weightless, fluid scroll motion
    currentProgress += (targetProgress - currentProgress) * 0.12;

    const p = currentProgress;

    // Smooth clip-path expansion
    const insetTB = (16 * (1 - p)).toFixed(2);
    const insetLR = (24 * (1 - p)).toFixed(2);
    const radius = (24 * (1 - p)).toFixed(1);

    frame.style.clipPath = `inset(${insetTB}% ${insetLR}% round ${radius}px)`;
    frame.style.webkitClipPath = `inset(${insetTB}% ${insetLR}% round ${radius}px)`;

    // Title cross-fade
    if (title) {
      const titleOpacity = Math.max(0, 1 - p * 2.2);
      title.style.opacity = titleOpacity.toFixed(3);
      title.style.transform = `translate3d(0, ${(-p * 35).toFixed(1)}px, 0) scale(${(1 - p * 0.08).toFixed(3)})`;
    }

    // Hint fade
    if (hint) {
      const hintOpacity = Math.max(0, 1 - p * 3.5);
      hint.style.opacity = hintOpacity.toFixed(3);
    }

    // Overlay quote fade-in with upward float
    if (overlay) {
      const overlayOpacity = Math.max(0, Math.min(1, (p - 0.3) * 2.0));
      overlay.style.opacity = overlayOpacity.toFixed(3);
      overlay.style.transform = `translate3d(0, ${((1 - overlayOpacity) * 24).toFixed(1)}px, 0)`;
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();
