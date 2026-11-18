(() => {
  "use strict";
  const root = document.querySelector('.research-showcase');
  if (!root) return;
  const track = root.querySelector('.research-slides');
  const slides = [...root.querySelectorAll('.research-slide')];
  const dots = [...root.querySelectorAll('.research-pagination button')];
  const playback = root.querySelector('.research-playback');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const videos = [...track.querySelectorAll('video')];

  // The first PNG loads immediately; automatic rotation begins only on Play.
  // Videos use their native controls when a visitor selects a slide manually.
  let index = 0, timer = 0, playing = false, hovering = false, visible = true;
  let touchStart = null;
  let autoplayVideo = null;

  function activeVideo() {
    return slides[index].querySelector('video');
  }

  function pauseAutoplayVideo() {
    if (autoplayVideo) {
      autoplayVideo.pause();
      autoplayVideo = null;
    }
  }

  function schedule() {
    clearTimeout(timer);
    const active = playing && !hovering && visible && !document.hidden;
    track.setAttribute('aria-live', active ? 'off' : 'polite');
    playback.textContent = playing ? 'Pause slideshow' : 'Play slideshow';

    if (!active) {
      pauseAutoplayVideo();
      return;
    }

    const video = activeVideo();
    if (video) {
      if (video.ended) {
        show(index + 1);
        return;
      }
      autoplayVideo = video;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          if (autoplayVideo === video) {
            // If autoplay cannot start, retain native video controls.
            playing = false;
            schedule();
          }
        });
      }
      return; // Keep video visible until the clip finishes.
    }

    pauseAutoplayVideo();
    // Only warm the next PNG once the visitor has enabled autoplay.
    const nextImage = slides[(index + 1) % slides.length].querySelector('img');
    if (nextImage && nextImage.loading === 'lazy') nextImage.loading = 'eager';
    timer = setTimeout(() => show(index + 1), 6000);
  }

  function show(next) {
    const nextIndex = (next + slides.length) % slides.length;
    videos.forEach(video => {
      if (!slides[nextIndex].contains(video)) {
        video.pause();
        if (video.readyState > 0) video.currentTime = 0;
      }
    });
    autoplayVideo = null;
    index = nextIndex;
    slides.forEach((slide, i) => { slide.hidden = i !== index; });
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === index)));
    schedule();
  }

  function manual(next) {
    playing = false;
    show(next);
  }

  videos.forEach(video => {
    video.addEventListener('ended', () => {
      if (playing && slides[index].contains(video)) show(index + 1);
    });
    video.addEventListener('error', () => {
      if (playing && slides[index].contains(video)) {
        playing = false;
        schedule(); // Do not loop indefinitely over an unavailable video.
      }
    });
  });

  root.querySelector('.research-prev').addEventListener('click', () => manual(index - 1));
  root.querySelector('.research-next').addEventListener('click', () => manual(index + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => manual(i)));
  playback.addEventListener('click', () => {
    playing = !playing;
    schedule();
  });

  root.addEventListener('keydown', event => {
    if ((event.key === 'ArrowLeft' || event.key === 'ArrowRight')
        && !event.target.closest('video')) {
      event.preventDefault();
      manual(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  // Allow native video controls to receive focus and operate normally.
  root.addEventListener('focusin', event => {
    if (event.target !== playback && !event.target.closest('video')) {
      playing = false;
      schedule();
    }
  });
  root.addEventListener('mouseenter', () => { hovering = true; schedule(); });
  root.addEventListener('mouseleave', () => { hovering = false; schedule(); });

  track.addEventListener('pointerdown', event => {
    if (event.target.closest('video')) return;
    if (event.pointerType === 'touch') touchStart = {x: event.clientX, y: event.clientY};
  }, {passive: true});
  track.addEventListener('pointerup', event => {
    if (!touchStart || event.target.closest('video')) { touchStart = null; return; }
    const dx = event.clientX - touchStart.x, dy = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) manual(index + (dx < 0 ? 1 : -1));
  }, {passive: true});
  track.addEventListener('pointercancel', () => { touchStart = null; });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) videos.forEach(video => video.pause());
    schedule();
  });
  reduced.addEventListener('change', () => { playing = false; schedule(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      schedule();
    }, {threshold: .1}).observe(root);
  }

  root.querySelector('.research-carousel-controls').hidden = false;
  show(0);
})();
