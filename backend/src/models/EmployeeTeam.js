const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const EmployeeTeam = sequelize.define('EmployeeTeam', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  employeeId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'employee_id'
  },
  teamId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'team_id'
  }
}, {
  tableName: 'employee_teams',
  timestamps: true
});

module.exports = EmployeeTeam;
