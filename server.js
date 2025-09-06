const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno
dotenv.config();
console.log('🔧 Cargando configuración...');

const app = express();
app.use(cors());
app.use(express.json());

// 🖼️ Servir archivos estáticos de la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 📝 Logger simple de solicitudes y respuestas
app.use((req, res, next) => {
  const startTimeMs = Date.now();
  console.log(`➡️  ${req.method} ${req.originalUrl}`);
  if (Object.keys(req.params || {}).length) console.log('   params:', req.params);
  if (Object.keys(req.query || {}).length) console.log('   query:', req.query);
  if (req.body && Object.keys(req.body).length) console.log('   body:', req.body);

  res.on('finish', () => {
    const durationMs = Date.now() - startTimeMs;
    console.log(`⬅️  ${req.method} ${req.originalUrl} -> ${res.statusCode} (${durationMs}ms)`);
  });
  next();
});

// 🔌 Conectar a MongoDB
require('./config/database');

// 🔌 Cargar modelos y asociaciones de PostgreSQL
const db = require('./models');
const sequelize = db.sequelize;

// 🌐 Rutas agrupadas
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// 🏠 Ruta base
app.get('/', (req, res) => {
  res.send('✅ API funcionando con PostgreSQL y MongoDB en paralelo');
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a PostgreSQL correctamente');

    // ⚙️ Sincronización no destructiva para evitar pérdida de datos
    await sequelize.sync({ alter: true });

    console.log('📦 Tablas recreadas y modelos sincronizados con PostgreSQL');
  } catch (error) {
    console.error('❌ Error al conectar o sincronizar con PostgreSQL:', error.message);
  }
});

// 🧯 Manejadores globales de errores no controlados
process.on('unhandledRejection', (reason) => {
  console.error('⚠️  Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('⚠️  Uncaught Exception:', err);
});
