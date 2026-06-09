const jwt = require('jsonwebtoken');
const JWT_CONFIG = require('../config/jwt');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_CONFIG.secret,
    { expiresIn: JWT_CONFIG.accessTokenExpiry }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_CONFIG.refreshSecret,
    { expiresIn: JWT_CONFIG.refreshTokenExpiry }
  );
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, JWT_CONFIG.refreshSecret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
