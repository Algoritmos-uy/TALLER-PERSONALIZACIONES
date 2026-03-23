/**
 * courses.controller.js
 */
const path = require('path');
const fs   = require('fs');

const DATA_PATH = path.join(__dirname, '../../frontend/data/courses.json');

function readCourses() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

exports.getAll = (_req, res) => {
  try {
    const courses = readCourses();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'No se pudieron cargar los cursos.' });
  }
};

exports.getById = (req, res) => {
  try {
    const courses = readCourses();
    const course  = courses.find(c => c.id === req.params.id);
    if (!course) return res.status(404).json({ error: 'Curso no encontrado.' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el curso.' });
  }
};
