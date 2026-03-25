// Debug routes removed — placeholder router to avoid import errors.
const express = require('express');
const router = express.Router();

router.get('/diag', (_req, res) => res.status(410).json({ error: 'Debug routes removed' }));

module.exports = router;
