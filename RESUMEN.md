# Resumen UI / UX — MusaCreativa

Fecha: 24 de marzo de 2026

Este documento resume exclusivamente las decisiones, componentes y comportamientos de interfaz y experiencia de usuario implementados en la aplicación.

## Principales áreas de UI / UX

- Tema (dark / light)
  - Toggle en el header que activa `data-theme="light"` para cambiar variables CSS globales.
  - Todas las reglas de componentes reutilizan variables CSS (`--color-*`), por lo que el diseño adapta colores y contraste de forma consistente entre temas.

- Cabecera y navegación
  - Logo con enlace al inicio y navegación principal responsive.
  - Toggle de tema con icono y estados accesibles (`aria-pressed`, `title`).
  - Menú hamburger para mobile con aria-expanded controlado por JS.

- Chatbot (Musa) — interacción principal
  - Lanzador flotante (`.c-chatbot-trigger`) con badge de notificación; se oculta/animada cuando el panel está abierto.
  - Panel fijo (`.c-chatbot-panel`) con entrada accessible, historial con role=log y aria-live="polite".
  - Header de panel con avatar, nombre y estado (dot animado) para dar confianza y presencia.
  - Mensajería:
    - Burbujas diferenciadas por rol (`c-chat-msg--user`, `c-chat-msg--bot`) con estilos y timestamps.
    - Indicador de escritura animado (`.c-chat-typing`) para simular latencia y mantener expectativa.
    - Efecto de escritura por caracteres (typing streaming) que inserta texto seguro y respeta enlaces y saltos de línea.
    - Render seguro de enlaces: los links abren en nueva pestaña con `rel="noopener noreferrer"` y tienen título/aria-label.
  - Input:
    - Textarea con auto-resize, maxlength, y envío con Enter (Shift+Enter = newline).
    - Botón enviar con estado `disabled` durante petición y feedback visual.
  - Quick replies: botones sugeridos para acelerar la interacción.
  - Footer del panel:
    - Botón "Vaciar chat": confirma acción, borra historial y limpia `sessionStorage`.
    - Botón "Cerrar chat": cierra el panel; ambos botones usan variables para respetar temas y comparten comportamiento hover/disabled.

- Manejo de errores y fallback UX
  - En caso de fallo de red/servidor, no se usan respuestas mock automáticas; en su lugar se muestra una burbuja de error con dos acciones claras:
    - "Reintentar": reenvía el mensaje (mantiene UX consistente mostrando la burbuja de usuario y reintentando la petición).
    - "Usar respuestas locales": muestra una respuesta mock local con el mismo efecto de typing para no romper la experiencia.
  - El mensaje de error explica el problema y sugiere la sección "Contacto" como alternativa.

- Persistencia y usabilidad
  - Conversación persistida en `sessionStorage` (clave `musa_conversation`) para restaurar estado en recargas.
  - El botón "Vaciar chat" borra también la persistencia.
  - Los elementos interactivos incluyen atributos ARIA relevantes y focos lógicos (focus on open).

- Cards de cursos (micro-interacción)
  - Icono configurable: ahora acepta imágenes desde `assets/courses/` o una ruta explícita (`image` en JSON).
  - Si existe imagen, se utiliza un `<picture>` para servir AVIF/WebP/PNG y la imagen ocupa el contenedor (object-fit: cover).
  - Si la imagen falla, se muestra un fallback emoji; esto mantiene consistencia visual y evita huecos.
  - Hover en la card tiene ligero lift (translateY) y acento de color en la barra superior para indicar interactividad.

## Accesibilidad y ARIA (resumen)

- Se usan roles (banner, navigation, dialog, log) y atributos `aria-*` en controles clave.
- El chat tiene `aria-live="polite"` y `aria-relevant="additions"` para que lectores de pantalla detecten nuevos mensajes.
- Botones y controles incluyen labels descriptivos (`aria-label`) y estados (`aria-expanded`, `aria-pressed`).

## Comportamiento por temas (consistencia)

- Se priorizó usar variables CSS para que colores, bordes y hover respondan automáticamente al tema activo.
- El nuevo botón "Vaciar chat" replica el comportamiento hover y contraste del botón "Cerrar chat" para mantener consistencia visual entre acciones relacionadas.

## Recomendaciones UX futuras (priorizadas)

1. Añadir un focus trap y control de teclado en el panel de chat para mejorar la experiencia de teclado y lectores de pantalla.
2. Refactorizar el fallback de carga de imágenes para evitar `onerror` inline y manejar el fallback desde JS (mejor testabilidad y separación de responsabilidades).
3. Añadir micro-animaciones accesibles (prefers-reduced-motion) para reducir movimiento en usuarios sensibles.
4. Probar con usuarios reales el flujo "remeras + presupuesto" para asegurar que la respuesta determinista cumple objetivos de conversión.

---

Archivo actualizado: `RESUMEN.md` (UI/UX only).
