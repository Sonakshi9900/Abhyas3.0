const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'abhyastre_secret_key_2026';

/**
 * Required Auth Middleware - returns 401 if missing or invalid token
 */
const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  let token = req.header('x-auth-token');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'No authentication token provided. Access denied.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

/**
 * Optional Auth Middleware - attaches req.user if valid token present, otherwise continues
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  let token = req.header('x-auth-token');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      // Ignore invalid token for optional auth
    }
  }
  next();
};

module.exports = { auth, optionalAuth, JWT_SECRET };
