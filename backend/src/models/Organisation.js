const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Organisation = sequelize.define('Organisation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
}, {
  tableName: 'organisations',
  timestamps: true
});

module.exports = Organisation;
