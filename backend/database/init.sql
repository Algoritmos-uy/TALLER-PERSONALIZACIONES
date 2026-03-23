-- =============================================================================
-- init.sql — Esquema inicial de MusaCreativa
-- Ejecutar con: sqlite3 database/db.sqlite < database/init.sql
-- =============================================================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- Productos
CREATE TABLE IF NOT EXISTS products (
  id          TEXT PRIMARY KEY,
  category    TEXT NOT NULL CHECK(category IN ('sublimacion','impresion3d')),
  title       TEXT NOT NULL,
  description TEXT,
  image       TEXT,
  icon        TEXT,
  tag         TEXT,
  price       TEXT DEFAULT 'Consultar',
  active      INTEGER DEFAULT 1,
  created_at  TEXT DEFAULT (datetime('now'))
);

-- Cursos
CREATE TABLE IF NOT EXISTS courses (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  icon        TEXT,
  duration    TEXT,
  modality    TEXT CHECK(modality IN ('Presencial','Online','Híbrido')),
  description TEXT,
  status      TEXT DEFAULT 'proximamente',
  active      INTEGER DEFAULT 1,
  created_at  TEXT DEFAULT (datetime('now'))
);

-- Mensajes del chatbot (para analytics / historial)
CREATE TABLE IF NOT EXISTS chat_logs (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT,
  role       TEXT CHECK(role IN ('user','bot')),
  message    TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_chat_logs_session ON chat_logs(session_id);

-- =============================================================================
-- Seed data inicial
-- =============================================================================
INSERT OR IGNORE INTO products VALUES
  ('sub-001','sublimacion','Remeras Personalizadas','Diseños únicos sobre telas de alta calidad.',NULL,'👕','Sublimación','Consultar',1,datetime('now')),
  ('sub-002','sublimacion','Tazas & Tumblers','Sublimación envolvente de 360°, resistente al lavavajillas.',NULL,'☕','Sublimación','Consultar',1,datetime('now')),
  ('sub-003','sublimacion','Almohadas & Cojines','Estampados personalizados para decoración del hogar.',NULL,'🛋️','Sublimación','Consultar',1,datetime('now')),
  ('imp-001','impresion3d','Figuras Decorativas','Modelos 3D únicos, alta definición en PLA y PETG.',NULL,'🏺','Impresión 3D','Consultar',1,datetime('now')),
  ('imp-002','impresion3d','Piezas Funcionales','Repuestos y organizadores a medida con tolerancias precisas.',NULL,'⚙️','Impresión 3D','Consultar',1,datetime('now')),
  ('imp-003','impresion3d','Prototipos & Maquetas','Prototipado rápido para diseñadores y emprendedores.',NULL,'📐','Impresión 3D','Consultar',1,datetime('now'));

INSERT OR IGNORE INTO courses VALUES
  ('cur-001','Sublimación desde Cero','🎨','4 semanas','Presencial','Proceso completo de sublimación: diseño digital hasta aplicación térmica.','proximamente',1,datetime('now')),
  ('cur-002','Introducción a la Impresión 3D','🖨️','3 semanas','Híbrido','Modelado básico y operación de impresoras FDM.','proximamente',1,datetime('now')),
  ('cur-003','Emprendimiento Creativo','🚀','6 semanas','Online','Marketing, costos y ventas para artesanos digitales.','proximamente',1,datetime('now'));
