const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgresConfig');



const Veterinario = sequelize.define('Veterinario', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  nombre: { type: DataTypes.STRING, allowNull: false },
  telefono: { type: DataTypes.STRING, allowNull: false },
  especialidad: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  imagen: { type: DataTypes.STRING }

}, {
  tableName: 'veterinarios',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['email'],
      name: 'UQ_veterinarios_email'
    }
  ]
});

module.exports = Veterinario;
