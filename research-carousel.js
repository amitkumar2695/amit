(() => {
  "use strict";
  const root = document.querySelector('.research-showcase');
  if (!root) return;
  const track = root.querySelector('.research-slides');
  const slides = [...root.querySelectorAll('.research-slide')];
  const dots = [...root.querySelectorAll('.research-pagination button')];
  const playback = root.querySelector('.research-playback');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, timer = 0, playing = !reduced.matches, hovering = false, visible = true;
  let touchStart = null;
  function schedule() {
    clearTimeout(timer);
    const active = playing && !hovering && visible && !document.hidden;
    track.setAttribute('aria-live', active ? 'off' : 'polite');
    playback.textContent = playing ? 'Pause slideshow' : 'Play slideshow';
    if (active) timer = setTimeout(() => show(index + 1), 6000);
  }
  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== index; });
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === index)));
    schedule();
  }
  function manual(next) { playing = false; show(next); }
  root.querySelector('.research-prev').addEventListener('click', () => manual(index - 1));
  root.querySelector('.research-next').addEventListener('click', () => manual(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => manual(i)));
  playback.addEventListener('click', () => { playing = !playing; schedule(); });
  root.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); manual(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  // Keyboard focus stops rotation until the visitor explicitly starts it again.
  root.addEventListener('focusin', event => {
    if (event.target !== playback) { playing = false; schedule(); }
  });
  root.addEventListener('mouseenter', () => { hovering = true; schedule(); });
  root.addEventListener('mouseleave', () => { hovering = false; schedule(); });
  track.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') touchStart = {x: event.clientX, y: event.clientY};
  }, {passive: true});
  track.addEventListener('pointerup', event => {
    if (!touchStart) return;
    const dx = event.clientX - touchStart.x, dy = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) manual(index + (dx < 0 ? 1 : -1));
  }, {passive: true});
  track.addEventListener('pointercancel', () => { touchStart = null; });
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => { playing = false; schedule(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }, {threshold: .1}).observe(root);
  }
  root.querySelector('.research-carousel-controls').hidden = false;
  show(0);
})();
