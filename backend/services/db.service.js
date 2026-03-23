/**
 * db.service.js
 * Servicio de base de datos — SQLite via better-sqlite3
 * Para activar: npm install better-sqlite3
 */

const path = require('path');

const DB_PATH = path.join(__dirname, '../database/db.sqlite');

let db = null;

/**
 * Inicializa la conexión a SQLite
 * Llamar una vez al arranque del servidor
 */
function connect() {
  try {
    const Database = require('better-sqlite3');
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    console.log('✅ Base de datos SQLite conectada');
    return db;
  } catch (err) {
    console.warn('⚠️  SQLite no disponible (better-sqlite3 no instalado):', err.message);
    return null;
  }
}

/**
 * Retorna la instancia de la DB (lazy init)
 */
function getDb() {
  if (!db) connect();
  return db;
}

/**
 * Ejecuta una query de lectura (SELECT)
 * @param {string} sql
 * @param {any[]}  params
 */
function query(sql, params = []) {
  const database = getDb();
  if (!database) throw new Error('Base de datos no disponible');
  return database.prepare(sql).all(...params);
}

/**
 * Ejecuta una query de escritura (INSERT/UPDATE/DELETE)
 * @param {string} sql
 * @param {any[]}  params
 */
function run(sql, params = []) {
  const database = getDb();
  if (!database) throw new Error('Base de datos no disponible');
  return database.prepare(sql).run(...params);
}

module.exports = { connect, getDb, query, run };
