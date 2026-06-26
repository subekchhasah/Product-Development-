const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecure_aisolutions_token_key_123';

// Register a new admin
exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ where: { username } });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Admin
    const newAdmin = await Admin.create({
      username,
      password: hashedPassword
    });

    // Generate JWT
    const token = jwt.sign(
      { id: newAdmin.id, username: newAdmin.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Admin account created successfully',
      token,
      admin: {
        id: newAdmin.id,
        username: newAdmin.username
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

// Login admin
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find admin
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Verify current admin session
exports.getMe = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id, {
      attributes: ['id', 'username', 'createdAt']
    });
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.status(200).json({ admin });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
