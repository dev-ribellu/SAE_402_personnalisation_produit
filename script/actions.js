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

// IntersectionObserver — reveal + slides + timeline items
const io = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  }
}, { threshold: 0.12 });

// reveal
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// slides
document.querySelectorAll('.na-slide-right, .na-slide-left').forEach(el => io.observe(el));

// timeline
document.querySelectorAll('.na-timeline-item[data-io]').forEach(el => io.observe(el));

// Parallax (hero background)
const parallaxEls = Array.from(document.querySelectorAll('.na-parallax'));
let raf = null;

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function updateParallax() {
  raf = null;
  const vh = window.innerHeight || 800;

  for (const el of parallaxEls) {
    const speed = Number(el.dataset.parallax || 0.12);
    const rect = el.getBoundingClientRect();
    const progress = ((rect.top + rect.height / 2) - vh / 2) / (vh / 2);
    const y = clamp(progress, -1.2, 1.2) * speed * -34; // un peu plus marqué que home
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

// Bonus UX “Zara-like” : molette verticale => scroll horizontal sur la rangée d'events
const eventsRow = document.getElementById('events-row');
if (eventsRow) {
  eventsRow.addEventListener('wheel', (e) => {
    // si l'utilisateur scrolle verticalement, on translate en horizontal
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      eventsRow.scrollLeft += e.deltaY;
    }
  }, { passive: false });
}

// Applique automatiquement les images aux placeholders via data-img
document.querySelectorAll('.na-placeholder[data-img]').forEach(el => {
  const url = el.getAttribute('data-img');
  if (!url) return;
  el.style.backgroundImage = `url("${url}")`;
  el.classList.add('has-img');
});