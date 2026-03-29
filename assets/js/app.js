const revealables = document.querySelectorAll('.revealable');
const sectionDots = document.querySelectorAll('.section-dot');
const sections    = document.querySelectorAll('.wall-section');
const activeLabel = document.getElementById('activeSectionLabel');
const executiveWall = document.querySelector('.executive-wall');

// ── Reveal on scroll ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealables.forEach((el) => revealObserver.observe(el));

// ── Section tracker ──
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    if (activeLabel) activeLabel.textContent = entry.target.dataset.title || 'Corridor';
    sectionDots.forEach((dot) => dot.classList.toggle('active', dot.dataset.nav === id));
    sections.forEach((s) => s.classList.toggle('is-current', s.id === id));
  });
}, { threshold: 0.5 });

sections.forEach((s) => sectionObserver.observe(s));

// ── Timeline widgets ──
document.querySelectorAll('.timeline-widget').forEach((widget) => {
  const buttons = widget.querySelectorAll('.timeline-button');
  const panels  = widget.querySelectorAll('.timeline-panel');

  const activate = (btn) => {
    const target = btn.dataset.panel;
    buttons.forEach((b) => {
      const on = b === btn;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', String(on));
    });
    panels.forEach((p) => p.classList.toggle('active', p.id === target));
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click',      () => activate(btn));
    btn.addEventListener('mouseenter', () => activate(btn));
    btn.addEventListener('focus',      () => activate(btn));
  });
});

// ── Brand panel ──
const brandPanelToggle = document.getElementById('brandPanelToggle');
const brandPanelBody   = document.getElementById('brandPanelBody');

if (brandPanelToggle && brandPanelBody) {
  brandPanelToggle.addEventListener('click', () => {
    const isOpen = !brandPanelBody.hidden;
    brandPanelBody.hidden = isOpen;
    brandPanelToggle.setAttribute('aria-expanded', String(!isOpen));
  });

  // Palette switching
  document.querySelectorAll('.swatch').forEach((swatch) => {
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.swatch').forEach((s) => s.classList.remove('active'));
      swatch.classList.add('active');
      document.documentElement.setAttribute('data-theme', swatch.dataset.theme);
    });
  });

  // Font weight switching
  document.querySelectorAll('.font-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.font-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      document.documentElement.setAttribute('data-font-weight', btn.dataset.weight);
    });
  });
}

// ── Executive wall shine ──
if (executiveWall) {
  executiveWall.addEventListener('pointermove', (e) => {
    const r = executiveWall.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    executiveWall.style.setProperty('--shine-x', `${x - 18}%`);
  });
  executiveWall.addEventListener('pointerleave', () => {
    executiveWall.style.setProperty('--shine-x', '-8%');
  });
}
