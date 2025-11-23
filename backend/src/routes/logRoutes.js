const express = require('express');
const { getAllLogs } = require('../controllers/logController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/', getAllLogs);

module.exports = router;
