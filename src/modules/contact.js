import { SITE } from '../data/site.js';
import { icon } from './icons.js';

export function initContact(form) {
  const status = form.querySelector('[data-status]');
  const btn = form.querySelector('button[type="submit"]');
  const label = btn.innerHTML;
  const fields = [...form.querySelectorAll('input, textarea')];
  fields.forEach((f) => f.addEventListener('input', () => f.removeAttribute('aria-invalid')));

  const say = (msg, kind = '') => {
    status.textContent = msg;
    status.className = 'form__status ' + kind;
  };
  const reset = () => setTimeout(() => { btn.innerHTML = label; btn.disabled = false; }, 3200);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const bad = fields.filter((f) => !f.value.trim() || (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim())));
    fields.forEach((f) => f.setAttribute('aria-invalid', String(bad.includes(f))));
    if (bad.length) {
      say(bad[0].type === 'email' && bad[0].value.trim() ? 'Revisa tu email: parece incompleto.' : 'Completa los campos marcados.', 'is-err');
      bad[0].focus();
      return;
    }
    say('');
    btn.disabled = true;
    const { endpoint, telegramUser } = SITE.contact;

    try {
      if (endpoint) {
        btn.textContent = 'Enviando…';
        const r = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(d),
        });
        if (!r.ok) throw new Error('http ' + r.status);
        form.reset();
        btn.innerHTML = icon('check') + ' Mensaje enviado';
        say('¡Listo! Te responderé pronto.', 'is-ok');
      } else {
        // Sin backend: copia el mensaje y abre Telegram (honesto: no finge un envío).
        const text = `Hola YefriDev, soy ${d.name} (${d.email}).\n\n${d.message}`;
        try { await navigator.clipboard.writeText(text); } catch { /* noop */ }
        window.open(`https://t.me/${telegramUser}`, '_blank', 'noopener');
        btn.innerHTML = icon('check') + ' Abriendo Telegram';
        say('Mensaje copiado: pégalo en el chat de Telegram que se abrió.', 'is-ok');
      }
    } catch {
      say('No se pudo enviar. Escríbeme por Telegram o GitHub.', 'is-err');
      btn.innerHTML = label;
      btn.disabled = false;
      return;
    }
    reset();
  });
}
