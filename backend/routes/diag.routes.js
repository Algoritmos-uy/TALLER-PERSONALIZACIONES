const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/diag.controller');

router.get('/diag', ctrl.ping);

module.exports = router;
