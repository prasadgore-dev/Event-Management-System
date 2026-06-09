const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, authorizeAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, authorizeAdmin, userController.getUsers);

module.exports = router;
