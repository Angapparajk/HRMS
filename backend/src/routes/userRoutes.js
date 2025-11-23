const express = require('express');
const { getProfile, updateProfile } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { logMiddleware } = require('../middlewares/logMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', logMiddleware('profile_updated'), updateProfile);

module.exports = router;
