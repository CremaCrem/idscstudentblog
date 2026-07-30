const { verifyToken } = require('../utils/jwt');

/**
 * Middleware: Validates JWT Access Token on protected endpoints
 */
const authGuard = (req, res, next) => {
  try {
    let token;

    // Check Authorization header (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // Check HTTP-only cookie
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Access denied. Authentication token is missing.',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Verify token validity
    const decoded = verifyToken(token);
    req.user = decoded; // { userId, username, role }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired authentication token.',
        timestamp: new Date().toISOString()
      }
    });
  }
};

/**
 * Middleware: Enforces Admin Role Access (RBAC)
 */
const adminGuard = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Access denied. Elevated administrative privileges are required.',
        timestamp: new Date().toISOString()
      }
    });
  }
  next();
};

module.exports = {
  authGuard,
  adminGuard
};
