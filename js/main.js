/* ═══════════════════════════════════════════════
   TEMA — escuro por padrão
   ═══════════════════════════════════════════════ */
const html = document.documentElement;
const saved = localStorage.getItem('etudes-theme');
if (saved === 'light') html.classList.add('light');

/* ═══════════════════════════════════════════════
   SPLIT TEXT — manifesto word-by-word
   ═══════════════════════════════════════════════ */
const manifesto = document.getElementById('manifestoText');

manifesto.innerHTML = manifesto.innerHTML.replace(
  /(<em>.*?<\/em>|[^\s<]+)/g,
  (match) => {
    if (match.startsWith('<em>')) {
      const inner = match.replace(/<\/?em>/g, '');
      return '<em>' + inner.split(/\s+/).map(w => `<span class="word">${w}</span>`).join(' ') + '</em>';
    }
    return `<span class="word">${match}</span>`;
  }
);

/* ═══════════════════════════════════════════════
   LENIS — smooth scroll
   ═══════════════════════════════════════════════ */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ═══════════════════════════════════════════════
   CURSOR CUSTOMIZADO
   ═══════════════════════════════════════════════ */
const cursor = document.getElementById('cursor');

if (window.matchMedia('(pointer: fine)').matches) {
  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    curX += (mouseX - curX) * 0.5;
    curY += (mouseY - curY) * 0.5;
    cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.addEventListener('mouseover', (e) => {
    const hoverable = e.target.closest('a, button, article, .tag, .marquee-item');
    if (hoverable) {
      cursor.classList.add('hover');
    } else {
      cursor.classList.remove('hover');
    }
  });
}

/* ═══════════════════════════════════════════════
   WORD REVEAL — manifesto via GSAP
   ═══════════════════════════════════════════════ */
gsap.utils.toArray('.word').forEach(word => {
  gsap.to(word, {
    opacity: 1,
    filter: 'blur(0px)',
    duration: 1.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: word,
      start: 'top 75%',
      end: 'top 45%',
      scrub: false,
      toggleActions: 'play none none reverse',
    }
  });
});

/* ═══════════════════════════════════════════════
   FRAME SEQUENCE — canvas adaptado ao tema
   ═══════════════════════════════════════════════ */
const seqCanvas = document.getElementById('seqCanvas');
const seqCtx = seqCanvas.getContext('2d');
const frameCountEl = document.getElementById('frameCount');
const TOTAL_FRAMES = 120;

function isLightMode() {
  return document.documentElement.classList.contains('light');
}

function drawFrame(frame) {
  const f = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frame)));
  const w = seqCanvas.width;
  const h = seqCanvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const light = isLightMode();

  seqCtx.clearRect(0, 0, w, h);

  const t = f / (TOTAL_FRAMES - 1);
  const angle = t * Math.PI * 2;

  const glow = seqCtx.createRadialGradient(cx, cy, w * 0.2, cx, cy, w * 0.5);
  glow.addColorStop(0, light ? 'rgba(180, 60, 60, 0.12)' : 'rgba(180, 60, 60, 0.2)');
  glow.addColorStop(1, 'rgba(180, 60, 60, 0)');
  seqCtx.fillStyle = glow;
  seqCtx.fillRect(0, 0, w, h);

  const r = w * 0.3;
  const lightX = cx + Math.cos(angle) * r * 0.5;
  const lightY = cy - Math.sin(angle * 0.5) * r * 0.4;

  const sphereGrad = seqCtx.createRadialGradient(lightX, lightY, r * 0.1, cx, cy, r);
  sphereGrad.addColorStop(0, light ? '#fff5e6' : '#f4d5a0');
  sphereGrad.addColorStop(0.3, '#d35f3a');
  sphereGrad.addColorStop(0.7, '#4a1822');
  sphereGrad.addColorStop(1, light ? '#2a0a10' : '#120408');

  seqCtx.beginPath();
  seqCtx.arc(cx, cy, r, 0, Math.PI * 2);
  seqCtx.fillStyle = sphereGrad;
  seqCtx.fill();

  seqCtx.strokeStyle = light
    ? 'rgba(30, 10, 5, 0.2)'
    : 'rgba(242, 239, 233, 0.18)';
  seqCtx.lineWidth = 1.5;

  for (let i = 0; i < 10; i++) {
    const phase = angle + (i / 10) * Math.PI * 2;
    const visible = Math.cos(phase);
    if (visible < 0) continue;
    seqCtx.globalAlpha = visible * 0.5;
    seqCtx.beginPath();
    seqCtx.ellipse(cx, cy, Math.abs(Math.cos(phase)) * r, r, 0, 0, Math.PI * 2);
    seqCtx.stroke();
  }
  seqCtx.globalAlpha = 1;

  const tilt = Math.sin(angle * 0.5) * 0.3;
  seqCtx.strokeStyle = light
    ? 'rgba(30, 10, 5, 0.25)'
    : 'rgba(242, 239, 233, 0.3)';
  seqCtx.lineWidth = 2;
  seqCtx.beginPath();
  seqCtx.ellipse(cx, cy, r, r * (0.12 + Math.abs(tilt)), tilt, 0, Math.PI * 2);
  seqCtx.stroke();

  const spec = seqCtx.createRadialGradient(lightX, lightY, 0, lightX, lightY, r * 0.35);
  spec.addColorStop(0, 'rgba(255, 240, 220, 0.7)');
  spec.addColorStop(1, 'rgba(255, 240, 220, 0)');
  seqCtx.beginPath();
  seqCtx.arc(cx, cy, r, 0, Math.PI * 2);
  seqCtx.fillStyle = spec;
  seqCtx.fill();

  const rim = seqCtx.createRadialGradient(cx, cy, r * 0.92, cx, cy, r * 1.05);
  rim.addColorStop(0, 'rgba(212, 90, 80, 0.4)');
  rim.addColorStop(1, 'rgba(212, 90, 80, 0)');
  seqCtx.beginPath();
  seqCtx.arc(cx, cy, r * 1.05, 0, Math.PI * 2);
  seqCtx.fillStyle = rim;
  seqCtx.fill();

  frameCountEl.textContent = String(f).padStart(3, '0');
}

drawFrame(0);

gsap.to({ frame: 0 }, {
  frame: TOTAL_FRAMES - 1,
  ease: 'none',
  scrollTrigger: {
    trigger: '.sequence',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.5,
  },
  onUpdate: function () {
    drawFrame(this.targets()[0].frame);
  }
});

/* ═══════════════════════════════════════════════
   SPLIT ITEMS — reveal com GSAP
   ═══════════════════════════════════════════════ */
gsap.utils.toArray('.split-item').forEach(item => {
  gsap.fromTo(item,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        end: 'top 60%',
        scrub: false,
        toggleActions: 'play none none reverse',
      }
    }
  );
});

/* ═══════════════════════════════════════════════
   MENU FULLSCREEN
   ═══════════════════════════════════════════════ */
const navToggle = document.getElementById('navToggle');
const menu = document.getElementById('menu');
const menuLinks = document.querySelectorAll('.menu-link');

navToggle.addEventListener('click', () => {
  const isOpen = menu.classList.contains('open');
  menu.classList.toggle('open');
  document.body.classList.toggle('menu-open');
  if (isOpen) {
    lenis.start();
  } else {
    lenis.stop();
  }
});

menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
    lenis.start();
  });
});

/* ═══════════════════════════════════════════════
   THEME TOGGLE — dois botões sincronizados
   ═══════════════════════════════════════════════ */
function applyTheme(isLight) {
  if (isLight) {
    html.classList.add('light');
  } else {
    html.classList.remove('light');
  }
  localStorage.setItem('etudes-theme', isLight ? 'light' : 'dark');
  drawFrame(parseInt(frameCountEl.textContent) || 0);
}

document.getElementById('themeToggle').addEventListener('click', () => {
  applyTheme(!html.classList.contains('light'));
});

document.getElementById('themeToggleNav').addEventListener('click', () => {
  applyTheme(!html.classList.contains('light'));
});

console.log(
  '%cÉtudes Vol.02',
  'font: 200 24px Georgia,serif; color: oklch(62% 0.18 18)'
);
console.log(
  '%cBuilt with vanilla JS + GSAP + Lenis + modern CSS',
  'color: #888; font: 11px monospace'
);
