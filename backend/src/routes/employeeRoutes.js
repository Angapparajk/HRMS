const express = require('express');
const {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const authMiddleware = require('../middlewares/authMiddleware');
const { logMiddleware } = require('../middlewares/logMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', getAllEmployees);
router.get('/:id', getEmployeeById);
router.post('/', logMiddleware('employee_created'), createEmployee);
router.put('/:id', logMiddleware('employee_updated'), updateEmployee);
router.delete('/:id', logMiddleware('employee_deleted'), deleteEmployee);

module.exports = router;
