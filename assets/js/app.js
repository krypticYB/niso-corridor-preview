const revealables = document.querySelectorAll('.revealable');
const sectionDots = document.querySelectorAll('.section-dot');
const sections = document.querySelectorAll('.wall-section');
const activeSectionLabel = document.getElementById('activeSectionLabel');
const diagramCard = document.querySelector('.diagram-card');
const diagramInfo = document.getElementById('diagramInfo');
const executiveWall = document.querySelector('.executive-wall');

const diagramContent = {
  genco: {
    title: 'Generation companies',
    text: 'Power enters the value chain at the generation level. This node anchors the experience in physical electricity production before it travels across the grid.',
    bullets: [
      'Schedules supply into the network',
      'Feeds dispatch and balancing decisions',
      'Operates inside market and system rules'
    ]
  },
  tcn: {
    title: 'TCN / Transmission Service Provider',
    text: 'Transmission infrastructure carries power across long distances. In the restructured model, physical assets and system operation are treated more distinctly.',
    bullets: [
      'Owns and manages the physical backbone',
      'Moves bulk electricity across the network',
      'Interfaces with system operators for stable delivery'
    ]
  },
  disco: {
    title: 'Distribution companies',
    text: 'Distribution companies connect the national system to homes, businesses, and public institutions, translating bulk supply into customer experience.',
    bullets: [
      'Receives allocated energy from the grid',
      'Handles last-mile delivery to users',
      'Shapes the public face of electricity access'
    ]
  },
  niso: {
    title: 'NISO',
    text: 'NISO sits at the coordination layer of the modern system, focused on reliability, transparent operations, disciplined market processes, and efficient dispatch alignment.',
    bullets: [
      'Coordinates system operations',
      'Supports orderly market administration',
      'Strengthens confidence, visibility, and grid discipline'
    ]
  },
  market: {
    title: 'Market framework',
    text: 'A modern electricity sector depends on settlement integrity, operating rules, transparency, and enforceable discipline across participants.',
    bullets: [
      'Supports structured transactions and settlement',
      'Creates accountability across the value chain',
      'Links reliability with financial and operational order'
    ]
  }
};

// Settle the intro section immediately on load
const introSection = document.getElementById('intro');
if (introSection) {
  setTimeout(() => introSection.classList.add('is-settled'), 100);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealables.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const currentId = entry.target.id;
    activeSectionLabel.textContent = entry.target.dataset.title || 'Corridor';

    sectionDots.forEach((dot) => {
      dot.classList.toggle('active', dot.dataset.nav === currentId);
    });

    sections.forEach((section) => {
      const isCurrent = section.id === currentId;
      section.classList.toggle('is-current', isCurrent);
      if (!isCurrent) section.classList.remove('is-settled');
    });

    const currentSection = document.getElementById(currentId);
    if (currentSection) {
      setTimeout(() => {
        currentSection.classList.add('is-settled');
      }, 200);
    }
  });
}, { threshold: 0.55 });

sections.forEach((section) => sectionObserver.observe(section));

document.querySelectorAll('.timeline-widget').forEach((timeline) => {
  const buttons = timeline.querySelectorAll('.timeline-button');
  const panels = timeline.querySelectorAll('.timeline-panel');

  buttons.forEach((button) => {
    const activate = () => {
      const target = button.dataset.panel;

      buttons.forEach((btn) => {
        const isActive = btn === button;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
      });

      panels.forEach((panel) => {
        panel.classList.toggle('active', panel.id === target);
      });
    };

    button.addEventListener('click', activate);
    button.addEventListener('mouseenter', activate);
    button.addEventListener('focus', activate);
  });
});

if (diagramCard && diagramInfo) {
  const nodes = diagramCard.querySelectorAll('.diagram-node');

  const updateDiagram = (key) => {
    const content = diagramContent[key];
    if (!content) return;

    diagramCard.dataset.active = key;

    nodes.forEach((node) => {
      node.classList.toggle('active', node.dataset.node === key);
    });

    diagramInfo.innerHTML = `
      <span class="panel-kicker">Interactive system view</span>
      <h3>${content.title}</h3>
      <p>${content.text}</p>
      <ul>
        ${content.bullets.map((item) => `<li>${item}</li>`).join('')}
      </ul>
    `;
  };

  nodes.forEach((node) => {
    const trigger = () => updateDiagram(node.dataset.node);
    node.addEventListener('click', trigger);
    node.addEventListener('mouseenter', trigger);
    node.addEventListener('focus', trigger);
    node.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        trigger();
      }
    });
  });

  updateDiagram('genco');
}

// ── Comparison slider ─────────────────────────────────
const corridorCompare = document.getElementById('corridorCompare');
const compareOverlay  = document.getElementById('compareOverlay');
const compareDivider  = document.getElementById('compareDivider');

if (corridorCompare && compareOverlay && compareDivider) {
  let dragging = false;

  const setPos = (clientX) => {
    const rect = corridorCompare.getBoundingClientRect();
    const pct = Math.max(2, Math.min(98, ((clientX - rect.left) / rect.width) * 100));
    compareOverlay.style.setProperty('--clip', `${pct}%`);
    compareDivider.style.left = `${pct}%`;
  };

  corridorCompare.addEventListener('pointerdown', (e) => {
    dragging = true;
    corridorCompare.setPointerCapture(e.pointerId);
    setPos(e.clientX);
  });

  corridorCompare.addEventListener('pointermove', (e) => {
    if (dragging) setPos(e.clientX);
  });

  corridorCompare.addEventListener('pointerup',     () => { dragging = false; });
  corridorCompare.addEventListener('pointercancel', () => { dragging = false; });
}

if (executiveWall) {
  executiveWall.addEventListener('pointermove', (event) => {
    const rect = executiveWall.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    executiveWall.style.setProperty('--shine-x', `${x - 18}%`);
  });

  executiveWall.addEventListener('pointerleave', () => {
    executiveWall.style.setProperty('--shine-x', '-8%');
  });
}
