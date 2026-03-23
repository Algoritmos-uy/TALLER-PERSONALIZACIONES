/**
 * courses.routes.js
 */
const express           = require('express');
const router            = express.Router();
const coursesController = require('../controllers/courses.controller');

router.get('/',    coursesController.getAll);
router.get('/:id', coursesController.getById);

module.exports = router;
