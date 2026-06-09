require('dotenv').config();

const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your_secret_key',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key',
  accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || '15m',
  refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '7d',
};

module.exports = JWT_CONFIG;
