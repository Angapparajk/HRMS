const Organisation = require('./Organisation');
const User = require('./User');
const Employee = require('./Employee');
const Team = require('./Team');
const EmployeeTeam = require('./EmployeeTeam');
const Log = require('./Log');

// Organisation has many Users
Organisation.hasMany(User, {
  foreignKey: 'organisationId',
  as: 'users',
  onDelete: 'CASCADE'
});
User.belongsTo(Organisation, {
  foreignKey: 'organisationId',
  as: 'organisation'
});

// Organisation has many Employees
Organisation.hasMany(Employee, {
  foreignKey: 'organisationId',
  as: 'employees',
  onDelete: 'CASCADE'
});
Employee.belongsTo(Organisation, {
  foreignKey: 'organisationId',
  as: 'organisation'
});

// Organisation has many Teams
Organisation.hasMany(Team, {
  foreignKey: 'organisationId',
  as: 'teams',
  onDelete: 'CASCADE'
});
Team.belongsTo(Organisation, {
  foreignKey: 'organisationId',
  as: 'organisation'
});

// Organisation has many Logs
Organisation.hasMany(Log, {
  foreignKey: 'organisationId',
  as: 'logs',
  onDelete: 'CASCADE'
});
Log.belongsTo(Organisation, {
  foreignKey: 'organisationId',
  as: 'organisation'
});

// User has many Logs
User.hasMany(Log, {
  foreignKey: 'userId',
  as: 'logs',
  onDelete: 'SET NULL'
});
Log.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Many-to-Many: Employees and Teams through EmployeeTeam
Employee.belongsToMany(Team, {
  through: EmployeeTeam,
  foreignKey: 'employeeId',
  otherKey: 'teamId',
  as: 'teams'
});

Team.belongsToMany(Employee, {
  through: EmployeeTeam,
  foreignKey: 'teamId',
  otherKey: 'employeeId',
  as: 'employees'
});

module.exports = {
  Organisation,
  User,
  Employee,
  Team,
  EmployeeTeam,
  Log
};
