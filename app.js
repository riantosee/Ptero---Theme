/**
 * MIRAINOVA — OFFICIAL PTERODACTYL v2 THEME STUDIO
 * Full 56-Screenshot Documentation & Interactive Village Showcase (English Edition)
 */

(function () {
  'use strict';

  // All 7 documented panel pages per theme (Desktop 1440x900 + Mobile 390x844 = 14 screenshots per theme)
  const PAGES = [
    { slug: '00-login', title: '00 — Login Authentication', route: '/auth/login', short: 'Login Page' },
    { slug: '01-dashboard', title: '01 — Server Dashboard', route: '/', short: 'Dashboard' },
    { slug: '02-account', title: '02 — Account Security & Profile', route: '/account', short: 'Account Settings' },
    { slug: '03-admin-overview', title: '03 — Administration Overview', route: '/panel', short: 'Admin Overview' },
    { slug: '04-admin-themes', title: '04 — Themes Management Gallery', route: '/panel/themes', short: 'Admin Themes' },
    { slug: '05-admin-settings', title: '05 — System Configuration', route: '/panel/settings', short: 'Admin Settings' },
    { slug: '06-admin-extensions', title: '06 — Extensions Registry', route: '/panel/extensions', short: 'Admin Extensions' }
  ];

  const THEMES = {
    'ada-wong-ui': {
      id: 'ada-wong-ui',
      kicker: 'EDITION 01 // TACTICAL NOIR & CRIMSON SILK',
      title: 'Ada Wong UI',
      desc: 'Engineered with a classified covert-agent aesthetic wrapped in crimson silk and deep obsidian. Features 4-corner gold targeting reticles on every card, chamfered polygon buttons, and 3px crimson laser accents without sacrificing panel legibility.',
      tags: ['v1.1.0', 'ada-wong-ui', '14 Full Screenshots'],
      portrait: 'assets/ada-portrait.jpg',
      download: 'downloads/ada-wong-ui-1.1.0.pteroext',
      defaultScenePage: 4,
      rightNote: 'Showcases 4-corner gold targeting reticles, chamfered crimson controls, and embedded dual-artwork Ada Wong backdrops.'
    },
    'shorekeeper-ui': {
      id: 'shorekeeper-ui',
      kicker: 'EDITION 02 // EDITORIAL NIGHT CINEMA',
      title: 'Shorekeeper UI',
      desc: 'An editorial night-cinema theme inspired by Shorekeeper. Combines refined Cormorant Garamond serif typography, vertical gradient glass cards that dissolve into the starlit backdrop, and luminous cyan capsule controls.',
      tags: ['v1.2.0', 'shorekeeper-ui', '14 Full Screenshots'],
      portrait: 'assets/shore-portrait.jpg',
      download: 'downloads/shorekeeper-ui-1.2.0.pteroext',
      defaultScenePage: 4,
      rightNote: 'Built around a full-bleed starlight canvas with vertical gradient glass cards and pill-outlined action controls.'
    },
    'luna-bliss-ui': {
      id: 'luna-bliss-ui',
      kicker: 'EDITION 03 // CLASSIC 2001 DESKTOP TRIBUTE',
      title: 'Luna Bliss UI',
      desc: 'A loving tribute to the iconic 2001 desktop era (Luna blue chrome and rolling green Bliss meadow) crafted with 100% trademark-safe naming. Features a glossy royal-blue top bar, warm #f6f4ea dialog cards, and 3D green Start buttons.',
      tags: ['v1.1.0', 'luna-bliss-ui', '14 Full Screenshots'],
      portrait: 'assets/luna-portrait.jpg',
      download: 'downloads/luna-bliss-ui-1.1.0.pteroext',
      defaultScenePage: 3,
      rightNote: 'Evokes 2001 desktop nostalgia with a glossy royal-blue taskbar, cream dialog window cards, and 3D beveled green buttons.'
    },
    'mirai-glassmo': {
      id: 'mirai-glassmo',
      kicker: 'EDITION 04 // MINIMAL DARK GLASSMORPHISM',
      title: 'Mirai Glassmo',
      desc: 'Pure dark glassmorphism featuring a smooth 18px Gaussian backdrop blur and high-contrast legibility. Pairs restrained lavender and cyan accents with an ultra-lightweight 8 KB package footprint for zero-overhead performance.',
      tags: ['v1.2.0', 'mirai-glassmo', '14 Full Screenshots'],
      portrait: 'screenshots/mirai-glassmo/04-admin-themes-desktop.png',
      download: 'downloads/mirai-glassmo-1.2.0.pteroext',
      defaultScenePage: 4,
      rightNote: 'The official baseline of the MIRAINOVA ecosystem: ultra-clean, lightweight (8 KB), and focused on frosted dark glass.'
    }
  };

  function getScreenshotUrl(themeId, pageIndex, device) {
    const page = PAGES[pageIndex] || PAGES[0];
    return `screenshots/${themeId}/${page.slug}-${device}.png`;
  }

  // ─────────────────────────────────────────────────────────
  // 1. HEADER SCROLL EFFECT
  // ─────────────────────────────────────────────────────────
  const siteHeader = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (!siteHeader) return;
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }, { passive: true });

  // ─────────────────────────────────────────────────────────
  // 2. SPOTLIGHT SECTION (ETHAN WINTERS STYLE)
  // ─────────────────────────────────────────────────────────
  let activeSpotTheme = 'ada-wong-ui';
  let activeSpotPage = 4; // 04-admin-themes

  const spotEnvBg = document.getElementById('spotEnvBg');
  const spotKicker = document.getElementById('spotKicker');
  const spotTitle = document.getElementById('spotTitle');
  const spotDesc = document.getElementById('spotDesc');
  const spotTags = document.getElementById('spotTags');
  const spotCharImg = document.getElementById('spotCharImg');
  const spotDownloadBtn = document.getElementById('spotDownloadBtn');
  const spotOpenGalleryBtn = document.getElementById('spotOpenGalleryBtn');
  const spotVerticalThumbs = document.getElementById('spotVerticalThumbs');
  const spotRightNote = document.getElementById('spotRightNote');
  const avatarCircles = document.querySelectorAll('.avatar-circle');

  const SPOTLIGHT_THUMB_INDICES = [0, 1, 2, 3, 4];

  function renderSpotlightThumbs() {
    if (!spotVerticalThumbs) return;
    spotVerticalThumbs.innerHTML = '';

    SPOTLIGHT_THUMB_INDICES.forEach(pageIdx => {
      const pageObj = PAGES[pageIdx];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'spot-v-thumb' + (pageIdx === activeSpotPage ? ' active' : '');
      btn.title = `${pageObj.title} — Click to switch backdrop, double-click for full inspector`;
      const imgUrl = getScreenshotUrl(activeSpotTheme, pageIdx, 'desktop');
      btn.innerHTML = `<img src="${imgUrl}" alt="${pageObj.short}">`;

      btn.addEventListener('click', () => {
        activeSpotPage = pageIdx;
        if (spotEnvBg) {
          spotEnvBg.style.backgroundImage = `url('${imgUrl}')`;
        }
        renderSpotlightThumbs();
      });

      btn.addEventListener('dblclick', () => {
        openDocModal(activeSpotTheme, pageIdx, 'both');
      });

      spotVerticalThumbs.appendChild(btn);
    });
  }

  function setSpotlightTheme(themeId) {
    const t = THEMES[themeId];
    if (!t) return;
    activeSpotTheme = themeId;
    activeSpotPage = t.defaultScenePage;

    if (spotCharImg) {
      spotCharImg.style.opacity = '0.25';
      spotCharImg.style.transform = 'scale(0.97)';
    }

    setTimeout(() => {
      if (spotKicker) spotKicker.textContent = t.kicker;
      if (spotTitle) spotTitle.textContent = t.title;
      if (spotDesc) spotDesc.textContent = t.desc;
      if (spotRightNote) spotRightNote.textContent = t.rightNote;
      if (spotDownloadBtn) spotDownloadBtn.href = t.download;

      if (spotTags) {
        spotTags.innerHTML = t.tags.map(tag => `<span>${tag}</span>`).join('');
      }

      if (spotCharImg) {
        spotCharImg.src = t.portrait;
        spotCharImg.alt = t.title;
        spotCharImg.style.opacity = '1';
        spotCharImg.style.transform = 'scale(1)';
      }

      if (spotEnvBg) {
        spotEnvBg.style.backgroundImage = `url('${getScreenshotUrl(themeId, activeSpotPage, 'desktop')}')`;
      }

      renderSpotlightThumbs();
    }, 140);

    avatarCircles.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === themeId);
    });
  }

  avatarCircles.forEach(btn => {
    btn.addEventListener('click', () => {
      setSpotlightTheme(btn.dataset.theme);
    });
  });

  if (spotOpenGalleryBtn) {
    spotOpenGalleryBtn.addEventListener('click', () => {
      openDocModal(activeSpotTheme, activeSpotPage, 'both');
    });
  }

  renderSpotlightThumbs();

  // ─────────────────────────────────────────────────────────
  // 3. ON-PAGE HORIZONTAL GALLERY ("LOCACIONES JUGABLES")
  // ─────────────────────────────────────────────────────────
  let galleryTheme = 'ada-wong-ui';
  let galleryDevice = 'desktop';

  const locationsTrack = document.getElementById('locationsTrack');
  const locationsTrackWrap = document.getElementById('locationsTrackWrap');
  const galleryThemePills = document.querySelectorAll('#galleryThemePills .filter-pill');
  const galleryDevicePills = document.querySelectorAll('#galleryDevicePills .filter-pill');
  const trackPrev = document.getElementById('trackPrev');
  const trackNext = document.getElementById('trackNext');

  function renderLocationsTrack() {
    if (!locationsTrack) return;
    locationsTrack.innerHTML = '';

    PAGES.forEach((pageObj, idx) => {
      const card = document.createElement('div');
      card.className = 'location-card' + (galleryDevice === 'mobile' ? ' mobile-mode' : '');
      const imgUrl = getScreenshotUrl(galleryTheme, idx, galleryDevice);
      const themeTitle = THEMES[galleryTheme].title;

      card.innerHTML = `
        <div class="location-img-box">
          <img src="${imgUrl}" alt="${themeTitle} ${pageObj.short}" loading="lazy">
        </div>
        <h4>${pageObj.short}</h4>
        <span>${themeTitle} • ${pageObj.route} (${galleryDevice === 'desktop' ? '1440×900' : '390×844'})</span>
      `;

      card.addEventListener('click', () => {
        openDocModal(galleryTheme, idx, 'both');
      });

      locationsTrack.appendChild(card);
    });
  }

  galleryThemePills.forEach(pill => {
    pill.addEventListener('click', () => {
      galleryTheme = pill.dataset.theme;
      galleryThemePills.forEach(p => p.classList.toggle('active', p === pill));
      renderLocationsTrack();
    });
  });

  galleryDevicePills.forEach(pill => {
    pill.addEventListener('click', () => {
      galleryDevice = pill.dataset.device;
      galleryDevicePills.forEach(p => p.classList.toggle('active', p === pill));
      renderLocationsTrack();
    });
  });

  if (trackPrev && locationsTrackWrap) {
    trackPrev.addEventListener('click', () => {
      locationsTrackWrap.scrollBy({ left: -360, behavior: 'smooth' });
    });
  }
  if (trackNext && locationsTrackWrap) {
    trackNext.addEventListener('click', () => {
      locationsTrackWrap.scrollBy({ left: 360, behavior: 'smooth' });
    });
  }

  renderLocationsTrack();

  // ─────────────────────────────────────────────────────────
  // 4. FULL-SCREEN 14-SCREENSHOT DOCUMENTATION INSPECTOR MODAL
  // ─────────────────────────────────────────────────────────
  let modalTheme = 'ada-wong-ui';
  let modalPageIdx = 0;
  let modalViewMode = 'both'; // 'both' | 'desktop' | 'mobile'

  const docModal = document.getElementById('docModal');
  const docModalTitle = document.getElementById('docModalTitle');
  const docModalDownload = document.getElementById('docModalDownload');
  const docModalClose = document.getElementById('docModalClose');
  const docPageSidebar = document.getElementById('docPageSidebar');
  const docThemeTabs = document.querySelectorAll('#docThemeTabs .doc-theme-tab');
  const docViewBtns = document.querySelectorAll('.doc-view-controls .doc-view-btn');

  const frameDesktopWrap = document.getElementById('frameDesktopWrap');
  const frameMobileWrap = document.getElementById('frameMobileWrap');
  const modalDesktopImg = document.getElementById('modalDesktopImg');
  const modalMobileImg = document.getElementById('modalMobileImg');
  const modalDesktopCap = document.getElementById('modalDesktopCap');
  const modalMobileCap = document.getElementById('modalMobileCap');
  const modalPageCounter = document.getElementById('modalPageCounter');
  const modalPrevPage = document.getElementById('modalPrevPage');
  const modalNextPage = document.getElementById('modalNextPage');

  function renderModalSidebar() {
    if (!docPageSidebar) return;
    docPageSidebar.innerHTML = '';

    PAGES.forEach((pageObj, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'doc-page-item' + (idx === modalPageIdx ? ' active' : '');
      const thumbUrl = getScreenshotUrl(modalTheme, idx, 'desktop');

      btn.innerHTML = `
        <img src="${thumbUrl}" alt="${pageObj.short}">
        <div class="doc-page-item-info">
          <strong>${pageObj.short}</strong>
          <span>${pageObj.route} (Desktop + Mobile)</span>
        </div>
      `;

      btn.addEventListener('click', () => {
        modalPageIdx = idx;
        updateModalView();
      });

      docPageSidebar.appendChild(btn);
    });
  }

  function updateModalView() {
    const t = THEMES[modalTheme];
    const p = PAGES[modalPageIdx];
    if (!t || !p) return;

    if (docModalTitle) {
      docModalTitle.textContent = `${t.title} — 14 Full Documentation Screenshots`;
    }
    if (docModalDownload) {
      docModalDownload.href = t.download;
    }

    docThemeTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.theme === modalTheme);
    });

    docViewBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === modalViewMode);
    });

    if (frameDesktopWrap) {
      frameDesktopWrap.style.display = (modalViewMode === 'both' || modalViewMode === 'desktop') ? 'flex' : 'none';
    }
    if (frameMobileWrap) {
      frameMobileWrap.style.display = (modalViewMode === 'both' || modalViewMode === 'mobile') ? 'flex' : 'none';
      frameMobileWrap.style.width = (modalViewMode === 'mobile') ? '340px' : '250px';
    }

    const deskUrl = getScreenshotUrl(modalTheme, modalPageIdx, 'desktop');
    const mobUrl = getScreenshotUrl(modalTheme, modalPageIdx, 'mobile');

    if (modalDesktopImg) modalDesktopImg.src = deskUrl;
    if (modalMobileImg) modalMobileImg.src = mobUrl;
    if (modalDesktopCap) modalDesktopCap.textContent = `DESKTOP (1440×900) — ${p.title}`;
    if (modalMobileCap) modalMobileCap.textContent = `MOBILE (390×844) — ${p.short}`;
    if (modalPageCounter) {
      modalPageCounter.textContent = `Page ${modalPageIdx + 1} of ${PAGES.length} — ${p.title} (${p.route})`;
    }

    renderModalSidebar();
  }

  function openDocModal(themeId, pageIdx = 0, mode = 'both') {
    modalTheme = THEMES[themeId] ? themeId : 'ada-wong-ui';
    modalPageIdx = (pageIdx >= 0 && pageIdx < PAGES.length) ? pageIdx : 0;
    modalViewMode = mode || 'both';
    updateModalView();
    if (docModal) {
      docModal.classList.add('open');
      docModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDocModal() {
    if (docModal) {
      docModal.classList.remove('open');
      docModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('.js-open-doc').forEach(el => {
    el.addEventListener('click', () => {
      const th = el.dataset.theme || 'ada-wong-ui';
      const pg = parseInt(el.dataset.page || '0', 10);
      openDocModal(th, pg, 'both');
    });
  });

  const btnHeroOpenDocs = document.getElementById('btnHeroOpenDocs');
  if (btnHeroOpenDocs) {
    btnHeroOpenDocs.addEventListener('click', () => {
      openDocModal('ada-wong-ui', 4, 'both');
    });
  }

  docThemeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      modalTheme = tab.dataset.theme;
      updateModalView();
    });
  });

  docViewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modalViewMode = btn.dataset.mode;
      updateModalView();
    });
  });

  if (modalPrevPage) {
    modalPrevPage.addEventListener('click', () => {
      modalPageIdx = (modalPageIdx - 1 + PAGES.length) % PAGES.length;
      updateModalView();
    });
  }

  if (modalNextPage) {
    modalNextPage.addEventListener('click', () => {
      modalPageIdx = (modalPageIdx + 1) % PAGES.length;
      updateModalView();
    });
  }

  if (docModalClose) {
    docModalClose.addEventListener('click', closeDocModal);
  }

  document.addEventListener('keydown', (e) => {
    if (!docModal || !docModal.classList.contains('open')) return;
    if (e.key === 'Escape') closeDocModal();
    if (e.key === 'ArrowLeft') {
      modalPageIdx = (modalPageIdx - 1 + PAGES.length) % PAGES.length;
      updateModalView();
    }
    if (e.key === 'ArrowRight') {
      modalPageIdx = (modalPageIdx + 1) % PAGES.length;
      updateModalView();
    }
  });

  // ─────────────────────────────────────────────────────────
  // 5. COPY CLI COMMANDS
  // ─────────────────────────────────────────────────────────
  const btnCopyCli = document.getElementById('btnCopyCli');
  const toastMsg = document.getElementById('toastMsg');

  function showToast(msg) {
    if (!toastMsg) return;
    toastMsg.textContent = msg;
    toastMsg.classList.add('show');
    setTimeout(() => toastMsg.classList.remove('show'), 2600);
  }

  if (btnCopyCli) {
    btnCopyCli.addEventListener('click', () => {
      const cmd = [
        'cd /var/www/pterodactyl',
        'php artisan p:extension:install /root/ada-wong-ui-1.1.0.pteroext',
        'php artisan p:theme:activate ada-wong-ui',
        'php artisan view:clear && php artisan config:clear'
      ].join('\n');

      navigator.clipboard.writeText(cmd).then(() => {
        showToast('CLI commands copied to clipboard!');
      });
    });
  }

  // ─────────────────────────────────────────────────────────
  // 6. SUBTLE SNOW / ASH ATMOSPHERE (VILLAGE EFFECT)
  // ─────────────────────────────────────────────────────────
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    const flakes = Array.from({ length: 38 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: Math.random() * 0.55 + 0.2,
      a: Math.random() * 0.35 + 0.12
    }));

    function drawParticles() {
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.x += f.vx;
        f.y += f.vy;
        if (f.y > h) { f.y = -4; f.x = Math.random() * w; }
        if (f.x > w) f.x = 0;
        if (f.x < 0) f.x = w;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(235, 240, 248, ${f.a})`;
        ctx.fill();
      }
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }
})();
