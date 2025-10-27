const { DataTypes } = require('sequelize');
const sequelize = require('../../config/postgresConfig');



const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'users',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['email'],
      name: 'UQ_users_email'
    },
    {
      unique: true,
      fields: ['username'],
      name: 'UQ_users_username'
    }
  ]
});

module.exports = User;