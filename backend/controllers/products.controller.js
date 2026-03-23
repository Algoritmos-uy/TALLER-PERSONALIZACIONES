/**
 * products.controller.js
 * Lee de /frontend/data/products.json (luego migrar a DB)
 */
const path = require('path');
const fs   = require('fs');

const DATA_PATH = path.join(__dirname, '../../frontend/data/products.json');

function readProducts() {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

exports.getAll = (_req, res) => {
  try {
    const products = readProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'No se pudieron cargar los productos.' });
  }
};

exports.getById = (req, res) => {
  try {
    const products = readProducts();
    const product  = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
};
