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


  /* ============================================================
     2. HERO — Typewriter Effect
     ============================================================ */
  const subtitleEl = document.getElementById('heroSubtitle');
  if (subtitleEl) {
    const text = 'U Win Floortech manufactures and installs ITF-certified acrylic court coatings, UV-stabilised PP interlocking modular tiles, and EPDM rubberised athletic tracks — directly from the factory. No middlemen. No IndiaMART markups.';
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
     4. HERO — 3D Court Switcher
     ============================================================ */
  const courts = document.querySelectorAll('.court-svg');
  const dots   = document.querySelectorAll('.court-dot');
  const courtLabels = ['PP Interlocking Tiles', 'Acrylic Court System', 'EPDM Running Track'];
  const productLabel = document.getElementById('courtProductLabel');
  let currentCourt = 0;
  let courtTimer;

  function switchCourt(idx) {
    courts.forEach((c, i) => c.classList.toggle('active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    if (productLabel) productLabel.textContent = courtLabels[idx];
    currentCourt = idx;
  }

  function startCourtCycle() {
    courtTimer = setInterval(() => {
      switchCourt((currentCourt + 1) % courts.length);
    }, 4500);
  }

  if (courts.length) {
    switchCourt(0);
    startCourtCycle();
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(courtTimer);
        switchCourt(i);
        startCourtCycle();
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
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stamp-in').forEach(el => {
    revealObserver.observe(el);
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
     11. GALLERY — Parallax on Scroll
     ============================================================ */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const parallaxFactors = [0.06, 0.04, 0.05, 0.03, 0.04, 0.05];

  function onScroll() {
    const scrollY = window.scrollY;
    galleryItems.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      const viewCenter = window.innerHeight / 2;
      const itemCenter = rect.top + rect.height / 2;
      const distFromCenter = itemCenter - viewCenter;
      const factor = parallaxFactors[i] || 0.04;
      const shift = distFromCenter * factor;
      const img = item.querySelector('img');
      if (img) {
        img.style.transform = `scale(1) translateY(${shift}px)`;
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });


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
     15. SCROLL INDICATOR — Hide after first scroll
     ============================================================ */
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.transition = 'opacity 0.4s ease';
      }
    }, { once: true, passive: true });
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
