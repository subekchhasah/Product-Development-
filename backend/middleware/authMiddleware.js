const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecure_aisolutions_token_key_123';

module.exports = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  // Check if Bearer format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Token format invalid' });
  }

  const token = parts[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid or expired' });
  }
};
