// diag.controller.js
// Ruta de diagnóstico para comprobar presencia de clave y conectividad a DeepSeek.
exports.ping = async (_req, res) => {
  const hasEnvKey = !!process.env.DEEPSEEK_API_KEY;
  // Intentar detectar un cliente fetch disponible (undici / node-fetch / global)
  let fetchImpl = (typeof fetch !== 'undefined') ? fetch : null;
  let fetchPkg = null;
  if (!fetchImpl) {
    try { fetchPkg = require('undici'); fetchImpl = fetchPkg.fetch; } catch (e) {}
    if (!fetchImpl) {
      try { const nf = require('node-fetch'); fetchImpl = (nf && (nf.default || nf)); } catch (e) {}
    }
  }

  const diagnostics = { hasEnvKey, fetchAvailable: !!fetchImpl };

  if (fetchImpl) {
    try {
      const r = await fetchImpl('https://api.deepseek.com', { method: 'HEAD' });
      diagnostics.deepseek = { ok: r.ok, status: r.status };
    } catch (e) {
      diagnostics.deepseek = { error: String(e.message || e) };
    }
  }

  // No mostramos la clave en la respuesta por seguridad.
  return res.json(diagnostics);
};
