/**
 * chatbot.js
 * Musa — UI chatbot mock (sin IA aún)
 * Preparado para conectar con backend via api.js
 */

import { sanitize, formatTime, sleep, tokenizeMessage, truncateText } from './utils.js';
import { api } from './api.js';

const MOCK_RESPONSES = [
  "¡Hola! Soy Musa 🌟 Puedo ayudarte con info sobre nuestros productos, precios y cursos.",
  "Para sublimaciones personalizadas, escribinos también por WhatsApp para ver diseños.",
  "Nuestras impresiones 3D están disponibles en PLA, PETG y más materiales. ¿Qué necesitás?",
  "Los cursos se anuncian próximamente. ¿Querés que te avisemos cuando estén disponibles?",
  "Podés contactarnos por mail o WhatsApp para presupuestos personalizados 🎨",
];

export function initChatbot() {
  const trigger      = document.querySelector('.c-chatbot-trigger');
  const panel        = document.querySelector('.c-chatbot-panel');
  const input        = document.querySelector('.c-chatbot-panel__input');
  const sendBtn      = document.querySelector('.c-chatbot-panel__send');
  const messages     = document.querySelector('.c-chatbot-panel__messages');
  const quickReplies = document.querySelectorAll('.c-quick-reply');

  if (!trigger || !panel) return;

  let isOpen = false;

  // ── Toggle panel ─────────────────────────────────────────────────────────
  trigger.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.classList.toggle('is-open', isOpen);
    trigger.classList.toggle('is-open', isOpen);
    trigger.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) {
      setTimeout(() => input?.focus(), 300);
      scrollMessages();
    }
  });

  // Cerrar desde el footer (botón en la parte inferior del panel)
  const closeBottomBtn = panel.querySelector('.c-chatbot-panel__close-bottom');
  closeBottomBtn?.addEventListener('click', () => {
    isOpen = false;
    panel.classList.remove('is-open');
    trigger.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
  });

  // ── Send on button click ──────────────────────────────────────────────────
  sendBtn?.addEventListener('click', () => {
    sendMessage(input?.value || '');
  });

  // ── Send on Enter (Shift+Enter = nueva línea) ─────────────────────────────
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input.value);
    }
    // Auto-resize textarea
    setTimeout(() => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    }, 0);
  });

  // ── Quick reply buttons ───────────────────────────────────────────────────
  quickReplies.forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.textContent.trim()));
  });

  // ─────────────────────────────────────────────────────────────────────────

  async function sendMessage(text) {
    const trimmed = (text || '').trim();
    if (!trimmed) return;

    appendMessage(trimmed, 'user');
    if (input) {
      input.value = '';
      input.style.height = 'auto';
    }
    sendBtn.disabled = true;

    try {
      // Mostrar indicador de escritura y conservar su wrapper
      const typingWrap = await showTyping();

      // Intentar usar el backend (que a su vez puede usar DeepSeek)
      const res = await api.chat(trimmed);
      const reply = (res && res.reply) ? res.reply : 'Lo siento, no obtuve respuesta.';

      // Reemplazar el indicador por la burbuja y reproducir typing streaming
      await typeReply(typingWrap, reply);

    } catch (err) {
      // Fallback local si hay error de red o servidor
      console.warn('[Chatbot] error al llamar al backend:', err);
      const reply = getMockReply(trimmed);
      // Asegurarnos de mostrarlo con el efecto typing también
      const wrap = await showTyping();
      await typeReply(wrap, reply);
    } finally {
      sendBtn.disabled = false;
      input?.focus();
    }
  }

  function appendMessage(text, role) {
    const div = document.createElement('div');
    div.className = `c-chat-msg c-chat-msg--${role}`;
    div.innerHTML = `
      <div class="c-chat-msg__bubble">${sanitize(text)}</div>
      <span class="c-chat-msg__time">${formatTime()}</span>
    `;
    messages?.appendChild(div);
    scrollMessages();
  }

  // Typing / streaming helper: escribe el texto carácter a carácter dentro del wrapper
  async function typeReply(wrap, text) {
    if (!wrap) {
      // fallback a append normal
      appendMessage(text, 'bot');
      return;
    }

    // Sustituir el contenido del wrapper (que actualmente tiene el indicador)
    wrap.innerHTML = `
      <div class="c-chat-msg__bubble"></div>
      <span class="c-chat-msg__time">${formatTime()}</span>
    `;
    const bubble = wrap.querySelector('.c-chat-msg__bubble');
    if (!bubble) {
      appendMessage(text, 'bot');
      return;
    }

    // Typing effect with support for links and newlines.
    // Tokenize the message into text/link/newline parts so we can safely
    // create DOM nodes and type into them character by character.
    const tokens = tokenizeMessage(text);
    for (const token of tokens) {
      if (token.type === 'text') {
        const chars = Array.from(String(token.content));
        for (let i = 0; i < chars.length; i++) {
          // Append character to a text node for safety
          if (!bubble._textNode) {
            bubble._textNode = document.createTextNode('');
            bubble.appendChild(bubble._textNode);
          }
          bubble._textNode.textContent += chars[i];
          scrollMessages();
          const delay = 8 + Math.random() * 18;
          await sleep(delay);
        }
      } else if (token.type === 'link') {
        // Create anchor element and type its visible text
        const a = document.createElement('a');
        a.href = token.content;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'c-chat-link';
        bubble.appendChild(a);
        // Type the link label (hostname + pathname) readability
        const label = token.content.replace(/^https?:\/\//i, '');
        const short = truncateText(label, 40);
        a.title = token.content; // full URL on hover for accessibility
        a.setAttribute('aria-label', `Abrir enlace: ${token.content}`);
        for (let i = 0; i < short.length; i++) {
          a.textContent += short[i];
          scrollMessages();
          const delay = 8 + Math.random() * 18;
          await sleep(delay);
        }
      } else if (token.type === 'newline') {
        bubble.appendChild(document.createElement('br'));
      }
    }
    // Al terminar, asegurar el timestamp ya está presente
    scrollMessages();
  }

  async function showTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'c-chat-msg c-chat-msg--bot';
    wrap.innerHTML = `
      <div class="c-chat-typing">
        <span></span><span></span><span></span>
      </div>`;
    messages?.appendChild(wrap);
    scrollMessages();
    // Espera inicial antes de comenzar a cargar la respuesta (simula latencia)
    await sleep(600 + Math.random() * 600);
    return wrap;
  }

  function scrollMessages() {
    if (messages) messages.scrollTop = messages.scrollHeight;
  }

  function getMockReply(text) {
    const t = text.toLowerCase();
    if (t.includes('precio') || t.includes('costo') || t.includes('cuánto') || t.includes('cuanto'))
      return "Para presupuestos personalizados lo mejor es escribirnos por WhatsApp 📱 así te cotizamos según tu diseño y cantidad.";
    if (t.includes('curso') || t.includes('aprender') || t.includes('taller'))
      return "¡Muy buena pregunta! Tenemos cursos de sublimación e impresión 3D que se vienen próximamente. ¿Querés que te avisemos cuando abrimos inscripciones? 📚";
    if (t.includes('3d') || t.includes('impresión') || t.includes('impresion') || t.includes('prototipo'))
      return "Hacemos impresiones 3D en PLA, PETG y otros materiales. Piezas funcionales, decorativas y prototipos 🖨️ ¿Tenés archivo STL o necesitás diseño desde cero?";
    if (t.includes('sublimación') || t.includes('sublimacion') || t.includes('remera') || t.includes('taza'))
      return "Las sublimaciones quedan con colores vibrantes y durables 🎨 Hacemos remeras, tazas, almohadas y más. ¿Qué producto te interesa?";
    if (t.includes('hola') || t.includes('buenas') || t.includes('buen día') || t.includes('buen dia'))
      return "¡Hola! 👋 Bienvenido/a a MusaCreativa. Soy Musa, tu asistente virtual. ¿En qué te puedo ayudar hoy?";
    if (t.includes('gracias') || t.includes('perfecto') || t.includes('ok'))
      return "¡De nada! 😊 Si necesitás algo más, acá estoy. También podés contactarnos directamente por WhatsApp para una atención más rápida.";
    if (t.includes('producto') || t.includes('ver'))
      return "Tenemos dos líneas principales: sublimaciones personalizadas (remeras, tazas, almohadas) e impresiones 3D (decorativas, funcionales, prototipos). ¿Por cuál querés empezar?";
    return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
  }
}
