/**
 * chatUI.js
 * Componente de UI puro para el chat — separado de la lógica del chatbot
 * Puede reutilizarse con cualquier backend
 */

import { sanitize, formatTime } from '../modules/utils.js';

/**
 * Crea un mensaje de chat
 * @param {string} text
 * @param {'bot'|'user'} role
 * @returns {HTMLElement}
 */
export function createMessageEl(text, role) {
  const div = document.createElement('div');
  div.className = `c-chat-msg c-chat-msg--${role}`;
  div.innerHTML = `
    <div class="c-chat-msg__bubble">${sanitize(text)}</div>
    <span class="c-chat-msg__time">${formatTime()}</span>
  `;
  return div;
}

/**
 * Crea el indicador de "escribiendo..."
 * @returns {HTMLElement}
 */
export function createTypingEl() {
  const div = document.createElement('div');
  div.className = 'c-chat-msg c-chat-msg--bot';
  div.setAttribute('aria-label', 'Musa está escribiendo...');
  div.innerHTML = `
    <div class="c-chat-typing" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>`;
  return div;
}

/**
 * Hace scroll al final del contenedor de mensajes
 * @param {HTMLElement} container
 */
export function scrollToBottom(container) {
  if (container) container.scrollTop = container.scrollHeight;
}
