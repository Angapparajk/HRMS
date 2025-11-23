const { Team, Employee, EmployeeTeam } = require('../models');

// Get all teams for the organisation
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.findAll({
      where: { organisationId: req.user.orgId },
      include: [{ model: Employee, as: 'employees', through: { attributes: [] } }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: teams
    });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teams',
      error: error.message
    });
  }
};

// Get single team by ID
const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findOne({
      where: { id, organisationId: req.user.orgId },
      include: [{ model: Employee, as: 'employees', through: { attributes: [] } }]
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    res.json({
      success: true,
      data: team
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching team',
      error: error.message
    });
  }
};

// Create new team
const createTeam = async (req, res) => {
  try {
    const { name, description, employeeIds } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Team name is required'
      });
    }

    // Create team
    const team = await Team.create({
      organisationId: req.user.orgId,
      name,
      description
    });

    // If employees were provided, assign them to the team
    if (employeeIds && Array.isArray(employeeIds) && employeeIds.length > 0) {
      // Verify all employees belong to the organisation
      const employees = await Employee.findAll({
        where: { 
          id: employeeIds,
          organisationId: req.user.orgId
        }
      });

      if (employees.length !== employeeIds.length) {
        await team.destroy(); // Rollback team creation
        return res.status(400).json({
          success: false,
          message: 'One or more employees not found or do not belong to your organisation'
        });
      }

      // Create employee-team assignments
      const assignments = employeeIds.map(employeeId => ({
        employeeId,
        teamId: team.id
      }));

      await EmployeeTeam.bulkCreate(assignments);
    }

    // Fetch the created team with employees
    const teamWithEmployees = await Team.findOne({
      where: { id: team.id },
      include: [{ model: Employee, as: 'employees', through: { attributes: [] } }]
    });

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: teamWithEmployees,
      teamName: teamWithEmployees.name
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating team',
      error: error.message
    });
  }
};

// Update team
const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const team = await Team.findOne({
      where: { id, organisationId: req.user.orgId }
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    await team.update({
      name: name || team.name,
      description: description !== undefined ? description : team.description
    });

    res.json({
      success: true,
      message: 'Team updated successfully',
      data: team,
      teamName: team.name
    });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating team',
      error: error.message
    });
  }
};

// Delete team
const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findOne({
      where: { id, organisationId: req.user.orgId }
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    const teamName = team.name;
    await team.destroy();

    res.json({
      success: true,
      message: 'Team deleted successfully',
      teamName: teamName
    });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting team',
      error: error.message
    });
  }
};

// Assign employee to team
const assignEmployeeToTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    // Verify team belongs to organisation
    const team = await Team.findOne({
      where: { id: teamId, organisationId: req.user.orgId }
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Verify employee belongs to organisation
    const employee = await Employee.findOne({
      where: { id: employeeId, organisationId: req.user.orgId }
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Check if already assigned
    const existing = await EmployeeTeam.findOne({
      where: { employeeId, teamId }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Employee is already assigned to this team'
      });
    }

    // Create assignment
    await EmployeeTeam.create({ employeeId, teamId });

    res.status(201).json({
      success: true,
      message: 'Employee assigned to team successfully',
      teamName: team.name
    });
  } catch (error) {
    console.error('Assign employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning employee to team',
      error: error.message
    });
  }
};

// Unassign employee from team
const unassignEmployeeFromTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { employeeId } = req.body;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID is required'
      });
    }

    // Verify team belongs to organisation
    const team = await Team.findOne({
      where: { id: teamId, organisationId: req.user.orgId }
    });

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Find and delete assignment
    const assignment = await EmployeeTeam.findOne({
      where: { employeeId, teamId }
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Employee is not assigned to this team'
      });
    }

    await assignment.destroy();

    res.json({
      success: true,
      message: 'Employee unassigned from team successfully',
      teamName: team.name
    });
  } catch (error) {
    console.error('Unassign employee error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unassigning employee from team',
      error: error.message
    });
  }
};

// Get employee team memberships (check which teams an employee belongs to)
const getEmployeeTeams = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Verify employee belongs to organisation
    const employee = await Employee.findOne({
      where: { id: employeeId, organisationId: req.user.orgId },
      include: [{
        model: Team,
        as: 'teams',
        through: { attributes: [] }
      }]
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      data: {
        employeeId: employee.id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        teams: employee.teams
      }
    });
  } catch (error) {
    console.error('Get employee teams error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching employee teams',
      error: error.message
    });
  }
};

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployeeToTeam,
  unassignEmployeeFromTeam,
  getEmployeeTeams
};
