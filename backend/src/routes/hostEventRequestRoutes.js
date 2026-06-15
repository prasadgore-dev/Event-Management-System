const express = require('express');
const hostEventRequestController = require('../controllers/hostEventRequestController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.post('/', hostEventRequestController.createHostEventRequest);
router.get('/my-requests', authenticateToken, hostEventRequestController.getMyHostEventRequests);
router.get('/', authenticateToken, authorizeAdmin, hostEventRequestController.getHostEventRequests);
router.patch('/:id/status', authenticateToken, authorizeAdmin, hostEventRequestController.updateHostEventRequestStatus);

module.exports = router;
