/**
 * GSAP 2027 SHOWCASE - CORE HIGH-PERFORMANCE ANIMATION ENGINE
 * Built with GSAP 3.12, ScrollTrigger, Lenis Smooth Scroll & Canvas 2D
 */

document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP Plugins
  gsap.registerPlugin(ScrollTrigger);

  // Initialize Core Subsystems
  initLenisSmoothScroll();
  initAmbientParticleCanvas();
  initCustomCursor();
  initKineticScrambleText();
  initHeroParallax();
  initHorizontalScrollShowcase();
  initMotionPlayground();
  initBentoSpotlightAndTilt();
  initCounterAnimations();
  initMarqueeVelocity();
  initLanguageAndThemeSwitchers();
  initMagneticElements();
});

/* ==========================================================================
   1. LENIS SMOOTH SCROLL + GSAP SCROLLTRIGGER SYNCHRONIZATION
   ========================================================================== */
let lenisInstance = null;

function initLenisSmoothScroll() {
  // Initialize Lenis with optimal 2027 inertia parameters
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    infinite: false,
  });

  // Synchronize Lenis with GSAP ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Scroll Progress Bar Update
  const progressBar = document.getElementById('scroll-progress-bar');
  if (progressBar) {
    lenisInstance.on('scroll', ({ progress }) => {
      progressBar.style.width = `${progress * 100}%`;
    });
  }

  // Header Scroll State
  const header = document.querySelector('.site-header');
  if (header) {
    lenisInstance.on('scroll', ({ scroll }) => {
      if (scroll > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

/* ==========================================================================
   2. AMBIENT 2D PARTICLE CANVASES (HARDWARE OPTIMIZED)
   ========================================================================== */
function initAmbientParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 25 : 55;
  const maxDistance = 140;

  const mouse = { x: null, y: null, radius: 160 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.75;
      this.vy = (Math.random() - 0.5) * 0.75;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(10, 228, 72, 0.4)' : 'rgba(0, 242, 254, 0.3)';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse Interaction (Subtle Repulsion)
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2.5;
          this.y -= Math.sin(angle) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let animationFrameId;
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.18;
          ctx.strokeStyle = `rgba(10, 228, 72, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. ADAPTIVE CUSTOM CURSOR ENGINE (LERP DECOUPLED)
   ========================================================================== */
function initCustomCursor() {
  const dot = document.querySelector('.cursor-dot');
  const follower = document.querySelector('.cursor-follower');
  const glow = document.querySelector('.cursor-glow');

  if (!dot || !follower || window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  const mouse = { x: -100, y: -100 };
  const followerPos = { x: -100, y: -100 };
  const glowPos = { x: -100, y: -100 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Instant dot update
    dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
  });

  // RAF Lerp loop for follower and ambient glow
  function renderCursor() {
    followerPos.x += (mouse.x - followerPos.x) * 0.18;
    followerPos.y += (mouse.y - followerPos.y) * 0.18;

    glowPos.x += (mouse.x - glowPos.x) * 0.08;
    glowPos.y += (mouse.y - glowPos.y) * 0.08;

    follower.style.transform = `translate3d(${followerPos.x}px, ${followerPos.y}px, 0) translate(-50%, -50%)`;
    if (glow) {
      glow.style.transform = `translate3d(${glowPos.x}px, ${glowPos.y}px, 0) translate(-50%, -50%)`;
    }

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Interactive Hover Targets
  const hoverTargets = document.querySelectorAll('a, button, .ctrl-btn, .btn, .showcase-card, .ease-pill, .bento-card');
  hoverTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    target.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  // Text Mode Targets
  const textTargets = document.querySelectorAll('h1, h2, .hero-title, .section-title, .hero-subtitle');
  textTargets.forEach((target) => {
    target.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-text-mode');
    });
    target.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-text-mode');
    });
  });
}

/* ==========================================================================
   4. KINETIC SCRAMBLE TEXT ENGINE (CYBER DECODER)
   ========================================================================== */
class TextScrambler {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________01';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char" style="color: var(--accent-green)">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

function initKineticScrambleText() {
  const scrambleElements = document.querySelectorAll('[data-scramble]');
  scrambleElements.forEach((el) => {
    const scrambler = new TextScrambler(el);
    const originalText = el.getAttribute('data-scramble') || el.innerText;

    // Trigger on view using ScrollTrigger
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        scrambler.setText(originalText);
      },
    });

    el.addEventListener('mouseenter', () => {
      scrambler.setText(originalText);
    });
  });
}

/* ==========================================================================
   5. HERO 3D PARALLAX & ENTRANCE CHOREOGRAPHY
   ========================================================================== */
function initHeroParallax() {
  const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

  heroTl
    .from('.pill-badge', { y: 30, opacity: 0, scale: 0.9, duration: 0.8 })
    .from('.hero-title', { y: 50, opacity: 0, duration: 1 }, '-=0.5')
    .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.9 }, '-=0.6')
    .from('.hero-actions .btn', { y: 20, opacity: 0, stagger: 0.15, duration: 0.8 }, '-=0.5')
    .from('.floating-card', {
      scale: 0.8,
      opacity: 0,
      y: 60,
      stagger: 0.2,
      duration: 1.2,
      ease: 'back.out(1.6)',
    }, '-=0.8')
    .from('.hero-stat-item', { y: 25, opacity: 0, stagger: 0.1, duration: 0.8 }, '-=0.6');

  // Continuous subtle float for cards
  gsap.to('.card-main', {
    y: '-=15',
    rotationZ: '+=1.5',
    duration: 3.5,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  gsap.to('.card-code', {
    y: '+=12',
    rotationZ: '-=2',
    duration: 4.2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  gsap.to('.card-mini', {
    y: '-=10',
    rotationZ: '+=1',
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  // Floating Hero Wave Ball Animation
  gsap.to('.wave-ball', {
    x: '200px',
    duration: 2.2,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut',
  });

  // Mouse Parallax on Hero Visual
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.addEventListener('mousemove', (e) => {
      const { left, top, width, height } = heroVisual.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      gsap.to('.card-main', {
        rotationY: x * 20,
        rotationX: -y * 20,
        transformPerspective: 900,
        ease: 'power1.out',
        duration: 0.5,
      });

      gsap.to('.card-code', {
        rotationY: x * 30,
        rotationX: -y * 30,
        x: x * 20,
        y: y * 20,
        duration: 0.6,
      });
    });

    heroVisual.addEventListener('mouseleave', () => {
      gsap.to('.floating-card', {
        rotationY: 0,
        rotationX: 0,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    });
  }
}

/* ==========================================================================
   6. PINNED HORIZONTAL SCROLL SHOWCASE (GSAP SCROLLTRIGGER)
   ========================================================================== */
function initHorizontalScrollShowcase() {
  const container = document.querySelector('.horizontal-scroll-container');
  const track = document.querySelector('.horizontal-track');

  if (!container || !track) return;

  // Calculate total horizontal travel distance
  const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 120);

  const horizontalTween = gsap.to(track, {
    x: getScrollAmount,
    ease: 'none',
  });

  ScrollTrigger.create({
    trigger: container,
    start: 'top top',
    end: () => `+=${track.scrollWidth - window.innerWidth}`,
    pin: true,
    animation: horizontalTween,
    scrub: 1.2,
    invalidateOnRefresh: true,
  });

  // Mini live animations inside horizontal cards
  gsap.to('.morph-preview-box', {
    rotation: 360,
    borderRadius: '50%',
    duration: 3,
    repeat: -1,
    yoyo: true,
    ease: 'power2.inOut',
  });

  gsap.to('.pulse-preview-bar', {
    width: '100%',
    duration: 1.8,
    repeat: -1,
    yoyo: true,
    ease: 'elastic.out(1, 0.5)',
  });
}

/* ==========================================================================
   7. INTERACTIVE MOTION & EASING PLAYGROUND
   ========================================================================== */
function initMotionPlayground() {
  const targetBox = document.getElementById('playground-target');
  const graphCanvas = document.getElementById('ease-graph-canvas');
  const playBtn = document.getElementById('btn-play-ease');
  const codeOutput = document.getElementById('code-output-text');
  const copyBtn = document.getElementById('btn-copy-code');
  const copyToast = document.getElementById('copy-toast');

  if (!targetBox) return;

  // Playground state
  let currentEase = 'elastic.out(1, 0.3)';
  let duration = 1.4;
  let rotation = 180;
  let scale = 1.2;
  let currentTween = null;

  // Graph Canvas Renderer
  function drawEaseGraph(easeStr) {
    if (!graphCanvas) return;
    const ctx = graphCanvas.getContext('2d');
    const w = graphCanvas.width = graphCanvas.offsetWidth;
    const h = graphCanvas.height = graphCanvas.offsetHeight;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(10, 228, 72, 0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const padding = 30;
    const drawWidth = w - padding * 2;
    const drawHeight = h - padding * 2;

    for (let i = 0; i <= drawWidth; i++) {
      const progress = i / drawWidth;
      let easeVal = 0;
      try {
        easeVal = gsap.parseEase(easeStr)(progress);
      } catch (e) {
        easeVal = progress;
      }
      const x = padding + i;
      const y = h - padding - (easeVal * drawHeight);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Baseline & Target lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(padding, padding, drawWidth, drawHeight);
  }

  function runPlaygroundAnimation() {
    if (currentTween) currentTween.kill();

    // Reset initial state
    gsap.set(targetBox, { x: 0, rotation: 0, scale: 1, borderRadius: '18px' });

    const maxTravel = document.querySelector('.stage-arena').offsetWidth - 90;

    currentTween = gsap.to(targetBox, {
      x: maxTravel,
      rotation: rotation,
      scale: scale,
      borderRadius: '50%',
      duration: parseFloat(duration),
      ease: currentEase,
      yoyo: true,
      repeat: 1,
      repeatDelay: 0.3,
    });

    updateCodeSnippet();
  }

  function updateCodeSnippet() {
    if (!codeOutput) return;
    const code = `gsap.to(".element", {\n  x: 350,\n  rotation: ${rotation},\n  scale: ${scale},\n  duration: ${duration},\n  ease: "${currentEase}"\n});`;
    codeOutput.innerText = code;
  }

  // Ease Pill Buttons
  const easePills = document.querySelectorAll('.ease-pill');
  easePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      easePills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      currentEase = pill.getAttribute('data-ease');
      drawEaseGraph(currentEase);
      runPlaygroundAnimation();
    });
  });

  // Slider Inputs
  const durationSlider = document.getElementById('slider-duration');
  const durationVal = document.getElementById('val-duration');
  if (durationSlider) {
    durationSlider.addEventListener('input', (e) => {
      duration = e.target.value;
      if (durationVal) durationVal.innerText = `${duration}s`;
      runPlaygroundAnimation();
    });
  }

  const rotSlider = document.getElementById('slider-rotation');
  const rotVal = document.getElementById('val-rotation');
  if (rotSlider) {
    rotSlider.addEventListener('input', (e) => {
      rotation = e.target.value;
      if (rotVal) rotVal.innerText = `${rotation}°`;
      runPlaygroundAnimation();
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', runPlaygroundAnimation);
  }

  targetBox.addEventListener('click', runPlaygroundAnimation);

  // Copy Code to Clipboard
  if (copyBtn && codeOutput) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeOutput.innerText).then(() => {
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = `<span>✓ Copied!</span>`;
        if (copyToast) {
          copyToast.style.opacity = '1';
          copyToast.style.transform = 'translateY(0)';
          setTimeout(() => {
            copyToast.style.opacity = '0';
            copyToast.style.transform = 'translateY(10px)';
          }, 2000);
        }
        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
        }, 1800);
      });
    });
  }

  // Initial draw
  drawEaseGraph(currentEase);
  updateCodeSnippet();
}

/* ==========================================================================
   8. BENTO SPOTLIGHT & 3D TILT ENGINE
   ========================================================================== */
function initBentoSpotlightAndTilt() {
  const cards = document.querySelectorAll('.bento-card, .showcase-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // 3D Tilt calculation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = (y - centerY) / 25;
      const tiltY = -(x - centerX) / 25;

      gsap.to(card, {
        rotationX: tiltX,
        rotationY: tiltY,
        transformPerspective: 1000,
        duration: 0.4,
        ease: 'power1.out',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    });
  });
}

/* ==========================================================================
   9. SCROLL-TRIGGERED STAT COUNTERS
   ========================================================================== */
function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-counter]');

  counters.forEach((counter) => {
    const target = parseFloat(counter.getAttribute('data-counter'));
    const suffix = counter.getAttribute('data-suffix') || '';
    const obj = { val: 0 };

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power3.out',
          onUpdate: () => {
            counter.innerText = (target % 1 === 0 ? Math.floor(obj.val) : obj.val.toFixed(2)) + suffix;
          },
        });
      },
    });
  });
}

/* ==========================================================================
   10. INFINITE MARQUEE WITH SCROLL VELOCITY SKEW
   ========================================================================== */
function initMarqueeVelocity() {
  const marqueeTrack = document.querySelector('.marquee-track');
  if (!marqueeTrack) return;

  // Infinite horizontal scroll
  const marqueeTween = gsap.to(marqueeTrack, {
    xPercent: -50,
    repeat: -1,
    duration: 18,
    ease: 'none',
  });

  // Skew on scroll velocity
  let proxy = { skew: 0 };
  let skewSetter = gsap.quickSetter(marqueeTrack, 'skewX', 'deg');
  let clamp = gsap.utils.clamp(-12, 12);

  ScrollTrigger.create({
    onUpdate: (self) => {
      let skew = clamp(self.getVelocity() / -250);
      if (Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew;
        gsap.to(proxy, {
          skew: 0,
          duration: 0.8,
          ease: 'power3',
          overwrite: true,
          onUpdate: () => skewSetter(proxy.skew),
        });
      }
    },
  });
}

/* ==========================================================================
   11. MAGNETIC ELEMENTS (SMOOTH SPRING INTERACTION)
   ========================================================================== */
function initMagneticElements() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const magneticBtns = document.querySelectorAll('[data-magnetic]');

  magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      gsap.to(btn, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)',
      });
    });
  });
}

/* ==========================================================================
   12. BILINGUAL (AR/EN) & THEME SWITCHER
   ========================================================================== */
function initLanguageAndThemeSwitchers() {
  const langBtn = document.getElementById('btn-lang-toggle');
  const themeBtn = document.getElementById('btn-theme-toggle');

  // Multi-language dictionary
  const i18n = {
    en: {
      badge: '⚡ 2027 HYPER-MOTION ENGINE // GSAP SHOWCASE',
      heroTitle: 'CRAFT DIGITAL EXPERIENCES THAT MOVE',
      heroSubtitle: 'Next-generation web animations crafted with GSAP 3, ScrollTrigger, Lenis smooth motion, and GPU-accelerated micro-interactions.',
      btnExplore: 'Explore Motion Studio',
      btnShowreel: 'Live Playground',
      secShowcaseTag: 'CORE CAPABILITIES',
      secShowcaseTitle: 'ENGINE ARCHITECTURE & PINNED SHOWCASE',
      secShowcaseDesc: 'Explore high-performance timeline pinning, dynamic vector morphing, and fluid layout state transitions.',
      secPlaygroundTag: 'HANDS-ON BENCHMARK',
      secPlaygroundTitle: 'INTERACTIVE EASING & MOTION LAB',
      secPlaygroundDesc: 'Fine-tune animation curves, test real-time physics, and export copy-paste ready GSAP production code.',
      btnCopy: 'Copy GSAP Code',
      secBentoTag: 'WHY IT WINS',
      secBentoTitle: 'BUILT FOR ULTRA-PERFORMANCE',
      secDeployTitle: 'Deploy Ready to GitHub Pages',
      secDeployDesc: 'Zero build steps required. Clean static architecture ready to deploy in under 60 seconds with your own custom domain.',
    },
    ar: {
      badge: '⚡ محرك الحركة الفائق لعام 2027 // معرض GSAP المتقدم',
      heroTitle: 'اصنع تجارب رقمية تأسر الحواس وتتحرك بانسيابية',
      heroSubtitle: 'حركات ويب استعراضية من الجيل القادم مبنية بأقوى تقنيات GSAP 3 والتمرير فائق النعومة وتسريع العتاد الرسومي.',
      btnExplore: 'استكشف استوديو الحركة',
      btnShowreel: 'المختبر التفاعلي',
      secShowcaseTag: 'القدرات البرمجية الأساسية',
      secShowcaseTitle: 'معمارية المحرك واستعراض التمرير الأفقي',
      secShowcaseDesc: 'استمتع بتجربة تثبيت الشاشة وتحويل مسارات التمرير والتحولات الهندسية ذات الإطارات المرتفعة.',
      secPlaygroundTag: 'مختبر التجربة الحية',
      secPlaygroundTitle: 'مختبر منحنيات الحركة والتسارع التفاعلي',
      secPlaygroundDesc: 'تحكم بدقة في منحنيات الحركة الفيزيائية واختبر تأثيراتها فوراً وانسخ كود GSAP الجاهز بضغطة زر.',
      btnCopy: 'نسخ كود GSAP',
      secBentoTag: 'لماذا يتفوق معمارياً؟',
      secBentoTitle: 'مبني لأعلى معدلات الإطارات 120 FPS',
      secDeployTitle: 'جاهز للنشر الفوري على GitHub Pages',
      secDeployDesc: 'بدون أي تعقيدات برمجية أو عمليات بناء سيرفرية. ملفات استاتيكية نقية جاهزة للربط مع دومينك المخصص فوراً.',
    }
  };

  let currentLang = 'ar'; // Default Arabic as requested by user

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      currentLang = currentLang === 'ar' ? 'en' : 'ar';
      document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', currentLang);
      langBtn.querySelector('.lang-label').innerText = currentLang.toUpperCase();

      // Update text contents
      const data = i18n[currentLang];
      document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (data[key]) {
          if (el.hasAttribute('data-scramble')) {
            el.setAttribute('data-scramble', data[key]);
            const scrambler = new TextScrambler(el);
            scrambler.setText(data[key]);
          } else {
            el.innerText = data[key];
          }
        }
      });

      // Refresh ScrollTrigger calculations after text swap
      setTimeout(() => ScrollTrigger.refresh(), 300);
    });
  }

  // Theme Switcher (Dark -> Cyber Neon -> Light)
  const themes = ['dark', 'cyber', 'light'];
  let currentThemeIndex = 0;

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      const theme = themes[currentThemeIndex];
      document.documentElement.setAttribute('data-theme', theme);
      themeBtn.querySelector('.theme-icon').innerText = theme === 'dark' ? '🌙' : theme === 'cyber' ? '⚡' : '☀️';
    });
  }
}
