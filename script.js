/* ── Nav: scroll shadow + active link highlight ──────────────── */
const nav = document.getElementById('nav');
const navLinks = document.getElementById('navLinks');
const burger = document.getElementById('burger');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  highlightNav();
}, { passive: true });

burger.addEventListener('click', () => {
  const open = burger.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
  });
});

function highlightNav() {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

/* ── Scroll-to-top button ────────────────────────────────────── */
const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.setAttribute('aria-label', 'Back to top');
scrollTopBtn.innerHTML = '&#8679;';
document.body.appendChild(scrollTopBtn);
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── Skill cards: intersection observer fade-in ──────────────── */
const skillCards = document.querySelectorAll('.skill-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card = entry.target;
      const idx = parseInt(card.dataset.index || '0', 10);
      card.style.transitionDelay = `${idx * 80}ms`;
      card.classList.add('visible');
      observer.unobserve(card);
    }
  });
}, { threshold: 0.15 });

skillCards.forEach(card => observer.observe(card));

/* ── Stack table rows: stagger fade-in ───────────────────────── */
const tableRows = document.querySelectorAll('.stack__table tbody tr');
const tableObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = `cardIn .4s ease ${entry.target.dataset.i * 50}ms both`;
      tableObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

tableRows.forEach((row, i) => {
  row.dataset.i = i;
  row.style.opacity = '0';
  tableObserver.observe(row);
});

/* ── Contact form ────────────────────────────────────────────── */
const form = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  feedback.className = 'form__feedback';
  feedback.textContent = '';

  const nameEl    = document.getElementById('name');
  const emailEl   = document.getElementById('email');
  const messageEl = document.getElementById('message');
  let valid = true;

  [nameEl, emailEl, messageEl].forEach(el => el.classList.remove('error'));

  if (!nameEl.value.trim()) {
    nameEl.classList.add('error'); valid = false;
  }
  if (!emailEl.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
    emailEl.classList.add('error'); valid = false;
  }
  if (!messageEl.value.trim()) {
    messageEl.classList.add('error'); valid = false;
  }

  if (!valid) {
    feedback.textContent = 'Please fill in all fields correctly.';
    feedback.classList.add('error');
    return;
  }

  // Simulate async submission
  const btn = form.querySelector('button[type=submit]');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = 'Send Message';
    form.reset();
    feedback.textContent = 'Message sent successfully. We will be in touch shortly.';
    feedback.classList.add('success');
    setTimeout(() => { feedback.textContent = ''; feedback.className = 'form__feedback'; }, 5000);
  }, 1200);
});

/* ── Smooth active-link underline injection ──────────────────── */
const style = document.createElement('style');
style.textContent = `.nav__links a.active { color: var(--text); } .nav__links a.active::after { transform: scaleX(1); }`;
document.head.appendChild(style);
