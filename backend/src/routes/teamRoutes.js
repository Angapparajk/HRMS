const express = require('express');
const {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployeeToTeam,
  unassignEmployeeFromTeam,
  getEmployeeTeams
} = require('../controllers/teamController');
const authMiddleware = require('../middlewares/authMiddleware');
const { logMiddleware } = require('../middlewares/logMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.post('/', logMiddleware('team_created'), createTeam);
router.put('/:id', logMiddleware('team_updated'), updateTeam);
router.delete('/:id', logMiddleware('team_deleted'), deleteTeam);

// Team assignment routes
router.post('/:teamId/assign', logMiddleware('employee_assigned_to_team'), assignEmployeeToTeam);
router.delete('/:teamId/unassign', logMiddleware('employee_unassigned_from_team'), unassignEmployeeFromTeam);

// Check employee team memberships
router.get('/employee/:employeeId/teams', getEmployeeTeams);

module.exports = router;
