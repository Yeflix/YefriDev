// 1. Importaciones directas de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { time } from "node:console";
import { message } from "statuses";

// 2. Tu configuración
const firebaseConfig = {
  apiKey: "AIzaSyB8EfJ1fI6IkV5Hd-BWSBal2X7MQhj8Dhw",
  authDomain: "websiteyefri.firebaseapp.com",
  projectId: "websiteyefri",
  storageBucket: "websiteyefri.firebasestorage.app",
  messagingSenderId: "310062462274",
  appId: "1:310062462274:web:c129df2f6608db7bff84db",
  measurementId: "G-TYKQGK1XH8"
};

// 3. Inicializar la app y la base de datos
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const isTouch = window.matchMedia('(pointer: coarse)').matches;

if (!isTouch) {
  const dot  = document.getElementById('cDot');
  const ring = document.getElementById('cRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function loop() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();
}

/* ── HAMBURGER MENU ── */
const hamburger = document.getElementById('navHamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  // Bloquear scroll del body mientras el menú está abierto
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Cerrar al hacer click en un enlace
document.querySelectorAll('.nav-item-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── PARTICLES ── */
const pc = document.getElementById('particles');

['#ff2235', '#4d6fff', '#6633ff', '#ff6677', '#99aaff'].forEach(color => {
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.className = 'part';
    const size  = Math.random() * 2.5 + 1;
    const dur   = Math.random() * 14 + 9;
    const delay = Math.random() * 14;
    const dx    = (Math.random() - .5) * 180;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${Math.random() * 100}%;
      animation-duration: ${dur}s;
      animation-delay: -${delay}s;
      --dx: ${dx}px;
      opacity: ${Math.random() * .5 + .15};
    `;
    pc.appendChild(p);
  }
});

/* ── REVEAL ON SCROLL ── */
const revealObs = new IntersectionObserver(
  entries => entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 75);
    }
  }),
  { threshold: .1 }
);
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ── TYPED HERO TAG ── */
const tag = document.getElementById('heroTag');
const txt = 'Desarrollador de Software';
let ti = 0;

function type() {
  if (ti < txt.length) {
    tag.textContent = txt.slice(0, ++ti);
    setTimeout(type, 60);
  }
}
setTimeout(type, 600);

/* ── COUNTER ANIMATION ── */
function animNum(el, end, suffix = '') {
  let n = 0;
  const step = Math.ceil(end / 60);
  const interval = setInterval(() => {
    n += step;
    if (n >= end) {
      el.textContent = end + suffix;
      clearInterval(interval);
    } else {
      el.textContent = n + suffix;
    }
  }, 25);
}

const counterEl = document.getElementById('cY');
if (counterEl) {
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animNum(counterEl, 3, '+');
    }
  }, { threshold: .5 }).observe(counterEl);
}/* ── CONTACT FORM (Firebase + EmailJS) ── */
window.handleSend = async function(btn) {
  const form    = btn.closest('.cont-form');
  const nameEl  = form.querySelector('input[type="text"]');
  const emailEl = form.querySelector('input[type="email"]');
  const msgEl   = form.querySelector('textarea');

  if (!nameEl.value.trim() || !emailEl.value.trim() || !msgEl.value.trim()) {
    btn.textContent = '⚠ Completa todos los campos';
    btn.style.background = 'linear-gradient(135deg, #cc6600, #994400)';
    setTimeout(() => {
      btn.textContent = 'Enviar Mensaje →';
      btn.style.background = '';
    }, 2500);
    return;
  }

  btn.textContent = 'Enviando...';
  btn.style.background = 'linear-gradient(135deg, var(--blue), var(--purple))';

  try {
    // 1. Guardar en Firebase Firestore (tu base de datos)
    await addDoc(collection(db, "mensajes"), {
      name: nameEl.value.trim(),
      email: emailEl.value.trim(),
      message: msgEl.value.trim(),
      time: serverTimestamp()
    });

    // 2. Inicializar EmailJS con tu Public Key
    emailjs.init("6k-rsi8D7T4vXo9Xp"); 

    // 3. Enviar el correo notificándote
    // Los nombres de las propiedades (nombre, email, mensaje) 
    // DEBEN coincidir con los que pusiste entre {{ }} en tu plantilla de EmailJS
    await emailjs.send("service_cnmrd5k", "template_c3p1h97", {
      name: nameEl.value.trim(),
      email: emailEl.value.trim(),
      message: msgEl.value.trim()
    });

    // Éxito: Animación verde
    btn.textContent = '✓ Mensaje Enviado';
    btn.style.background = 'linear-gradient(135deg, #00bb55, #008844)';

    setTimeout(() => {
      nameEl.value  = '';
      emailEl.value = '';
      msgEl.value   = '';
      btn.textContent = 'Enviar Mensaje →';
      btn.style.background = '';
    }, 3000);

  } catch (error) {
    console.error('Error en el proceso:', error);
    btn.textContent = '❌ Error al enviar';
    btn.style.background = 'linear-gradient(135deg, #cc0000, #990000)';
    setTimeout(() => {
      btn.textContent = 'Enviar Mensaje →';
      btn.style.background = '';
    }, 3000);
  }
};

/* ── NAV HIGHLIGHT ACTIVO ── */
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  document.querySelectorAll('section[id]').forEach(s => {
    if (window.scrollY >= s.offsetTop - 250) current = s.id;
  });
  navAnchors.forEach(a => {
    const isActive = a.getAttribute('href') === '#' + current;
    a.style.color = isActive ? 'var(--white)' : '';
  });
}, { passive: true });
