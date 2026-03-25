/**
 * debug.controller.js
 * Ruta de diagnóstico temporal para comprobar si la app ve la clave y puede
 * alcanzar la API externa. No expone la clave.
 */
const fetch = global.fetch || require('node-fetch');

exports.ping = async (req, res) => {
  try {
    const hasKey = !!process.env.DEEPSEEK_API_KEY;

    // Intento rápido de conectar a la URL base de DeepSeek (HEAD)
    let deepseek = { ok: null, status: null, error: null };
    try {
      const r = await fetch('https://api.deepseek.com', { method: 'HEAD', redirect: 'follow' });
      deepseek.ok = r.ok;
      deepseek.status = r.status;
    } catch (e) {
      deepseek.error = String(e.message || e);
    }

    return res.json({ hasKey, deepseek });
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) });
  }
};
