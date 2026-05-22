/* ══════════════════════════════════════
   ENABLE JS-ONLY STYLES + SCROLL REVEAL
   Hidden states in styles.css only apply when html.js-on is set,
   so if JS fails everything stays visible.
══════════════════════════════════════ */
document.documentElement.classList.add('js-on');

const REVEAL_MAP = [
  { sel: '.s-eyebrow',                  cls: 'reveal-left' },
  { sel: '.s-title',                    cls: 'reveal-up' },
  { sel: '.sec-lead',                   cls: 'reveal-up' },
  { sel: '.ap-lead, .ap-sign',          cls: 'reveal-up' },
  { sel: '.why-grid',                   cls: 'reveal-stagger' },
  { sel: '.proj-banner',                cls: 'reveal-up' },
  { sel: '.srv-center, .srv-grid',      cls: 'reveal-up' },
  { sel: '.srv-grid',                   cls: 'reveal-stagger' },
  { sel: '.founder-visual',             cls: 'reveal-scale' },
  { sel: '.founder-quote, .founder-sign', cls: 'reveal-up' },
  { sel: '.faq-list',                   cls: 'reveal-stagger' },
  { sel: '.inv-left, .inv-box',         cls: 'reveal-up' },
  { sel: '.inv-perks',                  cls: 'reveal-stagger' },
  { sel: '.contact-left, .contact-form', cls: 'reveal-up' },
  { sel: 'footer .footer-top',          cls: 'reveal-stagger' },
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

/* ══════════════════════════════════════
   LENIS SMOOTH SCROLL
══════════════════════════════════════ */
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

/* ══════════════════════════════════════
   BLUR-UP IMAGE LOADER  [data-img] → background-image
══════════════════════════════════════ */
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

/* ══════════════════════════════════════
   CURSOR
══════════════════════════════════════ */
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
  document.querySelectorAll('a,button,.proj-banner,.srv-card,.why-card,.faq-item summary')
    .forEach(el => {
      el.addEventListener('mouseenter', () => { cur.classList.add('big'); curR.classList.add('big'); });
      el.addEventListener('mouseleave', () => { cur.classList.remove('big'); curR.classList.remove('big'); });
    });
}

/* ══════════════════════════════════════
   NAVBAR + SCROLL BAR + PARALLAX + NAV HIDE
══════════════════════════════════════ */
const navbar    = document.getElementById('nav');
const scrollBar = document.getElementById('scroll-bar');
const heroSection = document.getElementById('hero');
const heroContent = heroSection ? heroSection.querySelector('.hero-content') : null;
const heroBg = heroSection ? heroSection.querySelector('.hero-bg') : null;

let lastScrollY = 0;
let navHideTimeout = null;
let ticking = false;

function onScroll() {
  const sy = window.scrollY;

  // --- Scroll bar ---
  if (scrollBar) {
    const pct = sy / (document.body.scrollHeight - window.innerHeight) * 100;
    scrollBar.style.width = pct + '%';
  }

  // --- Navbar scrolled state ---
  if (navbar) navbar.classList.toggle('scrolled', sy > 60);
  document.body.classList.toggle('scrolled-down', sy > 200);

  // --- Auto-hide navbar on scroll down, show on scroll up ---
  if (navbar && sy > 300) {
    if (sy > lastScrollY + 8) {
      navbar.classList.add('nav-hidden');
    } else if (sy < lastScrollY - 4) {
      navbar.classList.remove('nav-hidden');
    }
  } else if (navbar) {
    navbar.classList.remove('nav-hidden');
  }

  // --- Hero parallax ---
  if (heroContent && sy < window.innerHeight) {
    const ratio = sy / window.innerHeight;
    heroContent.style.transform = `translate3d(0, ${sy * 0.35}px, 0)`;
    heroContent.style.opacity = 1 - ratio * 1.1;
  }

  lastScrollY = sy;
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(onScroll);
    ticking = true;
  }
}, { passive: true });

/* ══════════════════════════════════════
   MAGNETIC BUTTONS
══════════════════════════════════════ */
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const MAG_SEL = '.btn-dark, .nav-cta, .cf-submit, .f-submit';
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

/* ══════════════════════════════════════
   HAMBURGER MENU
══════════════════════════════════════ */
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

/* ══════════════════════════════════════
   SMOOTH ANCHORS
══════════════════════════════════════ */
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

/* ══════════════════════════════════════
   TOUCH DEVICE: disable custom cursor
══════════════════════════════════════ */
if (window.matchMedia('(hover: none)').matches) {
  document.body.style.cursor = 'auto';
  if (cur)  cur.style.display  = 'none';
  if (curR) curR.style.display = 'none';
}

/* ══════════════════════════════════════
   LANGUAGE PILL (visual only)
══════════════════════════════════════ */
document.querySelectorAll('.nav-lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ══════════════════════════════════════
   APPOINTMENT MODAL
══════════════════════════════════════ */
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

/* ══════════════════════════════════════
   PROJECT BANNER SCROLL REVEAL
══════════════════════════════════════ */
const bannerObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      bannerObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

document.querySelectorAll('.proj-banner').forEach(el => bannerObserver.observe(el));

/* ══════════════════════════════════════
   COUNTER / NUMBER ANIMATION
══════════════════════════════════════ */
function animateCounter(el) {
  const text = el.textContent.trim();
  // Extract numeric part and suffix (e.g. "15+" → 15, "+" | "98%" → 98, "%")
  const match = text.match(/^(\d+)(.*?)$/);
  if (!match) return;

  const target = parseInt(match[1], 10);
  const suffix = match[2] || '';
  const duration = 1800;
  const start = performance.now();

  el.textContent = '0' + suffix;

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      if (!el.dataset.counted) {
        el.dataset.counted = '1';
        animateCounter(el);
      }
      counterObserver.unobserve(el);
    }
  });
}, { rootMargin: '0px 0px -5% 0px', threshold: 0.5 });

document.querySelectorAll('.trust-item strong').forEach(el => counterObserver.observe(el));

/* ══════════════════════════════════════
   SUBTLE SECTION PARALLAX
══════════════════════════════════════ */
const parallaxSections = document.querySelectorAll('#why, #services');

if (parallaxSections.length && !REDUCED) {
  parallaxSections.forEach(sec => sec.classList.add('parallax-section'));

  const parallaxContent = [];
  parallaxSections.forEach(sec => {
    const inner = sec.querySelector('.sec-header, .why-grid, .srv-orbit, .faq-list');
    if (inner) parallaxContent.push({ section: sec, inner: inner });
  });

  const parallaxScroll = () => {
    parallaxContent.forEach(({ section, inner }) => {
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight;
      // Only apply when section is in view
      if (rect.top < viewH && rect.bottom > 0) {
        const center = rect.top + rect.height / 2;
        const offset = (center - viewH / 2) / viewH;
        inner.style.transform = `translate3d(0, ${offset * -18}px, 0)`;
      }
    });
  };

  window.addEventListener('scroll', () => {
    requestAnimationFrame(parallaxScroll);
  }, { passive: true });
}
