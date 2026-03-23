/**
 * chatbot.controller.js
 * Proxy hacia ai.service — responde mensajes del chat
 * Preparado para conectar con Claude/OpenAI en ai.service.js
 */
const aiService = require('../services/ai.service');

exports.reply = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'El campo "message" es requerido.' });
    }

    const reply = await aiService.chat(message.trim());
    res.json({ reply });

  } catch (err) {
    console.error('[Chatbot]', err.message);
    res.status(500).json({ error: 'Error al procesar el mensaje.' });
  }
};
