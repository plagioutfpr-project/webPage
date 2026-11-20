(function landingModule() {
  'use strict';

  const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  const VIEWBOX_HEIGHT = 6600;
  const GROUND_Y = 5850;
  const TRUNK_TOP_Y = 70;

  function createSvgElement(documentRef, name, attributes = {}, parent = null) {
    const element = documentRef.createElementNS(SVG_NAMESPACE, name);

    Object.entries(attributes).forEach(([attribute, value]) => {
      element.setAttribute(attribute, String(value));
    });

    if (parent) parent.appendChild(element);
    return element;
  }

  function treeCenterX(y) {
    return 500 + 7 * Math.sin(y / 420) + 4 * Math.sin(y / 130);
  }

  function trunkHalfWidth(y) {
    return 7 + Math.pow((y - TRUNK_TOP_Y) / (GROUND_Y - TRUNK_TOP_Y), 1.15) * 57;
  }

  function trunkWidthWithFlare(y) {
    const flareStart = GROUND_Y - 560;
    const baseWidth = trunkHalfWidth(Math.min(y, GROUND_Y));

    if (y <= flareStart) return baseWidth;

    const progress = (y - flareStart) / (GROUND_Y - flareStart);
    return baseWidth + Math.pow(progress, 2.6) * 200;
  }

  function buildTrunk(documentRef) {
    const trunk = documentRef.getElementById('landing-trunk-shape');
    const trunkClip = documentRef.getElementById('landing-trunk-clip-shape');
    const bark = documentRef.getElementById('landing-bark-texture');

    if (!trunk || !trunkClip || !bark) return;

    const leftPoints = [];
    const rightPoints = [];
    const step = 90;

    for (let y = TRUNK_TOP_Y; y <= GROUND_Y; y += step) {
      const center = treeCenterX(y);
      const halfWidth = trunkWidthWithFlare(y);
      leftPoints.push(`${(center - halfWidth).toFixed(1)},${y}`);
      rightPoints.push(`${(center + halfWidth).toFixed(1)},${y}`);
    }

    const groundCenter = treeCenterX(GROUND_Y);
    const groundHalfWidth = trunkWidthWithFlare(GROUND_Y);
    leftPoints.push(`${(groundCenter - groundHalfWidth).toFixed(1)},${GROUND_Y}`);
    rightPoints.push(`${(groundCenter + groundHalfWidth).toFixed(1)},${GROUND_Y}`);

    const tip = `${treeCenterX(TRUNK_TOP_Y).toFixed(1)},${TRUNK_TOP_Y - 40}`;
    const polygonPoints = `${tip} ${leftPoints.join(' ')} ${rightPoints.reverse().join(' ')}`;
    trunk.setAttribute('points', polygonPoints);
    trunkClip.setAttribute('points', polygonPoints);

    const barkFractions = [-0.72, -0.45, -0.18, 0.08, 0.34, 0.6, 0.82];
    const barkEnd = GROUND_Y - 440;

    barkFractions.forEach((fraction, index) => {
      const segments = [];

      for (let y = TRUNK_TOP_Y + 60; y <= barkEnd; y += step) {
        const x = treeCenterX(y) + fraction * trunkHalfWidth(y) * 0.9;
        segments.push(`${segments.length ? 'L' : 'M'} ${x.toFixed(1)} ${y}`);
      }

      createSvgElement(documentRef, 'path', {
        d: segments.join(' '),
        class: `landing-tree__bark-line ${
          index % 2
            ? 'landing-tree__bark-line--light'
            : 'landing-tree__bark-line--dark'
        }`,
        'stroke-dasharray': `${14 + (index * 7) % 22} ${26 + (index * 11) % 30}`,
        'stroke-dashoffset': (index * 37) % 60
      }, bark);
    });
  }

  function buildRoots(documentRef) {
    const rootsGroup = documentRef.getElementById('landing-root-system');
    if (!rootsGroup) return;

    const center = treeCenterX(GROUND_Y);
    const rootY = GROUND_Y + 200;
    const roots = [
      [`M${center - 40} ${rootY} Q${center - 140} ${rootY + 160} ${center - 260} ${rootY + 340} Q${center - 360} ${rootY + 520} ${center - 440} ${rootY + 760}`, 44],
      [`M${center - 20} ${rootY + 40} Q${center - 80} ${rootY + 220} ${center - 140} ${rootY + 460} Q${center - 190} ${rootY + 680} ${center - 260} ${rootY + 960}`, 28],
      [`M${center - 260} ${rootY + 340} Q${center - 340} ${rootY + 420} ${center - 450} ${rootY + 480}`, 14],
      [`M${center - 140} ${rootY + 460} Q${center - 220} ${rootY + 560} ${center - 320} ${rootY + 620}`, 10],
      [`M${center + 40} ${rootY} Q${center + 140} ${rootY + 160} ${center + 260} ${rootY + 340} Q${center + 360} ${rootY + 520} ${center + 440} ${rootY + 760}`, 44],
      [`M${center + 20} ${rootY + 40} Q${center + 80} ${rootY + 220} ${center + 140} ${rootY + 460} Q${center + 190} ${rootY + 680} ${center + 260} ${rootY + 960}`, 28],
      [`M${center + 260} ${rootY + 340} Q${center + 340} ${rootY + 420} ${center + 450} ${rootY + 480}`, 14],
      [`M${center + 140} ${rootY + 460} Q${center + 220} ${rootY + 560} ${center + 320} ${rootY + 620}`, 10],
      [`M${center} ${rootY} Q${center - 8} ${rootY + 280} ${center - 16} ${rootY + 600} Q${center - 22} ${rootY + 900} ${center - 30} ${rootY + 1100}`, 36],
      [`M${center - 16} ${rootY + 600} Q${center - 80} ${rootY + 780} ${center - 190} ${rootY + 980}`, 16],
      [`M${center - 16} ${rootY + 600} Q${center + 60} ${rootY + 780} ${center + 170} ${rootY + 980}`, 16]
    ];

    roots.forEach(([path, width]) => {
      createSvgElement(documentRef, 'path', {
        d: path,
        'stroke-width': width
      }, rootsGroup);
    });
  }

  function buildSoil(documentRef) {
    const soilGroup = documentRef.getElementById('landing-soil-layers');
    if (!soilGroup) return;

    const layers = [
      [-30, '#cdbd9f'],
      [10, '#a89072'],
      [55, '#7d654a'],
      [105, '#5a4530'],
      [165, '#3d2b1a']
    ];

    layers.forEach(([offset, color], index) => {
      const baseY = GROUND_Y + offset;
      const wave = (x) => (
        Math.sin(x / 170 + index * 1.3) * 10
        + Math.sin(x / 60 + index) * 4
      );
      let path = `M-100 ${baseY + wave(0)}`;

      for (let x = 80; x <= 1000; x += 80) {
        path += ` Q${x - 40} ${baseY + wave(x - 40)} ${x} ${baseY + wave(x)}`;
      }

      path += ` L1100 ${baseY + wave(1000)} L1100 ${VIEWBOX_HEIGHT} L-100 ${VIEWBOX_HEIGHT} Z`;
      createSvgElement(documentRef, 'path', { d: path, fill: color }, soilGroup);
    });

    [[180, -22], [300, -26], [520, -30], [700, -24], [820, -28]]
      .forEach(([centerX, offsetY]) => {
        createSvgElement(documentRef, 'ellipse', {
          cx: centerX,
          cy: GROUND_Y + offsetY,
          rx: 34,
          ry: 6,
          fill: '#5a7a4a',
          opacity: 0.3
        }, soilGroup);
      });
  }

  function candelabraPath(span, droop, lift) {
    return [
      'M 0 0',
      `C ${span * 0.35} ${droop * 0.5}, ${span * 0.62} ${droop}, ${span * 0.78} ${droop * 0.92}`,
      `C ${span * 0.92} ${droop * 0.8}, ${span * 0.98} ${-lift * 0.45}, ${span} ${-lift}`
    ].join(' ');
  }

  function candelabraPartial(span, droop, endFraction) {
    return [
      'M 0 0',
      `C ${span * 0.35 * endFraction} ${droop * 0.5 * endFraction},`,
      `${span * 0.62 * endFraction} ${droop * endFraction},`,
      `${span * endFraction} ${droop * 0.95 * endFraction}`
    ].join(' ');
  }

  function buildBranches(documentRef) {
    const branchesGroup = documentRef.getElementById('landing-branches');
    if (!branchesGroup) return;

    const whorls = [
      { id: 'landing-branch-1', y: 480, side: 1 },
      { id: 'landing-branch-2', y: 1380, side: -1 },
      { id: 'landing-branch-3', y: 2280, side: 1 },
      { id: 'landing-branch-4', y: 3180, side: -1 },
      { id: 'landing-branch-5', y: 4080, side: 1 },
      { id: 'landing-branch-6', y: 4980, side: -1 }
    ];

    whorls.forEach((whorl, index) => {
      const startX = treeCenterX(whorl.y);
      const span = 330 + (index % 3) * 25;
      const droop = 46 + (index % 2) * 10;
      const lift = 95 + (index % 3) * 12;
      const sideClass = whorl.side === 1
        ? 'landing-tree__branch-group--right'
        : 'landing-tree__branch-group--left';
      const transform = `translate(${startX} ${whorl.y})${
        whorl.side === -1 ? ' scale(-1 1)' : ''
      }`;

      const branch = createSvgElement(documentRef, 'g', {
        class: `landing-tree__branch-group ${sideClass}`,
        'data-landing-target': whorl.id,
        transform
      }, branchesGroup);

      [
        ['landing-tree__branch-stroke--thick', candelabraPartial(span, droop, 0.38)],
        ['landing-tree__branch-stroke--mid', candelabraPartial(span, droop, 0.68)],
        ['landing-tree__branch-stroke--thin', candelabraPath(span, droop, lift)]
      ].forEach(([className, path]) => {
        createSvgElement(documentRef, 'path', {
          class: `landing-tree__branch-stroke ${className}`,
          d: path,
          pathLength: 1
        }, branch);
      });

      const sway = createSvgElement(documentRef, 'g', {
        class: 'landing-tree__sway',
        'transform-origin': `${span} ${-lift}`
      }, branch);
      const tufts = [
        [span, -lift, -4, 1, 'landing-tree__bloom--one'],
        [span * 0.94, -lift * 0.45, -18, 0.62, 'landing-tree__bloom--two'],
        [span * 1.02, -lift * 0.8, 14, 0.55, 'landing-tree__bloom--three']
      ];

      tufts.forEach(([x, y, rotation, scale, delayClass]) => {
        const anchor = createSvgElement(documentRef, 'g', {
          transform: `translate(${x} ${y})`
        }, sway);
        const bloom = createSvgElement(documentRef, 'g', {
          class: `landing-tree__bloom ${delayClass}`
        }, anchor);
        createSvgElement(documentRef, 'use', {
          href: '#landing-needle-tuft',
          transform: `rotate(${rotation}) scale(${scale})`
        }, bloom);
      });
    });
  }

  function buildTree(documentRef) {
    buildTrunk(documentRef);
    buildRoots(documentRef);
    buildSoil(documentRef);
    buildBranches(documentRef);
  }

  function createMediaQuery(windowRef, query) {
    if (typeof windowRef.matchMedia === 'function') return windowRef.matchMedia(query);

    return {
      matches: false,
      addEventListener() {},
      removeEventListener() {}
    };
  }

  function setupMenu(documentRef, windowRef) {
    const body = documentRef.body;
    const toggle = documentRef.getElementById('landing-nav-toggle');
    const navigation = documentRef.getElementById('landing-navigation');
    const mobileQuery = createMediaQuery(windowRef, '(max-width: 900px)');
    let menuOpen = false;

    if (!body || !toggle || !navigation) {
      return { setOpen() {}, isOpen: () => false };
    }

    const toggleLabel = toggle.querySelector('.landing-sr-only');

    function syncMenu({ restoreFocus = false } = {}) {
      const mobile = mobileQuery.matches;
      toggle.setAttribute('aria-expanded', String(menuOpen));
      navigation.classList.toggle('landing-is-open', menuOpen && mobile);
      navigation.hidden = mobile && !menuOpen;
      body.classList.toggle('landing-menu-open', menuOpen && mobile);

      if (toggleLabel) {
        toggleLabel.textContent = menuOpen ? 'Fechar menu' : 'Abrir menu';
      }

      if (restoreFocus) toggle.focus();
    }

    function setOpen(open, options = {}) {
      menuOpen = Boolean(open) && mobileQuery.matches;
      syncMenu(options);
    }

    toggle.addEventListener('click', () => setOpen(!menuOpen));

    navigation.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });

    documentRef.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuOpen) {
        event.preventDefault();
        setOpen(false, { restoreFocus: true });
      }
    });

    documentRef.addEventListener('click', (event) => {
      if (!menuOpen) return;
      if (navigation.contains(event.target) || toggle.contains(event.target)) return;
      setOpen(false, { restoreFocus: true });
    });

    const handleViewportChange = () => {
      menuOpen = false;
      syncMenu();
    };

    if (typeof mobileQuery.addEventListener === 'function') {
      mobileQuery.addEventListener('change', handleViewportChange);
    } else if (typeof mobileQuery.addListener === 'function') {
      mobileQuery.addListener(handleViewportChange);
    }

    syncMenu();
    return { setOpen, isOpen: () => menuOpen };
  }

  function markSectionVisible(documentRef, section, visible) {
    const target = section.dataset.landingTarget;
    const branch = target
      ? documentRef.querySelector(
        `.landing-tree__branch-group[data-landing-target="${target}"]`
      )
      : null;

    section.classList.toggle('landing-is-visible', visible);
    if (branch) branch.classList.toggle('landing-is-active', visible);
  }

  function setupSectionObserver(documentRef, windowRef, reducedMotion) {
    const sections = [...documentRef.querySelectorAll('.landing-branch-section')];

    if (
      reducedMotion
      || typeof windowRef.IntersectionObserver !== 'function'
    ) {
      sections.forEach((section) => markSectionVisible(documentRef, section, true));
      return null;
    }

    const observer = new windowRef.IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        markSectionVisible(documentRef, entry.target, entry.isIntersecting);
      });
    }, {
      rootMargin: '-8% 0px -18%',
      threshold: 0.2
    });

    sections.forEach((section) => observer.observe(section));
    return observer;
  }

  function setupScrollEffects(documentRef, windowRef, reducedMotion) {
    const header = documentRef.getElementById('landing-header');
    const tree = documentRef.getElementById('landing-tree');
    const reveal = documentRef.getElementById('landing-reveal-rect');
    const requestFrame = typeof windowRef.requestAnimationFrame === 'function'
      ? windowRef.requestAnimationFrame.bind(windowRef)
      : (callback) => windowRef.setTimeout(callback, 16);
    let framePending = false;

    function update() {
      framePending = false;
      if (header) header.classList.toggle('landing-is-scrolled', windowRef.scrollY > 32);

      if (!tree || !reveal) return;
      if (reducedMotion) {
        reveal.setAttribute('height', String(VIEWBOX_HEIGHT));
        return;
      }

      const rectangle = tree.getBoundingClientRect();
      const viewportHeight = windowRef.innerHeight || 1;
      const rawProgress = (viewportHeight - rectangle.top)
        / (rectangle.height + viewportHeight * 0.15);
      const progress = Math.max(0, Math.min(1, rawProgress));
      reveal.setAttribute('height', String(Math.round(progress * VIEWBOX_HEIGHT)));
    }

    function scheduleUpdate() {
      if (framePending) return;
      framePending = true;
      requestFrame(update);
    }

    windowRef.addEventListener('scroll', scheduleUpdate, { passive: true });
    windowRef.addEventListener('resize', scheduleUpdate);
    scheduleUpdate();

    return { update, scheduleUpdate };
  }

  function initLanding(documentRef = document, windowRef = window) {
    const body = documentRef.body;
    if (!body || !body.classList.contains('landing-page')) return null;

    body.classList.add('landing-js');
    const reducedMotionQuery = createMediaQuery(
      windowRef,
      '(prefers-reduced-motion: reduce)'
    );
    const reducedMotion = reducedMotionQuery.matches;

    buildTree(documentRef);

    return {
      menu: setupMenu(documentRef, windowRef),
      observer: setupSectionObserver(documentRef, windowRef, reducedMotion),
      scrollEffects: setupScrollEffects(documentRef, windowRef, reducedMotion)
    };
  }

  const commonJs = typeof module !== 'undefined' && module.exports;

  if (commonJs) {
    module.exports = {
      buildTree,
      createSvgElement,
      initLanding,
      markSectionVisible,
      setupMenu
    };
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initLanding());
  } else {
    initLanding();
  }
})();
