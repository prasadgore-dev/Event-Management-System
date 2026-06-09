const express = require('express');
const eventController = require('../controllers/eventController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);

// Admin routes
router.post('/', authenticateToken, authorizeAdmin, eventController.createEvent);
router.put('/:id', authenticateToken, authorizeAdmin, eventController.updateEvent);
router.delete('/:id', authenticateToken, authorizeAdmin, eventController.deleteEvent);

module.exports = router;
