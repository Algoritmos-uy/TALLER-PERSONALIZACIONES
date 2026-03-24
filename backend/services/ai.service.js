/**
 * ai.service.js
 * Servicio de IA — preparado para conectar con Claude (Anthropic) u OpenAI
 *
 * Para activar IA real:
 * 1. npm install @anthropic-ai/sdk
 * 2. Agregar ANTHROPIC_API_KEY en .env
 * 3. Descomentar el bloque "Anthropic" abajo
 */

const path = require('path');
const fs   = require('fs');

// ── Knowledge base local ──────────────────────────────────────────────────────
const KB_DIR = path.join(__dirname, '../data/knowledge');

function loadKnowledge() {
  const files  = fs.readdirSync(KB_DIR).filter(f => f.endsWith('.json'));
  const chunks = files.map(f => {
    const data = JSON.parse(fs.readFileSync(path.join(KB_DIR, f), 'utf-8'));
    return JSON.stringify(data);
  });
  return chunks.join('\n\n');
}

// ── Sistema prompt base ───────────────────────────────────────────────────────
function buildSystemPrompt() {
  let knowledge = '';
  try {
    knowledge = loadKnowledge();
  } catch (_) {
    knowledge = 'No hay información adicional cargada aún.';
  }

  return (
    `Sos Musa, la asistente virtual de MusaCreativa, un emprendimiento argentino ` +
    `especializado en sublimaciones personalizadas e impresión 3D. Respondés en español ` +
    `con un tono formal, amable y profesional, pero simpático. ` +
    `Tus respuestas deben ayudar al usuario a encontrar la sección adecuada del sitio ` +
    `(Productos, Cursos, Contacto) según la consulta, y ofrecer orientación relacionada ` +
    `con los servicios y procesos del emprendimiento. ` +
    `
    No inventes información técnica que no figure en la base de conocimiento; si la pregunta ` +
    `requiere precisión o un presupuesto, invitá al usuario a contactarse por WhatsApp o mail. ` +
    `
    Cuando sea apropiado, sugerí la sección pertinente y un llamado a la acción (p.ej. "Ver sección Productos" o "Contactanos por WhatsApp para un presupuesto"). ` +
    `
    === Información del negocio ===\n${knowledge}`
  ).trim();
}

// ── SYSTEM_PROMPT: prompt estricto para Musa (definido por el equipo)
// Sustituye el prompt base para forzar reglas estrictas de respuesta.
const SYSTEM_PROMPT = `Eres “Musa”, una asistente virtual integrada en una aplicación web de personalización de productos mediante sublimación e impresión 3D, así como formación profesional en estas áreas.

### IDENTIDAD
- Tu nombre es Musa.
- Te expresas en femenino.
- Puedes autoreferirte de forma natural cuando corresponda (ej: “puedo ayudarte”, “te recomiendo”, “desde aquí puedo orientarte”).
- Mantienes un tono profesional, amable y cercano.

### CONTEXTO DE NEGOCIO
La aplicación ofrece:
- Personalización por sublimación: prendas, tazas, carteras, bolsas, almohadones y otros productos.
- Impresión 3D: piezas decorativas y funcionales, incluyendo diseños personalizados.
- Cursos de profesionalización en sublimación e impresión 3D.

### OBJETIVO
Tu función es:
1. Responder consultas basadas exclusivamente en el contenido disponible en la página.
2. Orientar al usuario dentro del sitio (secciones, navegación).
3. Incentivar el contacto cuando corresponda (especialmente ante intención comercial o dudas específicas).

### REGLAS ESTRICTAS DE RESPUESTA

1. **Fuente de información**
  - SOLO puedes responder con información presente en la página.
  - NO inventes datos, precios, tiempos, materiales o procesos no especificados.
  - Si la información no está disponible, indícalo claramente.

2. **Fallback controlado**
  - Si el usuario realiza una consulta técnica o general no cubierta en la página:
    - Puedes complementar con conocimiento general (simulando apoyo externo tipo DeepSeek),
    - PERO debes mantener la respuesta alineada a los servicios ofrecidos.
    - NO expandas hacia servicios que la empresa no brinda.

3. **Redirección estratégica**
  - Si el usuario pregunta cómo contactarse:
    - Indica que debe dirigirse a la sección "Contacto".
    - Puedes mencionar WhatsApp o email SOLO si están presentes en la página.
  - Si la consulta requiere cotización o detalles específicos:
    - Sugiere amablemente contactar.

4. **Alcance de respuestas**
  Puedes:
  - Explicar procesos (sublimación, impresión 3D) de forma general.
  - Describir usos, beneficios y aplicaciones.
  - Orientar sobre productos y cursos disponibles.

  No puedes:
  - Inventar servicios nuevos.
  - Dar presupuestos.
  - Confirmar disponibilidad no indicada.
  - Salir del rol de asistente virtual.

5. **Tono y estilo**
  - Formal, amable y profesional.
  - Cercano y claro (ligeramente simpático, sin exagerar).
  - Respuestas concisas pero completas.
  - Evita tecnicismos innecesarios salvo que el usuario los use.

6. **Estructura recomendada**
  - Respuesta directa a la consulta.
  - Breve ampliación (si aplica).
  - Orientación o siguiente paso (navegación o contacto).

7. **Manejo de incertidumbre**
  Si no tienes información:
  - Indica: “Esa información no se encuentra disponible en la página actualmente.”
  - Ofrece alternativa: “Te recomiendo dirigirte a la sección de contacto para obtener más detalles.”

8. **Prioridad**
  1. Contenido del sitio
  2. Claridad y utilidad para el usuario
  3. Conversión (llevar a contacto cuando corresponda)

### EJEMPLOS DE COMPORTAMIENTO

Usuario: "¿Hacen tazas personalizadas?"
Respuesta:
Sí, se ofrecen productos personalizados mediante sublimación, incluyendo tazas. Este proceso permite aplicar diseños únicos y duraderos. Si querés, puedo orientarte sobre cómo solicitar una.

Usuario: "¿Cuánto cuesta una remera?"
Respuesta:
Esa información no se encuentra disponible en la página actualmente. Te recomiendo dirigirte a la sección de contacto para recibir un presupuesto personalizado.

Usuario: "¿Cómo los contacto?"
Respuesta:
Podés comunicarte a través de la sección "Contacto" de la página, donde encontrarás las vías disponibles como WhatsApp o correo electrónico. Desde allí van a poder asesorarte directamente.

Usuario: "¿Qué es la sublimación?"
Respuesta:
La sublimación es una técnica de impresión que permite transferir diseños a distintos materiales mediante calor, logrando acabados duraderos y de alta calidad. Aquí se utiliza para personalizar diversos productos.`;

// ── (Opcional) Implementación real con Anthropic ──────────────────────────────
/*
const Anthropic = require('@anthropic-ai/sdk');
const client    = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function chatAI(message) {
  const response = await client.messages.create({
    model:      'claude-opus-4-5',
    max_tokens: 300,
    system:     buildSystemPrompt(),
    messages:   [{ role: 'user', content: message }],
  });
  return response.content[0].text;
}
*/

// Helper: detect explicit 'remeras por cantidad' + 'presupuesto' intent in payload (string or conversation)
function isRemerasBulkBudget(input) {
  let text = '';
  if (!input) return false;
  if (Array.isArray(input)) {
    // join user messages
    text = input.filter(m => m && m.role === 'user').map(m => String(m.content || '')).join(' ');
  } else {
    text = String(input || '');
  }
  const lower = text.toLowerCase();
  // Also accept direct "cómo pido presupuesto" style queries
  const howToBudget = /\b(como pido presupuesto|cómo pido presupuesto|como pido un presupuesto|cómo pido un presupuesto|como hago para pedir presupuesto|cómo hago para pedir presupuesto|como pedir un presupuesto|cómo pedir un presupuesto)\b/i;
  return (
    (/(remera|remeras)/i.test(lower) && /\b(cantidad|por cantidad|por mayor|mayor|bulk)\b/i.test(lower) && /\b(presupuest|presupuesto|cotiz)\b/i.test(lower))
    || howToBudget.test(lower)
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
exports.chat = async (message) => {
  // Pre-check: si la intención es pedir presupuesto por remeras en cantidad,
  // devolver la frase fija inmediatamente.
  if (isRemerasBulkBudget(message)) {
    return 'Las sublimaciones quedan con colores vibrantes y durables 🎨 Hacemos remeras, tazas, almohadas y más. ¿Qué producto te interesa?';
  }

  // Si se configuró DEEPSEEK_API_KEY, intentar usar DeepSeek; si falla, devolver un
  // mensaje de error controlado.
  if (process.env.DEEPSEEK_API_KEY) {
    try {
      return await chatDeepSeek(message);
    } catch (err) {
      console.warn('[AI] DeepSeek error:', err.message);
      return 'Lo siento, en este momento no puedo generar la respuesta. Intentá nuevamente más tarde o contactanos desde la sección Contacto.';
    }
  }
  // Si no hay proveedor configurado, devolver un mensaje claro para el frontend
  return 'La IA no está configurada en el servidor. Por favor, configurá DEEPSEEK_API_KEY en .env para habilitar respuestas generadas por IA.';
};

// ---------------------------------------------------------------------------
// DeepSeek integration (opcional)
// - Usa la variable DEEPSEEK_API_KEY desde .env
// - Llamada genérica POST a la API (ajusta URL/shape según la especificación real)
// ---------------------------------------------------------------------------
async function chatDeepSeek(message) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY no está configurada');

  const url = 'https://api.deepseek.com/chat/completions'; // Endpoint según especificación de DeepSeek

    // Construir messages[] con el sistema + conversación en formato {role, content}
    const systemText = (SYSTEM_PROMPT && SYSTEM_PROMPT.trim().length) ? SYSTEM_PROMPT : buildSystemPrompt();
    const messages = [{ role: 'system', content: String(systemText) }];

    if (Array.isArray(message)) {
      // Si recibimos un array de mensajes, respetar roles y contenidos
      for (const m of message) {
        if (!m) continue;
        const role = m.role ? String(m.role) : 'user';
        const content = m.content != null ? String(m.content) : '';
        messages.push({ role, content });
      }
    } else {
      messages.push({ role: 'user', content: String(message || '') });
    }

    // Construir payload con el modelo indicado por .env o usar 'deepseek-chat' por defecto
    const modelName = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
    const payload = {
      model: modelName,
      messages,
      max_tokens: 300,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`DeepSeek API error ${res.status}: ${text}`);
    }

    const data = await res.json();

  // Extraer texto de la respuesta — manejar varios formatos posibles robustamente
  // Prioridad: data.reply | data.output.text | choices[].message.content | choices[].text
  let reply = null;
  if (data.reply) reply = data.reply;
  else if (data.output && data.output.text) reply = data.output.text;
  else if (Array.isArray(data.choices) && data.choices.length) {
    const first = data.choices[0];
    if (first.message && first.message.content) reply = first.message.content;
    else if (first.text) reply = first.text;
  }

  // Algunas APIs nestean la respuesta en data.choices[0].message.content[0]
  if (!reply && data.choices && data.choices[0] && data.choices[0].message && Array.isArray(data.choices[0].message.content)) {
    reply = data.choices[0].message.content.join('\n');
  }

  if (!reply) {
    return 'Lo siento, no pude generar una respuesta en este momento.';
  }

  return String(reply).trim();
}
