/* ══════════ ENABLE JS-ONLY STYLES + SCROLL REVEAL ══════════ */
document.documentElement.classList.add('js-on');

const REVEAL_MAP = [
  { sel: '.s-eyebrow',                cls: 'reveal-left' },
  { sel: '.s-title',                  cls: 'reveal-up' },
  { sel: '.sec-lead',                 cls: 'reveal-up' },
  { sel: '.pp-overview-eyebrow',      cls: 'reveal-left' },
  { sel: '.pp-overview-title',        cls: 'reveal-up' },
  { sel: '.pp-overview-body',         cls: 'reveal-up' },
  { sel: '.pp-facts',                 cls: 'reveal-stagger' },
  { sel: '.pp-features-grid',         cls: 'reveal-stagger' },
  { sel: '.pp-gallery-grid',          cls: 'reveal-stagger' },
  { sel: '.pp-timeline-grid',         cls: 'reveal-stagger' },
  { sel: '.pp-other-grid',            cls: 'reveal-stagger' },
  { sel: '.pp-cta-title',             cls: 'reveal-up' },
  { sel: '.pp-cta-sub',               cls: 'reveal-up' },
  { sel: '.pp-cta-btns',              cls: 'reveal-up' },
  { sel: 'footer .footer-top',        cls: 'reveal-stagger' },
];

REVEAL_MAP.forEach(({ sel, cls }) => {
  document.querySelectorAll(sel).forEach(el => el.classList.add(cls));
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-fade, .reveal-scale, .reveal-stagger')
  .forEach(el => revealObserver.observe(el));

/* ══════════ LENIS SMOOTH SCROLL ══════════ */
let lenis = null;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.15,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
  });
  function lenisRaf(time) { lenis.raf(time); requestAnimationFrame(lenisRaf); }
  requestAnimationFrame(lenisRaf);
}

/* ══════════ BLUR-UP IMAGE LOADER ══════════ */
const imgObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const url = el.dataset.img;
    if (!url || el.dataset.loaded) return;
    el.dataset.loaded = '1';
    const probe = new Image();
    probe.onload = () => {
      el.style.backgroundImage = `url('${url}')`;
      requestAnimationFrame(() => el.classList.add('is-loaded'));
    };
    probe.onerror = () => el.classList.add('is-loaded');
    probe.src = url;
    imgObserver.unobserve(el);
  });
}, { rootMargin: '300px' });

document.querySelectorAll('[data-img]').forEach(el => imgObserver.observe(el));

/* ══════════ CURSOR ══════════ */
const cur  = document.getElementById('cur');
const curR = document.getElementById('curR');
if (cur && curR) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  });
  (function loop() {
    rx += (mx - rx) * .11; ry += (my - ry) * .11;
    curR.style.left = rx + 'px'; curR.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.pp-feature,.pp-gallery-item,.pp-tl-card,.pp-other-card')
    .forEach(el => {
      el.addEventListener('mouseenter', () => { cur.classList.add('big'); curR.classList.add('big'); });
      el.addEventListener('mouseleave', () => { cur.classList.remove('big'); curR.classList.remove('big'); });
    });
}

/* ══════════ NAVBAR + SCROLL BAR ══════════ */
const navbar    = document.getElementById('nav');
const scrollBar = document.getElementById('scroll-bar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', scrollY > 60);
  document.body.classList.toggle('scrolled-down', scrollY > 200);
  if (scrollBar) {
    const pct = scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    scrollBar.style.width = pct + '%';
  }
}, { passive: true });

/* nav is always scrolled-style on project pages */
if (navbar) navbar.classList.add('scrolled');

/* ══════════ HAMBURGER MENU ══════════ */
const hamBtn     = document.getElementById('hamBtn');
const mobNav     = document.getElementById('mobNav');
const mobOverlay = document.getElementById('mobOverlay');

function openMenu() {
  hamBtn.classList.add('open');
  mobNav.classList.add('open');
  mobOverlay.classList.add('open');
  hamBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  if (lenis) lenis.stop();
}
function closeMenu() {
  hamBtn.classList.remove('open');
  mobNav.classList.remove('open');
  mobOverlay.classList.remove('open');
  hamBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  if (lenis) lenis.start();
}
if (hamBtn) {
  hamBtn.addEventListener('click', () => {
    hamBtn.classList.contains('open') ? closeMenu() : openMenu();
  });
  if (mobOverlay) mobOverlay.addEventListener('click', closeMenu);
  document.querySelectorAll('.mob-nav-links a, .mob-nav-cta').forEach(a => {
    a.addEventListener('click', closeMenu);
  });
}

/* ══════════ TOUCH DEVICE ══════════ */
if (window.matchMedia('(hover: none)').matches) {
  document.body.style.cursor = 'auto';
  if (cur)  cur.style.display  = 'none';
  if (curR) curR.style.display = 'none';
}

/* ══════════ LANG PILL ══════════ */
document.querySelectorAll('.nav-lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ══════════ MAGNETIC BUTTONS ══════════ */
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const MAG_SEL = '.btn-dark, .nav-cta, .cf-submit, .f-submit, .pp-cta-btn';
document.querySelectorAll(MAG_SEL).forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const dx = (x - r.width  / 2) * 0.25;
    const dy = (y - r.height / 2) * 0.30;
    if (!REDUCED) btn.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    btn.style.setProperty('--mx', `${(x / r.width)  * 100}%`);
    btn.style.setProperty('--my', `${(y / r.height) * 100}%`);
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ══════════ SMOOTH ANCHORS ══════════ */
document.querySelectorAll('a[href^="#"]:not([data-appt])').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') { e.preventDefault(); if (lenis) lenis.scrollTo(0); else scrollTo({top:0, behavior:'smooth'}); return; }
    const t = document.querySelector(href);
    if (!t) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(t, { offset: -20, duration: 1.4 });
    else t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ══════════ APPOINTMENT MODAL ══════════ */
const apptModal = document.getElementById('appt-modal');
function openApptModal() {
  if (!apptModal) return;
  document.body.style.overflow = 'hidden';
  if (lenis) lenis.stop();
  apptModal.classList.add('open');
  apptModal.setAttribute('aria-hidden', 'false');
}
function closeApptModal() {
  if (!apptModal) return;
  apptModal.classList.remove('open');
  apptModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lenis) lenis.start();
}
document.querySelectorAll('[data-appt]').forEach(el => {
  el.addEventListener('click', e => { e.preventDefault(); openApptModal(); });
});
if (apptModal) {
  apptModal.addEventListener('click', e => { if (e.target === apptModal) closeApptModal(); });
  const closeBtn = apptModal.querySelector('.amo-close');
  if (closeBtn) closeBtn.addEventListener('click', closeApptModal);
  const submitBtn = apptModal.querySelector('.cf-submit');
  if (submitBtn) submitBtn.addEventListener('click', e => {
    e.preventDefault();
    alert('Merci ! Votre demande de rendez-vous a été enregistrée. Notre équipe vous recontacte sous 24h.');
    closeApptModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && apptModal.classList.contains('open')) closeApptModal();
  });
}
