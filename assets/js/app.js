// ── PDF links per wall — paste Google Drive / hosted PDF URLs here ──
const wallPdfUrls = {
  wall01: '',
  wall02: '',
  wall03: 'assets/pdfs/wall-3.pdf',
  wall04: 'assets/pdfs/wall-4.pdf',
  wall05: 'assets/pdfs/wall-5.pdf',
  wall06: '',
};

// Wire PDF buttons to their URLs
document.querySelectorAll('.approval-pdf-btn').forEach((btn) => {
  const wallId = btn.closest('.wall-section')?.id;
  const url = wallPdfUrls[wallId];
  if (url) {
    btn.href = url;
    btn.textContent = 'View Design PDF →';
  } else {
    btn.href = '#';
    btn.textContent = 'Design PDF — link pending';
    btn.style.opacity = '0.5';
    btn.addEventListener('click', (e) => e.preventDefault());
  }
});

// ── Approval panels ──
document.querySelectorAll('.approve-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const panel = btn.closest('.approval-panel');
    const wallNum = btn.dataset.wall;
    const wallName = btn.dataset.wallName;
    const comment = panel.querySelector('.approval-comment').value.trim();

    // Update badge in the wall header
    const section = document.getElementById('wall' + wallNum);
    if (section) {
      const badge = section.querySelector('.approval-badge');
      if (badge) {
        badge.textContent = 'Approved';
        badge.className = 'approval-badge status-approved';
      }
    }

    // Disable button, show confirmation
    btn.disabled = true;
    btn.textContent = 'Approved';
    const confirmed = panel.querySelector('.approved-confirmed');
    if (confirmed) confirmed.hidden = false;

    // Send approval via email
    const subject = encodeURIComponent(`NISO Corridor — Wall ${wallNum} Approved`);
    const body = encodeURIComponent(
      `Wall ${wallNum}: ${wallName}\n\nStatus: APPROVED\n\nComments:\n${comment || 'No additional comments.'}`
    );
    window.open(`mailto:ibrahimmustapha1103@gmail.com?subject=${subject}&body=${body}`);
  });
});

// ── How to use — fade out after scroll ──
const howToUse = document.querySelector('.how-to-use');
if (howToUse) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      howToUse.classList.add('how-to-hidden');
    }
  }, { passive: true });
}

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
