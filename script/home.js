// Smooth scroll (anchors)
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        const el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Reveal on scroll
    const revealEls = Array.from(document.querySelectorAll('.reveal'));
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      }
    }, { threshold: 0.12 });

    revealEls.forEach(el => io.observe(el));

    // Parallax léger sur les images
    const parallaxEls = Array.from(document.querySelectorAll('.parallax'));
    let raf = null;

    function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

    function updateParallax() {
      raf = null;
      const vh = window.innerHeight || 800;

      for (const el of parallaxEls) {
        const speed = Number(el.dataset.parallax || 0.12);
        const rect = el.getBoundingClientRect();

        // progression: -1 (au dessus) -> 1 (en dessous)
        const progress = ((rect.top + rect.height / 2) - vh / 2) / (vh / 2);
        const y = clamp(progress, -1.2, 1.2) * speed * -28; // amplitude légère
        el.style.setProperty('--parallaxY', y + 'px');
      }
    }

    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(updateParallax);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateParallax();