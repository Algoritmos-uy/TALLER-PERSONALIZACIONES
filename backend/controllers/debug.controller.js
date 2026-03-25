// Debug controller removed — left placeholder to avoid module-not-found errors.
// This file previously exposed a /api/debug route for local diagnostics.
// The route has been removed from server routing; keeping this placeholder
// avoids breaking environments that still `require` this file.

exports.ping = async (_req, res) => {
  res.status(410).json({ error: 'Debug endpoint removed' });
};
