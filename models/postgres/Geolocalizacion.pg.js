const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgresConfig');

const Geolocalizacion = sequelize.define('Geolocalizacion', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  latitud: { type: DataTypes.DOUBLE, allowNull: false },
  longitud: { type: DataTypes.DOUBLE, allowNull: false },
  descripcion: { type: DataTypes.STRING },
  animalId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'animales',
      key: 'id'
    }
  },
  fechaRegistro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'geolocalizaciones',
  timestamps: true
});

module.exports = Geolocalizacion;
