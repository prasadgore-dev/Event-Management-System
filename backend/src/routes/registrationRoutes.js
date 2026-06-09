const express = require('express');
const registrationController = require('../controllers/registrationController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// User routes
router.post('/', authenticateToken, registrationController.registerEvent);
router.delete('/:registrationId', authenticateToken, registrationController.cancelRegistration);
router.get('/user/my-registrations', authenticateToken, registrationController.getUserRegistrations);

// Admin routes
router.get('/event/:eventId', authenticateToken, authorizeAdmin, registrationController.getEventRegistrations);

module.exports = router;
