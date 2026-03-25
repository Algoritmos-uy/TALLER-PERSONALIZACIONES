const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/debug.controller');

router.get('/diag', ctrl.ping);

module.exports = router;
