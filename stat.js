gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════
   CINEMATIC INTRO  (≈3 s total)
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
  .to('.ci-curtain-b', { yPercent:  100, duration: 0.85, ease: 'power4.inOut' }, 1.88);

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

document.querySelectorAll('a,button,.proj-card,.srv-card,.why-card,.test-card,.faq-item summary,.market-stat,.ls-slide')
  .forEach(el => {
    el.addEventListener('mouseenter', () => { cur.classList.add('big'); curR.classList.add('big'); });
    el.addEventListener('mouseleave', () => { cur.classList.remove('big'); curR.classList.remove('big'); });
  });

/* ══════════════════════════════════════
   NAVBAR + SCROLL BAR
══════════════════════════════════════ */
const navbar   = document.getElementById('nav');
const scrollBar = document.getElementById('scroll-bar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', scrollY > 60);
  const pct = scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  scrollBar.style.width = pct + '%';
});

/* ══════════════════════════════════════
   COUNTER (market stats)
══════════════════════════════════════ */
function countUp(el, target, suffix) {
  let c = 0;
  const step = Math.max(target / 70, 0.05);
  const t = setInterval(() => {
    c += step;
    if (c >= target) { c = target; clearInterval(t); }
    el.textContent = (target % 1 === 0 ? Math.floor(c) : c.toFixed(1)) + (suffix || '');
  }, 22);
}

document.querySelectorAll('[data-count]').forEach(el => {
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        countUp(el, +el.dataset.count, el.dataset.suffix || '');
        observerCleanup(e.target);
      }
    });
  }, { threshold: .5 }).observe(el);
});
function observerCleanup() {/* placeholder for tree-shake */}

/* market bars animate */
ScrollTrigger.create({
  trigger: '.market-cities',
  start: 'top 80%',
  once: true,
  onEnter() {
    document.querySelectorAll('.city-bar span').forEach((bar, i) => {
      const target = bar.style.getPropertyValue('--w') || '50%';
      setTimeout(() => { bar.style.width = target; }, i * 120);
    });
  }
});

/* ══════════════════════════════════════
   GSAP SCROLL ANIMATIONS
══════════════════════════════════════ */
const ease      = 'power4.out';
const easeSlide = 'power3.out';

function st(trigger, start = 'top 88%') {
  return { trigger, start, once: true };
}

gsap.utils.toArray('.s-eyebrow').forEach(el => {
  gsap.from(el, { x: -22, opacity: 0, duration: 0.7, ease: easeSlide, scrollTrigger: st(el) });
});

gsap.utils.toArray('.s-title').forEach(el => {
  gsap.from(el, { y: 28, opacity: 0, duration: 1.05, ease, scrollTrigger: st(el, 'top 90%') });
});

gsap.utils.toArray('.sec-lead').forEach(el => {
  gsap.from(el, { y: 22, opacity: 0, duration: 0.85, ease: easeSlide, scrollTrigger: st(el) });
});

gsap.from('.hero-eyebrow', { y: 22, opacity: 0, duration: 0.7, delay: 2.3, ease: easeSlide });
gsap.from('.hero-h1',      { y: 36, opacity: 0, duration: 1.1, delay: 2.4, ease });
gsap.from('.hero-sub',     { y: 22, opacity: 0, duration: 0.9, delay: 2.55, ease: easeSlide });
gsap.from('.hero-btns > *',{ y: 18, opacity: 0, duration: 0.75, stagger: 0.1, delay: 2.7, ease: easeSlide });
gsap.from('.trust-item',   { y: 20, opacity: 0, duration: 0.7, stagger: 0.1, delay: 2.9, ease: easeSlide });

gsap.from('.ap-lead, .ap-sign', {
  y: 24, opacity: 0, duration: 0.9, stagger: 0.15, ease: easeSlide,
  scrollTrigger: st('.apropos-strip')
});

gsap.from('.why-card', {
  y: 38, opacity: 0, duration: 0.9, stagger: 0.1, ease,
  scrollTrigger: st('.why-grid', 'top 85%')
});

gsap.from('.market-stat', {
  y: 30, opacity: 0, duration: 0.85, stagger: 0.12, ease: easeSlide,
  scrollTrigger: st('.market-side')
});

gsap.from('.city-row', {
  y: 18, opacity: 0, duration: 0.7, stagger: 0.08, ease: easeSlide,
  scrollTrigger: st('.market-cities')
});

gsap.from('.proj-card', {
  y: 60, opacity: 0, duration: 1.0, stagger: 0.14, ease,
  scrollTrigger: st('.proj-grid', 'top 86%')
});

gsap.from('.srv-card', {
  y: 40, opacity: 0, duration: 0.85, stagger: 0.08, ease,
  scrollTrigger: st('.srv-grid', 'top 86%')
});

gsap.from('.founder-visual', {
  clipPath: 'inset(0 100% 0 0)', duration: 1.3, ease,
  scrollTrigger: st('.founder-card', 'top 82%')
});

gsap.from('.founder-quote, .founder-sign', {
  y: 24, opacity: 0, duration: 0.9, stagger: 0.15, delay: 0.25, ease: easeSlide,
  scrollTrigger: st('.founder-card', 'top 82%')
});

gsap.from('.test-card', {
  y: 36, opacity: 0, duration: 0.9, stagger: 0.12, ease,
  scrollTrigger: st('.test-grid')
});

gsap.from('.faq-item', {
  y: 20, opacity: 0, duration: 0.7, stagger: 0.08, ease: easeSlide,
  scrollTrigger: st('.faq-list')
});

gsap.from('.inv-left, .inv-box', {
  y: 30, opacity: 0, duration: 1.0, stagger: 0.15, ease,
  scrollTrigger: st('#investisseur', 'top 82%')
});

gsap.from('.inv-perks li', {
  x: -16, opacity: 0, duration: 0.6, stagger: 0.07, ease: easeSlide,
  scrollTrigger: st('.inv-perks', 'top 88%')
});

gsap.from('.contact-left, .contact-form', {
  y: 30, opacity: 0, duration: 1.0, stagger: 0.15, ease,
  scrollTrigger: st('#contact', 'top 82%')
});

gsap.from('footer .footer-top > *', {
  y: 24, opacity: 0, duration: 0.85, stagger: 0.12, ease: easeSlide,
  scrollTrigger: st('footer', 'top 90%')
});

/* ══════════════════════════════════════
   LIFESTYLE CAROUSEL
══════════════════════════════════════ */
const lsTrack = document.getElementById('lsTrack');
const lsIdx   = document.getElementById('lsIdx');
const lsTot   = document.getElementById('lsTot');
const lsPrev  = document.getElementById('lsPrev');
const lsNext  = document.getElementById('lsNext');

if (lsTrack) {
  const slides = [...lsTrack.querySelectorAll('.ls-slide')];
  lsTot.textContent = String(slides.length).padStart(2, '0');

  function updateLsIndex() {
    const center = lsTrack.scrollLeft + lsTrack.clientWidth / 2;
    let nearest = 0, best = Infinity;
    slides.forEach((s, i) => {
      const c = s.offsetLeft + s.clientWidth / 2;
      const d = Math.abs(c - center);
      if (d < best) { best = d; nearest = i; }
    });
    lsIdx.textContent = String(nearest + 1).padStart(2, '0');
  }

  function scrollBy(dir) {
    const w = slides[0].clientWidth + 20;
    lsTrack.scrollBy({ left: dir * w, behavior: 'smooth' });
  }

  lsPrev.addEventListener('click', () => scrollBy(-1));
  lsNext.addEventListener('click', () => scrollBy(1));
  lsTrack.addEventListener('scroll', updateLsIndex, { passive: true });
  updateLsIndex();
}

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
document.querySelectorAll('a[href^="#"]:not([data-appt])').forEach(a => {
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
   LANGUAGE PILL (visual only)
══════════════════════════════════════ */
document.querySelectorAll('.nav-lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ══════════════════════════════════════
   PROJECT MODAL
══════════════════════════════════════ */
const TRODI_BASE = 'Trodi%20real%20estate/';
const AZUREA = TRODI_BASE + 're%CC%81sidance%20azurea/';
const DJELFA = TRODI_BASE + 're%CC%81sidance%20djelfa/';

const PROJECTS = {
  azurea: {
    image:       AZUREA + 'ChatGPT%20Image%2012%20mai%202026%20a%CC%80%2014_06_03.png',
    subtitle:    'Alger — Résidences de luxe',
    title:       'Résidence Azurea',
    description: "Résidence Azurea offre une expérience de vie exceptionnelle avec des vues panoramiques sur la baie d'Alger. Chaque appartement est conçu avec des matériaux de haute qualité et des finitions luxueuses. Accès direct à la plage privée et équipements 5 étoiles.",
    details: [
      { label: 'Localisation',     value: 'Alger' },
      { label: "Nombre d'unités",  value: '120' },
      { label: 'Prix à partir de', value: '45 000 000 DA' },
      { label: 'Développeur',      value: 'TRODI Construction TC' }
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
    image:       DJELFA + '001.jpg',
    subtitle:    'Djelfa — Appartements premium',
    title:       'Skyview Garden',
    description: "Skyview Garden redéfinit le confort urbain au cœur de Djelfa. Des appartements spacieux entourés de jardins suspendus et d'espaces verts luxuriants, offrant une parenthèse de sérénité avec une piscine panoramique au sommet de l'immeuble.",
    details: [
      { label: 'Localisation',     value: 'Djelfa' },
      { label: "Nombre d'unités",  value: '84' },
      { label: 'Prix à partir de', value: '28 000 000 DA' },
      { label: 'Développeur',      value: 'TRODI Construction TC' }
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
    image:       TRODI_BASE + 'ChatGPT%20Image%2014%20fe%CC%81vr.%202026%20a%CC%80%2016_20_07.png',
    subtitle:    'Sétif — Villas résidentielles',
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
  if (e.key === 'Escape') closeProjModal();
}

function openProjModal(key) {
  const p = PROJECTS[key];
  if (!p) return;
  prevFocus = document.activeElement;

  modal.querySelector('.pmo-hero-img').src           = p.image;
  modal.querySelector('.pmo-hero-img').alt           = p.title;
  modal.querySelector('.pmo-hero-loc').textContent   = p.subtitle;
  modal.querySelector('.pmo-hero-title').textContent = p.title;
  modal.querySelector('.pmo-desc').textContent       = p.description;

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

function closeProjModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', trapFocus);
  if (prevFocus) prevFocus.focus();
}

document.querySelectorAll('[data-project]').forEach(el => {
  el.addEventListener('click', e => {
    e.stopPropagation();
    openProjModal(el.dataset.project);
  });
});

modal.addEventListener('click', e => { if (e.target === modal) closeProjModal(); });
modal.querySelector('.pmo-close').addEventListener('click', closeProjModal);
modal.querySelector('.pmo-btn-close').addEventListener('click', closeProjModal);
modal.querySelector('.pmo-btn-brochure').addEventListener('click', () => {
  const title   = modal.querySelector('.pmo-hero-title').textContent;
  const subject = encodeURIComponent(`Demande de brochure — ${title}`);
  window.location.href = `mailto:trodisalsabil202@gmail.com?subject=${subject}`;
});

/* ══════════════════════════════════════
   APPOINTMENT MODAL
══════════════════════════════════════ */
const apptModal = document.getElementById('appt-modal');

function openApptModal() {
  document.body.style.overflow = 'hidden';
  apptModal.classList.add('open');
  apptModal.setAttribute('aria-hidden', 'false');
}

function closeApptModal() {
  apptModal.classList.remove('open');
  apptModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-appt]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    openApptModal();
  });
});

apptModal.addEventListener('click', e => { if (e.target === apptModal) closeApptModal(); });
apptModal.querySelector('.amo-close').addEventListener('click', closeApptModal);
apptModal.querySelector('.cf-submit').addEventListener('click', e => {
  e.preventDefault();
  alert('Merci ! Votre demande de rendez-vous a été enregistrée. Notre équipe vous recontacte sous 24h.');
  closeApptModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && apptModal.classList.contains('open')) closeApptModal();
});
