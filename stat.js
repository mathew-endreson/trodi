gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════
   CINEMATIC INTRO  (3 s total)
══════════════════════════════════════ */
const introTl = gsap.timeline({
  onComplete() {
    document.getElementById('ci').style.display = 'none';
    document.body.classList.remove('intro-lock');
    ScrollTrigger.refresh();
  }
});

introTl
  .to('.ci-logo-mark', { clipPath: 'inset(0 0% 0 0)', duration: 0.95, ease: 'power4.out' }, 0.15)
  .to('.ci-rule',      { width: '90px', duration: 0.7, ease: 'power3.out' }, 0.6)
  .to('.ci-subtitle',  { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, 0.85)
  .to('.ci-center',    { opacity: 0, duration: 0.28, ease: 'power2.in' }, 1.72)
  .to('.ci-curtain-t', { yPercent: -100, duration: 0.85, ease: 'power4.inOut' }, 1.88)
  .to('.ci-curtain-b', { yPercent: 100,  duration: 0.85, ease: 'power4.inOut' }, 1.88);

/* ══════════════════════════════════════
   CURSOR
══════════════════════════════════════ */
const cur  = document.getElementById('cur');
const curR = document.getElementById('curR');
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

document.querySelectorAll('a,button,.proj-card,.srv-card,.acc-card,.vm-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cur.classList.add('big'); curR.classList.add('big'); });
  el.addEventListener('mouseleave', () => { cur.classList.remove('big'); curR.classList.remove('big'); });
});

/* ══════════════════════════════════════
   NAVBAR
══════════════════════════════════════ */
const navbar = document.getElementById('nav');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', scrollY > 60));

/* ══════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════ */
const scrollBar = document.getElementById('scroll-bar');
window.addEventListener('scroll', () => {
  const pct = scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  scrollBar.style.width = pct + '%';
});

/* ══════════════════════════════════════
   COUNTER (hero stats)
══════════════════════════════════════ */
function countUp(el, target, suffix) {
  let c = 0;
  const step = target / 70;
  const t = setInterval(() => {
    c += step;
    if (c >= target) { c = target; clearInterval(t); }
    el.textContent = Math.floor(c) + (suffix || '+');
  }, 22);
}

const hs = document.querySelector('.hero-stats');
if (hs) {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting)
        document.querySelectorAll('[data-count]').forEach(el =>
          countUp(el, +el.dataset.count, el.dataset.suffix || '+'));
    });
  }, { threshold: .5 }).observe(hs);
}

/* ══════════════════════════════════════
   GSAP SCROLL ANIMATIONS
══════════════════════════════════════ */
const ease      = 'power4.out';
const easeSlide = 'power3.out';

function st(trigger, start = 'top 88%') {
  return { trigger, start, once: true };
}

gsap.utils.toArray('.s-tag').forEach(el => {
  gsap.from(el, { x: -28, opacity: 0, duration: 0.75, ease: easeSlide, scrollTrigger: st(el) });
});

gsap.utils.toArray('.s-title').forEach(el => {
  gsap.from(el, { clipPath: 'inset(0 0 100% 0)', y: 24, duration: 1.25, ease, scrollTrigger: st(el, 'top 90%') });
});

gsap.utils.toArray('.s-body').forEach(el => {
  gsap.from(el, { y: 28, opacity: 0, duration: 0.95, ease: easeSlide, scrollTrigger: st(el) });
});

gsap.from('.ap-img-main', {
  clipPath: 'inset(100% 0 0 0)', duration: 1.45, ease,
  scrollTrigger: { trigger: '.ap-visual', start: 'top 82%', once: true }
});
gsap.from('.ap-img-sec', {
  clipPath: 'inset(100% 0 0 0)', duration: 1.45, delay: 0.22, ease,
  scrollTrigger: { trigger: '.ap-visual', start: 'top 82%', once: true }
});
gsap.from('.ap-medal', {
  scale: 0, opacity: 0, duration: 0.75, delay: 0.65, ease: 'back.out(1.5)',
  scrollTrigger: { trigger: '.ap-visual', start: 'top 82%', once: true }
});

gsap.from('.vm-card', {
  y: 34, opacity: 0, duration: 0.85, stagger: 0.18, ease: easeSlide,
  scrollTrigger: { trigger: '.vm-grid', start: 'top 88%', once: true }
});

gsap.from('.srv-intro', {
  x: 40, opacity: 0, duration: 0.9, ease: easeSlide,
  scrollTrigger: { trigger: '.srv-header', start: 'top 88%', once: true }
});

gsap.from('.srv-card', {
  y: 70, opacity: 0, scale: 0.96, duration: 1.1, stagger: 0.14, ease,
  scrollTrigger: { trigger: '.srv-grid', start: 'top 86%', once: true }
});

gsap.from('.proj-header .s-body', {
  y: 22, opacity: 0, duration: 0.85, delay: 0.2, ease: easeSlide,
  scrollTrigger: { trigger: '.proj-header', start: 'top 88%', once: true }
});

gsap.from('.proj-card', {
  y: 80, opacity: 0, duration: 1.2, stagger: 0.16, ease,
  scrollTrigger: { trigger: '.proj-grid', start: 'top 88%', once: true }
});

gsap.to('#pbBg', {
  y: 130, ease: 'none',
  scrollTrigger: { trigger: '.pb-band', start: 'top bottom', end: 'bottom top', scrub: 1.2 }
});

gsap.from('.pb-title', {
  y: 40, opacity: 0, duration: 1.1, ease,
  scrollTrigger: { trigger: '.pb-band', start: 'top 80%', once: true }
});
gsap.from('.pb-content .btn-gold', {
  y: 24, opacity: 0, duration: 0.85, delay: 0.2, ease: easeSlide,
  scrollTrigger: { trigger: '.pb-band', start: 'top 80%', once: true }
});

gsap.from('.acc-card', {
  x: -50, opacity: 0, duration: 1.0, stagger: 0.16, ease,
  scrollTrigger: { trigger: '.acc-cards', start: 'top 85%', once: true }
});
gsap.from('.acc-img', {
  clipPath: 'inset(0 100% 0 0)', duration: 1.35, ease,
  scrollTrigger: { trigger: '.acc-visual', start: 'top 82%', once: true }
});
gsap.from('.acc-quote', {
  y: 24, opacity: 0, duration: 0.85, delay: 0.4, ease: easeSlide,
  scrollTrigger: { trigger: '.acc-visual', start: 'top 82%', once: true }
});

gsap.from('.inv-left', {
  x: -48, opacity: 0, duration: 1.1, ease,
  scrollTrigger: { trigger: '#investisseur', start: 'top 82%', once: true }
});
gsap.from('.inv-box', {
  x: 48, opacity: 0, duration: 1.1, ease,
  scrollTrigger: { trigger: '#investisseur', start: 'top 82%', once: true }
});
gsap.from('.inv-perk', {
  x: -20, opacity: 0, duration: 0.65, stagger: 0.09, ease: easeSlide,
  scrollTrigger: { trigger: '.inv-perks', start: 'top 88%', once: true }
});

gsap.from('.contact-left', {
  x: -50, opacity: 0, duration: 1.1, ease,
  scrollTrigger: { trigger: '#contact', start: 'top 82%', once: true }
});
gsap.from('.contact-form', {
  x: 50, opacity: 0, duration: 1.1, ease,
  scrollTrigger: { trigger: '#contact', start: 'top 82%', once: true }
});
gsap.from('.c-row', {
  y: 18, opacity: 0, duration: 0.65, stagger: 0.12, ease: easeSlide,
  scrollTrigger: { trigger: '.c-info', start: 'top 88%', once: true }
});

gsap.from('footer .footer-top > *', {
  y: 28, opacity: 0, duration: 0.9, stagger: 0.18, ease: easeSlide,
  scrollTrigger: { trigger: 'footer', start: 'top 90%', once: true }
});

['.ap-img-main', '.ap-img-sec', '.acc-img'].forEach(sel => {
  const el = document.querySelector(sel);
  if (!el) return;
  gsap.to(el, {
    backgroundPositionY: '+=55px', ease: 'none',
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.4 }
  });
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
}

function closeMenu() {
  hamBtn.classList.remove('open');
  mobNav.classList.remove('open');
  mobOverlay.classList.remove('open');
  hamBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamBtn.addEventListener('click', () => {
  hamBtn.classList.contains('open') ? closeMenu() : openMenu();
});
mobOverlay.addEventListener('click', closeMenu);

document.querySelectorAll('.mob-nav-links a, .mob-nav-cta').forEach(a => {
  a.addEventListener('click', closeMenu);
});

/* ══════════════════════════════════════
   SMOOTH ANCHORS
══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ══════════════════════════════════════
   TOUCH DEVICE: disable custom cursor
══════════════════════════════════════ */
if (window.matchMedia('(hover: none)').matches) {
  document.body.style.cursor = 'auto';
  document.getElementById('cur').style.display  = 'none';
  document.getElementById('curR').style.display = 'none';
}

/* ══════════════════════════════════════
   PROJECT MODAL
══════════════════════════════════════ */
const PROJECTS = {
  azurea: {
    image:       'alger.jpg',
    subtitle:    'Alger — Résidences de Luxe',
    title:       'Résidence Azurea',
    description: "Résidence Azurea offre une expérience de vie exceptionnelle avec des vues panoramiques sur la baie d'Alger. Chaque appartement est conçu avec des matériaux de haute qualité et des finitions luxueuses. Accès direct à la plage privée et équipements 5 étoiles.",
    details: [
      { label: 'Localisation',       value: 'Alger' },
      { label: "Nombre d'unités",    value: '120' },
      { label: 'Prix à partir de',   value: '45 000 000 DA' },
      { label: 'Développeur',        value: 'TRODI Construction TC' }
    ],
    features: [
      'Vue mer panoramique',      'Plage privée accès direct',
      'Piscine chauffée & SPA',   'Concierge 24/7',
      'Parking privé souterrain', 'Salle de sport premium',
      'Restaurant gastronomique', 'Sécurité biométrique'
    ],
    timeline: [
      { label: 'Démarrage',        value: 'Janvier 2024' },
      { label: 'Achèvement prévu', value: 'Juin 2026' }
    ]
  },
  skyview: {
    image:       'djelfa.jpg',
    subtitle:    'Djelfa — Appartements Premium',
    title:       'Skyview Garden',
    description: "Skyview Garden redéfinit le confort urbain au cœur de Djelfa. Des appartements spacieux entourés de jardins suspendus et d'espaces verts luxuriants, offrant une parenthèse de sérénité avec une piscine panoramique au sommet de l'immeuble.",
    details: [
      { label: 'Localisation',       value: 'Djelfa' },
      { label: "Nombre d'unités",    value: '84' },
      { label: 'Prix à partir de',   value: '28 000 000 DA' },
      { label: 'Développeur',        value: 'TRODI Construction TC' }
    ],
    features: [
      'Piscine panoramique rooftop', 'Jardins suspendus',
      'Aire de jeux enfants',        'Salle communautaire',
      'Parking couvert',             'Vidéosurveillance 24/7',
      'Espaces verts aménagés',      'Ascenseurs hautes vitesse'
    ],
    timeline: [
      { label: 'Démarrage',        value: 'Mars 2024' },
      { label: 'Achèvement prévu', value: 'Décembre 2026' }
    ]
  },
  palmriviera: {
    image:       'satif.jpg',
    subtitle:    'Sétif — Villas Résidentielles',
    title:       'Palm Riviera',
    description: "Palm Riviera propose une collection exclusive de mini-villas à Sétif, alliant architecture contemporaine et art de vivre méditerranéen. Chaque villa dispose de son propre jardin privatif, d'un espace barbecue et d'un accès exclusif aux équipements du domaine.",
    details: [
      { label: 'Localisation',     value: 'Sétif' },
      { label: 'Nombre de villas', value: '48' },
      { label: 'Prix à partir de', value: '62 000 000 DA' },
      { label: 'Développeur',      value: 'TRODI Construction TC' }
    ],
    features: [
      'Jardin privatif',       'Espace barbecue individuel',
      'Club house exclusif',   'Piscine commune',
      'Double parking privé',  'Domaine sécurisé 24/7',
      'Allées arborées',       'Architecture bioclimatique'
    ],
    timeline: [
      { label: 'Démarrage',        value: 'Juin 2024' },
      { label: 'Achèvement prévu', value: 'Mars 2027' }
    ]
  }
};

const modal     = document.getElementById('proj-modal');
const modalCard = modal.querySelector('.pmo-card');
let prevFocus   = null;

const FOCUSABLE = 'a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])';

function trapFocus(e) {
  const els   = [...modalCard.querySelectorAll(FOCUSABLE)];
  if (!els.length) return;
  const first = els[0], last = els[els.length - 1];
  if (e.key === 'Tab') {
    if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
    else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
  }
  if (e.key === 'Escape') closeModal();
}

function openModal(key) {
  const p = PROJECTS[key];
  if (!p) return;
  prevFocus = document.activeElement;

  modal.querySelector('.pmo-hero-img').src         = p.image;
  modal.querySelector('.pmo-hero-img').alt         = p.title;
  modal.querySelector('.pmo-hero-loc').textContent  = p.subtitle;
  modal.querySelector('.pmo-hero-title').textContent = p.title;
  modal.querySelector('.pmo-desc').textContent      = p.description;

  modal.querySelector('.pmo-details').innerHTML = p.details.map(d =>
    `<div class="pmo-detail">
      <div class="pmo-detail-label">${d.label}</div>
      <div class="pmo-detail-value">${d.value}</div>
    </div>`
  ).join('');

  modal.querySelector('.pmo-feat-list').innerHTML = p.features.map(f =>
    `<li>${f}</li>`
  ).join('');

  modal.querySelector('.pmo-timeline').innerHTML = p.timeline.map(t =>
    `<div class="pmo-tl-item">
      <div class="pmo-tl-label">${t.label}</div>
      <div class="pmo-tl-value">${t.value}</div>
    </div>`
  ).join('');

  document.body.style.overflow = 'hidden';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.addEventListener('keydown', trapFocus);
  setTimeout(() => modal.querySelector('.pmo-close').focus(), 50);
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', trapFocus);
  if (prevFocus) prevFocus.focus();
}

document.querySelectorAll('[data-project]').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.dataset.project));
});

modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
modal.querySelector('.pmo-close').addEventListener('click', closeModal);
modal.querySelector('.pmo-btn-close').addEventListener('click', closeModal);
modal.querySelector('.pmo-btn-brochure').addEventListener('click', () => {
  const title   = modal.querySelector('.pmo-hero-title').textContent;
  const subject = encodeURIComponent(`Demande de brochure — ${title}`);
  window.location.href = `mailto:trodisalsabil202@gmail.com?subject=${subject}`;
});