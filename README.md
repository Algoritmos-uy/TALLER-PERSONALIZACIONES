# MusaCreativa 🎨✦

> Landing page moderna para emprendimiento de sublimaciones personalizadas e impresión 3D.  
> Construida con HTML5 semántico · CSS (ITCSS) · JavaScript puro (ES Modules) · Express.js

---

## Arranque rápido

### Solo frontend (sin backend)
```bash
# Opción A: abrir directo en el navegador
open frontend/index.html

# Opción B: servidor estático (recomendado para ES Modules)
npx serve frontend
# → http://localhost:3000
```

### Con backend Express
```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env

# 3. (Opcional) Inicializar base de datos SQLite
npm run init-db

# 4. Arrancar en modo desarrollo
npm run dev
# → http://localhost:3000
```

---

## Estructura del proyecto

```
project-root/
│
├── frontend/
│   ├── index.html                  # HTML semántico + ARIA
│   ├── assets/
│   │   ├── images/                 # ← Poné tu imagen hero aquí
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── styles/                     # ITCSS (7 capas)
│   │   ├── settings/_variables.css # Tokens de diseño
│   │   ├── generic/_reset.css      # Reset moderno
│   │   ├── elements/_elements.css  # Estilos base HTML
│   │   ├── objects/_objects.css    # Layouts reutilizables
│   │   ├── components/             # UI components
│   │   │   ├── _header.css
│   │   │   ├── _hero.css
│   │   │   ├── _cards.css
│   │   │   ├── _buttons.css
│   │   │   ├── _modal.css
│   │   │   ├── _chatbot.css
│   │   │   └── _contact.css
│   │   ├── utilities/_utilities.css
│   │   └── main.css                # Entry point con @imports
│   │
│   ├── js/
│   │   ├── main.js                 # Entry point ES Module
│   │   ├── modules/
│   │   │   ├── menu.js             # Hamburger + nav + scroll
│   │   │   ├── modal.js            # Modal accesible con focus trap
│   │   │   ├── chatbot.js          # Musa — UI + respuestas mock
│   │   │   ├── api.js              # Capa fetch (local/backend)
│   │   │   └── utils.js            # debounce, scrollTo, reveal...
│   │   └── components/
│   │       ├── productCard.js      # Template + render con filtros
│   │       ├── courseCard.js       # Template + render dinámico
│   │       └── chatUI.js           # Componente de UI del chat
│   │
│   └── data/
│       ├── products.json           # 6 productos (editable)
│       └── courses.json            # 3 cursos próximamente
│
├── backend/
│   ├── server.js                   # Express entry point
│   ├── routes/                     # products | courses | chatbot
│   ├── controllers/                # Lógica por recurso
│   ├── services/
│   │   ├── ai.service.js           # Mock → Claude API (switchable)
│   │   └── db.service.js           # SQLite lazy-init
│   ├── database/
│   │   ├── init.sql                # Schema + seed data
│   │   └── db.sqlite               # (generado al correr init-db)
│   └── data/knowledge/             # Base de conocimiento para Musa
│       ├── materiales.json
│       └── tecnicas.json
│
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## Personalización rápida

| Qué cambiar | Archivo |
|---|---|
| Colores, tipografía, espaciado | `frontend/styles/settings/_variables.css` |
| Logo y textos del hero | `frontend/index.html` → sección `#inicio` |
| Imagen del hero | `index.html` → reemplazar `.c-hero__img-placeholder` por `<img src="...">` |
| Número de WhatsApp | `index.html` → atributo `href` del botón WhatsApp |
| Embed del mapa | `index.html` → `<iframe>` dentro del modal |
| Dirección y horarios | `index.html` → sección `#contacto` |
| Productos | `frontend/data/products.json` |
| Cursos | `frontend/data/courses.json` |
| Respuestas del chatbot | `frontend/js/modules/chatbot.js` → función `getMockReply` |

---

## Activar IA real en el chatbot (Claude)

1. `npm install @anthropic-ai/sdk`
2. Agregar `ANTHROPIC_API_KEY=sk-ant-...` en `.env`
3. En `backend/services/ai.service.js`:
   - Descomentar el bloque `Anthropic`
   - Cambiar la línea final: `chatMock(message)` → `chatAI(message)`

---

## Activar base de datos SQLite

```bash
npm install better-sqlite3
npm run init-db
```

Luego en los controllers, reemplazar la lectura desde JSON por queries a `db.service.js`.

---

## Tecnologías

| Capa | Tecnología |
|---|---|
| HTML | HTML5 semántico + ARIA |
| CSS | ITCSS (vanilla, sin preprocesador) |
| JS | ES Modules nativos (sin bundler) |
| Backend | Node.js + Express |
| DB | SQLite (better-sqlite3) |
| IA | Anthropic Claude (opcional) |
| Fuentes | Google Fonts: Playfair Display + DM Sans |

---

## Licencia

MIT — Libre para uso personal y comercial.
