const User = require('../models/User');
const { hashPassword, verifyPassword } = require('../utils/passwordUtils');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/tokenUtils');

const register = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;
    console.log('Register request:', { email, fullName });
    // Validation
    if (!email || !fullName || !password) {
      return res.status(400).json({ error: 'Missing required fields: email, fullName, password' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Check if email exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const user = await User.create(email, fullName, passwordHash);

    res.status(201).json({ message: 'User registered successfully', user: { id: user.id, email, fullName } });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login request:', { email, password: password ? '****' : 'missing' });

    if (!email || !password) {
      console.warn('Login validation failed: Missing email or password');
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      console.warn('Login failed: User not found for email:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await verifyPassword(password, user.password_hash);
    if (!validPassword) {
      console.warn('Login failed: Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('Login successful:', { id: user.id, email: user.email, role: user.role });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, fullName: user.full_name, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(decoded.id);
    const accessToken = generateAccessToken(user);

    res.json({ accessToken });
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  refresh,
};
