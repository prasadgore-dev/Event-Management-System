const User = require('../models/User');

const getUsers = async (req, res) => {
  try {
    const users = await User.findAllWithStats();
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getUsers,
};
