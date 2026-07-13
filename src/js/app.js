/* ============================================================
   U WIN FLOORTECH — INTERACTION LAYER (app.js)
   "Precision in Motion" — Vanilla JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. NAVIGATION — Sticky glassmorphism + hamburger
     ============================================================ */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  // Sticky glassmorphism on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Dropdown: position:fixed to bypass overflow:hidden on parents ── */
  const dropdownTriggers = document.querySelectorAll('.nav-item-dropdown');
  dropdownTriggers.forEach(trigger => {
    const dropdown = trigger.querySelector('.nav-dropdown');
    if (!dropdown) return;

    // Move dropdown to <body> so it's never clipped by any ancestor
    document.body.appendChild(dropdown);
    dropdown.style.position  = 'fixed';
    dropdown.style.zIndex    = '9999';

    let hideTimer;

    const positionDropdown = () => {
      const rect = trigger.getBoundingClientRect();
      const ddW  = dropdown.offsetWidth || 280;
      let left   = rect.left + rect.width / 2 - ddW / 2;
      // keep within viewport
      if (left < 8) left = 8;
      if (left + ddW > window.innerWidth - 8) left = window.innerWidth - ddW - 8;
      dropdown.style.top  = (rect.bottom + 8) + 'px';
      dropdown.style.left = left + 'px';
    };

    const showDropdown = () => {
      clearTimeout(hideTimer);
      positionDropdown();
      dropdown.style.opacity        = '1';
      dropdown.style.pointerEvents  = 'all';
      dropdown.style.transform      = 'translateY(0)';
    };

    const hideDropdown = () => {
      hideTimer = setTimeout(() => {
        dropdown.style.opacity       = '0';
        dropdown.style.pointerEvents = 'none';
        dropdown.style.transform     = 'translateY(-8px)';
      }, 120);
    };

    trigger.addEventListener('mouseenter', showDropdown);
    trigger.addEventListener('mouseleave', hideDropdown);
    dropdown.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    dropdown.addEventListener('mouseleave', hideDropdown);
  });


  /* ============================================================
     2. HERO — Typewriter Effect
     ============================================================ */
  const subtitleEl = document.getElementById('heroSubtitle');
  if (subtitleEl) {
    const text = 'From idea to complete execution. From bare land to a ready-to-play court. U Win Floortech supplies and installs ITF-certified acrylic court coatings, UV-stabilised PP interlocking modular tiles, and EPDM rubberised athletic tracks. No middlemen. No reseller markups.';
    subtitleEl.textContent = ''; // clear static fallback
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    subtitleEl.appendChild(cursor);

    const speed = 22;
    function type() {
      if (i < text.length) {
        cursor.insertAdjacentText('beforebegin', text.charAt(i));
        i++;
        setTimeout(type, speed);
      } else {
        // hide cursor after done
        setTimeout(() => { cursor.style.animation = 'none'; cursor.style.opacity = '0'; }, 2500);
      }
    }
    // Delay start by 800ms so hero title animation plays first
    setTimeout(type, 800);
  }


  /* ============================================================
     3. HERO — Word-by-word title reveal
     ============================================================ */
  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) {
    const words = heroTitle.textContent.trim().split(/\s+/);
    heroTitle.innerHTML = '';
    words.forEach((word, idx) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = word;
      span.style.animationDelay = `${idx * 60 + 200}ms`;
      heroTitle.appendChild(span);
      if (idx < words.length - 1) heroTitle.appendChild(document.createTextNode(' '));
    });
  }


  /* ============================================================
     4. HERO — Full-bleed image background switcher
     ============================================================ */
  const heroBgs  = document.querySelectorAll('.hero-bg');
  const heroDots = document.querySelectorAll('.hero-dot');
  const chipLabel = document.getElementById('heroChipLabel');
  const heroLabels = [
    'PP Interlocking Modular Tiles',
    'Acrylic Court Coating System',
    'EPDM Rubberised Athletic Track'
  ];
  let currentHero = 0;
  let heroTimer;

  function switchHero(idx, isFirst) {
    heroBgs.forEach((bg, i) => {
      bg.classList.toggle('active', i === idx);
      // re-trigger zoom animation
      if (i === idx) {
        bg.style.animation = 'none';
        bg.offsetHeight; // reflow
        bg.style.animation = 'hero-zoom 9s ease-out forwards';
      }
    });
    heroDots.forEach((d, i) => d.classList.toggle('active', i === idx));
    currentHero = idx;

    // Guided-line annotation: fade-out → swap → replay
    const annotation = document.getElementById('heroProductChip');
    if (!annotation) return;

    const replayAnnotation = () => {
      // Update label text while invisible
      if (chipLabel) chipLabel.textContent = heroLabels[idx];
      // Reset child animations (dot, line, box)
      const dot  = annotation.querySelector('.annotation-dot');
      const line = annotation.querySelector('.annotation-line');
      const box  = annotation.querySelector('.annotation-box');
      [dot, line, box].forEach(el => {
        if (!el) return;
        el.style.animation = 'none';
        el.offsetHeight; // force reflow
        el.style.animation = '';
      });
      // Fade back in (remove hiding class — CSS transition handles it)
      annotation.classList.remove('is-hiding');
    };

    if (isFirst) {
      // First load — no fade-out, just play straight in
      replayAnnotation();
    } else {
      // Fade out, then replay
      annotation.classList.add('is-hiding');
      setTimeout(replayAnnotation, 210); // matches CSS transition duration (200ms) + 10ms buffer
    }
  }

  function startHeroCycle() {
    heroTimer = setInterval(() => {
      switchHero((currentHero + 1) % heroBgs.length);
    }, 6000);
  }

  if (heroBgs.length) {
    switchHero(0, true);   // first load — no fade-out
    startHeroCycle();
    heroDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(heroTimer);
        switchHero(i);
        startHeroCycle();
      });
    });
  }


  /* ============================================================
     5. HERO — 3D Tilt on Mouse Move
     ============================================================ */
  const court3DWrapper = document.querySelector('.court-3d-wrapper');
  const court3D = document.querySelector('.court-3d');

  if (court3DWrapper && court3D) {
    court3DWrapper.addEventListener('mousemove', (e) => {
      const rect = court3DWrapper.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotX = dy * -8;
      const rotY = dx * 8;
      court3D.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    court3DWrapper.addEventListener('mouseleave', () => {
      court3D.style.transform = 'rotateX(0) rotateY(0)';
    });
  }


  /* ============================================================
     6. HERO — Floating Particles
     ============================================================ */
  const particleContainer = document.getElementById('heroParticles');
  if (particleContainer) {
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 6 + 3;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        bottom: ${Math.random() * -20}%;
        animation-duration: ${Math.random() * 15 + 12}s;
        animation-delay: ${Math.random() * 8}s;
        opacity: ${Math.random() * 0.4 + 0.1};
      `;
      particleContainer.appendChild(p);
    }
  }


  /* ============================================================
     7. PRODUCT CARDS — 3D Tilt on Mouse Move
     ============================================================ */
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `translateY(-6px) rotateX(${dy * -4}deg) rotateY(${dx * 4}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ============================================================
     8. SCROLL REVEAL — IntersectionObserver
     ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stamp-in').forEach(el => {
    // If already in viewport at load time, reveal immediately (no delay)
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    } else {
      revealObserver.observe(el);
    }
  });


  /* ============================================================
     9. STATS — Odometer Counters
     ============================================================ */
  function animateCounter(el, target, prefix, suffix, duration = 1800) {
    const start = performance.now();
    const isDecimal = !Number.isInteger(target);
    const decimals = isDecimal ? 1 : 0;

    function update(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;
      const display = current.toFixed(decimals);
      el.innerHTML = `<span class="prefix">${prefix}</span>${display}<span class="suffix">${suffix}</span>`;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statsSection = document.getElementById('stats');
  let statsTriggered = false;

  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsTriggered) {
          statsTriggered = true;
          document.querySelectorAll('.stat-number').forEach(el => {
            const target = parseFloat(el.dataset.target);
            const prefix = el.dataset.prefix || '';
            const suffix = el.dataset.suffix || '';
            animateCounter(el, target, prefix, suffix);
          });
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(statsSection);
  }


  /* ============================================================
     10. ICP — Stamp Animation (triggered on scroll)
     ============================================================ */
  // Already handled by IntersectionObserver above via .stamp-in class


  /* ============================================================
     11. GALLERY — Lightbox click handler
     ============================================================ */
  const galleryItems = document.querySelectorAll('.gallery-item[data-lightbox]');
  const lightbox      = document.getElementById('galleryLightbox');
  const lbImg         = document.getElementById('lightboxImg');
  const lbTitle       = document.getElementById('lightboxTitle');
  const lbDesc        = document.getElementById('lightboxDesc');
  const lbClose       = document.getElementById('lightboxClose');
  const lbBackdrop    = document.getElementById('lightboxBackdrop');

  function openLightbox(src, title, desc, alt) {
    lbImg.src = 'images/' + src;
    lbImg.alt = alt || title;
    lbTitle.textContent = title;
    lbDesc.textContent  = desc;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 350);
  }

  if (lightbox) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        openLightbox(
          item.dataset.lightbox,
          item.dataset.title,
          item.dataset.desc,
          item.querySelector('img') ? item.querySelector('img').alt : ''
        );
      });
    });

    if (lbClose)    lbClose.addEventListener('click', closeLightbox);
    if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }




  /* ============================================================
     12. FAQ — Accordion
     ============================================================ */
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close all others
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-answer').style.maxHeight = '0';
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });


  /* ============================================================
     13. TRUST BADGES — Staggered entrance
     ============================================================ */
  document.querySelectorAll('.trust-badge').forEach((badge, i) => {
    badge.style.animationDelay = `${600 + i * 120}ms`;
  });


  /* ============================================================
     14. CERTIFICATIONS MARQUEE — Duplicate for seamless loop
     ============================================================ */
  const certTrack = document.getElementById('certTrack');
  if (certTrack) {
    // Clone content for infinite scroll
    certTrack.innerHTML += certTrack.innerHTML;
  }



  /* ============================================================
     16. SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ============================================================
     17. ACTIVE NAV LINK on scroll
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === entry.target.id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => activeObserver.observe(s));

}); // end DOMContentLoaded
