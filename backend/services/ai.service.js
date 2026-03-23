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

// ── Implementación actual: mock (sin IA) ──────────────────────────────────────
async function chatMock(message) {
  const m = String(message || '').toLowerCase();

  // Productos / catálogo
  if (m.match(/producto|productos|ver|catálogo|catalogo|tienda/)) {
    return (
      'En nuestra sección "Productos" encontrarás las líneas principales: sublimaciones personalizadas ' +
      '(remeras, tazas, almohadas) y piezas impresas en 3D. ' +
      'Si querés ver ejemplos y opciones de materiales, visitá la sección Productos y, si preferís, ' +
      'podemos enviarte un presupuesto personalizado por WhatsApp o email.'
    );
  }

  // Presupuestos / precio
  if (m.match(/precio|costo|presupuesto|cotiz|cuánto|cuanto/)) {
    return (
      'Para darte un precio justo necesitamos algunos detalles (producto, tamaño, cantidad, diseño). ' +
      'Te recomiendo la sección Productos para elegir el artículo y luego contactarnos por WhatsApp para ' +
      'un presupuesto rápido y personalizado. Estamos disponibles para asesorarte en el material y acabado.'
    );
  }

  // Cursos
  if (m.match(/curso|taller|formaci/)) {
    return (
      'Ofrecemos cursos y talleres sobre sublimación e impresión 3D. En la sección Cursos encontrarás ' +
      'la información general y las próximas fechas. Si querés, dejanos tu contacto y te avisamos cuando abramos inscripciones.'
    );
  }

  // Impresión 3D / materiales
  if (m.match(/3d|impresi|impresion|material|pla|petg|filamento/)) {
    return (
      'Trabajamos con impresiones 3D para piezas decorativas y funcionales, usando PLA, PETG y otros materiales. ' +
      'Si tenés un archivo o un requerimiento específico, podés consultar en la sección Productos o escribirnos por WhatsApp para evaluar viabilidad y tiempos.'
    );
  }

  // Sublimación / técnicas
  if (m.match(/sublima|sublimación|remera|taza|tazas|tela|textil/)) {
    return (
      'La sublimación es ideal para piezas con colorido y detalle (remeras, tazas, almohadones). ' +
      'En la sección Productos verás ejemplos y acabados; si querés un diseño personalizado, coordinamos por WhatsApp para avanzar con el arte y la producción.'
    );
  }

  // Contacto / ubicación / horario
  if (m.match(/contacto|contactar|whatsapp|mail|correo|ubicaci|direcci|horario/)) {
    return (
      'Podés contactarnos por WhatsApp para respuestas rápidas o por email para consultas más detalladas. ' +
      'Revisá la sección Contacto donde encontrarás los enlaces directos y el formulario. Respondemos en menos de 24 horas.'
    );
  }

  // Si la consulta parece genérica o fuera de los temas, orientar hacia secciones útiles
  if (m.length < 120) {
    return (
      'Podés preguntarme sobre nuestros productos, cursos o cómo contactarnos. ' +
      'Si me decís qué necesitas (por ejemplo: "presupuesto de tazas" o "cursos de sublimación"), te oriento a la sección adecuada y te doy más detalles.'
    );
  }

  // Default: respuesta abierta, orientativa y amable
  return (
    'Gracias por tu consulta. Puedo orientarte sobre nuestros productos, cursos y opciones de contacto. ' +
    'Si querés, decime específicamente qué buscas (producto, curso o presupuesto) y te doy la guía correspondiente o te explico los siguientes pasos.'
  );
}

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

// ── Export ────────────────────────────────────────────────────────────────────
exports.chat = async (message) => {
  // Si se configuró DEEPSEEK_API_KEY, intentar usar DeepSeek; si falla, caer al mock
  if (process.env.DEEPSEEK_API_KEY) {
    try {
      return await chatDeepSeek(message);
    } catch (err) {
      console.warn('[AI] DeepSeek error, fallback a mock:', err.message);
      return chatMock(message);
    }
  }
  // Por defecto: mock
  return chatMock(message);
};

// ---------------------------------------------------------------------------
// DeepSeek integration (opcional)
// - Usa la variable DEEPSEEK_API_KEY desde .env
// - Llamada genérica POST a la API (ajusta URL/shape según la especificación real)
// ---------------------------------------------------------------------------
async function chatDeepSeek(message) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY no está configurada');

  const url = 'https://api.deepseek.ai/v1/chat'; // Punto de entrada hipotético
  const payload = {
    model: 'deepseek-1',
    system: buildSystemPrompt(),
    input: message,
    max_tokens: 300,
  };

  // Usar fetch global (Node >=18)
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
    // timeout/policies podrían añadirse según necesidades
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`DeepSeek API error ${res.status}: ${text}`);
  }

  const data = await res.json();

  // Extraer texto de la respuesta — varias APIs usan formatos distintos.
  // Priorizar campos comunes: data.reply, data.output.text, data.choices[0].message.content
  const reply = data.reply || data.output?.text || data.choices?.[0]?.message?.content || data.choices?.[0]?.text;
  if (!reply) {
    // Si la respuesta no tiene el formato esperado, devolver un fallback legible
    return 'Lo siento, no pude generar una respuesta en este momento.';
  }

  // Normalizar y retornar
  return String(reply).trim();
}
