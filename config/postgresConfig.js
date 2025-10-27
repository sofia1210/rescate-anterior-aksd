const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Uso del dialecto mssql
const DIALECT = (process.env.DB_DIALECT || 'postgres').toLowerCase();

// Mapear las variables de entorno dependiendo del dialecto; mantener la compatibilidad con las variables de entorno existentes PG_*
const getConfigByDialect = () => {
  if (DIALECT === 'mssql') {
    return {
      dbName: process.env.MSSQL_DB_NAME || process.env.SQLSRV_DB_NAME || process.env.DB_NAME,
      user: process.env.MSSQL_DB_USER || process.env.SQLSRV_DB_USER || process.env.DB_USER,
      password: process.env.MSSQL_DB_PASSWORD || process.env.SQLSRV_DB_PASSWORD || process.env.DB_PASSWORD,
      options: {
        host: process.env.MSSQL_DB_HOST || process.env.SQLSRV_DB_HOST || process.env.DB_HOST,
        port: Number(process.env.MSSQL_DB_PORT || process.env.SQLSRV_DB_PORT || process.env.DB_PORT) || 1433,
        dialect: 'mssql',
        logging: false,
        dialectOptions: {
          options: {
            encrypt: String(process.env.MSSQL_ENCRYPT || process.env.SQLSRV_ENCRYPT || 'true') === 'true',
            trustServerCertificate: String(process.env.MSSQL_TRUST_SERVER_CERT || process.env.SQLSRV_TRUST_SERVER_CERT || 'true') === 'true'
          }
        }
      }
    };
  }

  // Por defecto: Postgres
  return {
    dbName: process.env.PG_DB_NAME || process.env.DB_NAME,
    user: process.env.PG_DB_USER || process.env.DB_USER,
    password: process.env.PG_DB_PASSWORD || process.env.DB_PASSWORD,
    options: {
      host: process.env.PG_DB_HOST || process.env.DB_HOST,
      port: Number(process.env.PG_DB_PORT || process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      logging: false
    }
  };
};

const cfg = getConfigByDialect();

const sequelize = new Sequelize(cfg.dbName, cfg.user, cfg.password, cfg.options);

sequelize.authenticate()
  .then(() => console.log(`✅ Conectado a ${DIALECT === 'mssql' ? 'SQL Server' : 'PostgreSQL'} correctamente`))
  .catch(err => console.error(`❌ Error en conexión a ${DIALECT === 'mssql' ? 'SQL Server' : 'PostgreSQL'}:`, err));

module.exports = sequelize;
